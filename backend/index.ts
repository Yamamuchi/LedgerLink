import { compileContract, generateSignatures } from './utils/parseContract';
import { generateReplicatedFunctionProxyContract, generateSingularFowardingProxyContract } from './utils/generateProxyContract';
import { deployMainSmartContract } from './utils/deployMainSmartContract';

const source = `
// SPDX-License-Identifier: MIT
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
const replicatedProxyContractCode = generateReplicatedFunctionProxyContract(signatures);
const singularProxyContractCode = generateSingularFowardingProxyContract();

console.log('--- Original Contract Source ---');
console.log(source);

console.log('\n--- Extracted Signatures ---');
signatures.forEach(signature => {
    console.log(signature);
});

console.log('\n--- Replicated Proxy Contract Code ---');
console.log(replicatedProxyContractCode);

console.log('\n--- Singular Proxy Contract Code ---');
console.log(singularProxyContractCode);

console.log('\n--- Deploying Main Smart Contract ---');
deployMainSmartContract(source, 'Example', 'sepolia').then(address => {
    console.log('Address:', address);
});

