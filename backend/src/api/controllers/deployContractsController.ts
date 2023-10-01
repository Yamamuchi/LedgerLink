import { Request, Response } from 'express';

import { compileContract, generateSignatures, extractPublicAndExternalFunctions } from '../utils/parseContract';
import { generateReplicatedFunctionProxyContract, generateSingularFowardingProxyContract } from '../utils/generateProxyContract';
import { deployContracts, networkType } from '../utils/deployContracts';

export const deploySmartContracts = (req: Request, res: Response) => {
    const smartContract = req.body.smartContract;
    const primaryNetwork: networkType = req.body.primaryNetwork;
    const secondaryNetworks: networkType[] = req.body.secondaryNetworks;

    console.log(req.body);

    if (!smartContract) {
        return res.status(400).json({ error: 'No smart contract provided.' });
    }

    const compiled = compileContract(smartContract);
    const contractName = Object.keys(compiled)[0];
    const contractABI = compiled[contractName].abi;

    const signatures = generateSignatures(contractABI);
    const functions = extractPublicAndExternalFunctions(smartContract);

    const signaturesAndFunctions = signatures.map((item, index) => [item, functions[index]]);
    console.log(signaturesAndFunctions);
    
    const replicatedProxyContractCode = generateReplicatedFunctionProxyContract(signaturesAndFunctions);
    const singularProxyContractCode = generateSingularFowardingProxyContract();

    console.log('--- Original Contract Source ---');
    console.log(smartContract);
    
    console.log('\n--- Extracted Signatures ---');
    signatures.forEach(signature => {
        console.log(signature);
    });
    
    console.log('\n--- Replicated Proxy Contract Code ---');
    console.log(replicatedProxyContractCode);
    
    console.log('\n--- Singular Proxy Contract Code ---');
    console.log(singularProxyContractCode);
    
    console.log('\n--- Deploying Smart Contracts ---');

    const primaryContract = smartContract;
    const primaryContractName = contractName;
    const secondaryContract = replicatedProxyContractCode;
    const secondaryContractName = 'CCIPProxy';

    let deployedAddresses: string[] = [];
    
    deployContracts(primaryNetwork, secondaryNetworks, primaryContract, primaryContractName, secondaryContract, secondaryContractName)
        .then((addresses) => {
            console.log('Deployment complete.');
            console.log('Primary address:', addresses[0]);
            console.log('Secondary addresses:', addresses.slice(1).join(', '));

            res.json({
                primaryAddress: addresses[0],
                secondaryAddresses: addresses.slice(1)
            });
        })
        .catch(err => {
            console.log('Deployment failed.');
            console.log(err);
            res.status(500).json({ error: 'Deployment failed', details: err.message });
        });
};
