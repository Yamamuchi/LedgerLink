export function generateProxyContract(contractName: string, contractABI: any[], signatures: string[]): string {
    let proxyCode = `
pragma solidity ^0.8.0;
import "..."; // Include necessary Chainlink imports here for CCIP

contract CCIPProxy {
    IRouterClient router;
    LinkTokenInterface linkToken;
    address public immutable targetAddress; 

    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); 

    constructor(address _router, address _link, address _targetAddress) {
        router = IRouterClient(_router);
        linkToken = LinkTokenInterface(_link);
        targetAddress = _targetAddress; // Initializing target address
    }
`;

    signatures.forEach(sig => {
        proxyCode += `
    function ${sig} {
        _forwardCCIPMessage("${sig}"); // Passing the entire signature directly
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

        uint256 fees = router.getFee(_destinationChainSelector, message);

        if (fees > linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);

        linkToken.approve(address(router), fees);

        router.ccipSend(_destinationChainSelector, message); 
    }
`;

    proxyCode += `}`;

    return proxyCode;
}
