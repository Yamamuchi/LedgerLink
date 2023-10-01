import { Client } from "../contracts/Client";
import { IRouterClient } from "../contracts/IRouterClient";
import { LinkTokenInterface } from "../contracts/LinkTokenInterface";

export function generateReplicatedFunctionProxyContract(signaturesAndFunctions: string[][]): string {
    let proxyCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

${IRouterClient}
${LinkTokenInterface}

contract CCIPProxy {
    IRouterClient router;
    LinkTokenInterface linkToken;
    address public immutable targetAddress; 
    uint64 public immutable destinationChainSelector;

    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); 

    constructor(address _router, address _link, address _targetAddress, uint64 _destinationChainSelector) {
        router = IRouterClient(_router);
        linkToken = LinkTokenInterface(_link);
        targetAddress = _targetAddress;
        destinationChainSelector = _destinationChainSelector; 
    }
`;

    signaturesAndFunctions.forEach(([signature, func]) => {
        proxyCode += `
    ${func} {
        _forwardCCIPMessage("${signature}"); // Passing the entire signature directly
    }
`;
    });

    proxyCode += `
    function _forwardCCIPMessage(string memory signature) private {
        // Constructing the CCIP message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(address(this)), // This might need adjustment based on specific use-cases
            data: abi.encodeWithSignature(signature, targetAddress), // Using the immutable target address
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_000, strict: false})
            ),
            feeToken: address(linkToken)
        });

        uint256 fees = router.getFee(destinationChainSelector, message);

        if (fees > linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);

        linkToken.approve(address(router), fees);

        router.ccipSend(destinationChainSelector, message); 
    }
`;

    proxyCode += `}`;

    return proxyCode;
}

export function generateSingularFowardingProxyContract(): string {
    // Contract template
    let proxyCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

${IRouterClient}
${LinkTokenInterface}

contract CCIPProxy {
    IRouterClient router;
    LinkTokenInterface linkToken;
    address public immutable targetAddress; 
    address public owner;
    uint64 public immutable destinationChainSelector;

    mapping(string => bool) public allowList;

    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error FunctionNotAllowlisted(string signature);
    error NotOwner();

    constructor(address _router, address _link, address _targetAddress, uint64 _destinationChainSelector) {
        router = IRouterClient(_router);
        linkToken = LinkTokenInterface(_link);
        targetAddress = _targetAddress; 
        owner = msg.sender; 
        destinationChainSelector = _destinationChainSelector; 
    }

    modifier onlyOwner() {
        if(msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    function addToAllowList(string memory signature) external onlyOwner {
        allowList[signature] = true;
    }

    function removeFromAllowList(string memory signature) external onlyOwner {
        allowList[signature] = false;
    }

    function forward(string memory signature, bytes memory data) external {
        if(!allowList[signature]) {
            revert FunctionNotAllowlisted(signature);
        }
        _forwardCCIPMessage(signature, data);
    }

    function _forwardCCIPMessage(string memory signature, bytes memory data) private {
        // Constructing the CCIP message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(address(this)), // This might need adjustment based on specific use-cases
            data: abi.encodeWithSignature(signature, data),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_000, strict: false})
            ),
            feeToken: address(linkToken)
        });

        uint256 fees = router.getFee(destinationChainSelector, message);

        if (fees > linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);

        linkToken.approve(address(router), fees);

        router.ccipSend(destinationChainSelector, message); 
    }
}`;

    return proxyCode;
}
