import { compileContract, generateSignatures, extractPublicAndExternalFunctions } from './utils/parseContract';
import { generateReplicatedFunctionProxyContract, generateSingularFowardingProxyContract } from './utils/generateProxyContract';
import { deployContracts, networkType } from './utils/deployContracts';

const source = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Example {
    function destroyTheWorld() public {}
}
`;

const compiled = compileContract(source);
const contractName = Object.keys(compiled)[0];
const contractABI = compiled[contractName].abi;

const signatures = generateSignatures(contractABI);
const functions = extractPublicAndExternalFunctions(source);

const signaturesAndFunctions = signatures.map((item, index) => [item, functions[index]]);
console.log(signaturesAndFunctions);

const replicatedProxyContractCode = generateReplicatedFunctionProxyContract(signaturesAndFunctions);
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

console.log('\n--- Deploying Smart Contracts ---');
const primaryNetwork: networkType = 'sepolia';
const secondaryNetworks: networkType[] = ['maticmum', 'arbitrum-goerli'];
const primaryContract = source;
const primaryContractName = contractName;
const secondaryContract = replicatedProxyContractCode;
const secondaryContractName = 'CCIPProxy';

deployContracts(primaryNetwork, secondaryNetworks, primaryContract, primaryContractName, secondaryContract, secondaryContractName).then((addresses) => {
    console.log('Deployment complete.');
    console.log('Primary address:', addresses[0]);
    console.log('Secondary addresses:', addresses.slice(1).join(', '));
}).catch(err => {
    console.log('Deployment failed.');
    console.log(err);
});



