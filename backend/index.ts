import { compileContract, generateSignatures } from './utils/parseContract';
import { generateProxyContract } from './utils/generateProxyContract';

const source = `
pragma solidity ^0.8.0;

contract Example {
    function destroyTheWorld() public {}
    function mint(address receiver, uint256 amount) public {}
    function burn(address holder) external {}
}
`;

const compiled = compileContract(source);
const contractName = Object.keys(compiled)[0];
const contractABI = compiled[contractName].abi;

const signatures = generateSignatures(contractABI);
const proxyContractCode = generateProxyContract(contractName, contractABI, signatures);

console.log('--- Original Contract Source ---');
console.log(source);

console.log('\n--- Extracted Signatures ---');
signatures.forEach(signature => {
    console.log(signature);
});

console.log('\n--- Proxy Contract Code ---');
console.log(proxyContractCode);
