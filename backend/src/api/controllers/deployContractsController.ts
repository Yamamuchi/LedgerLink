import { Request, Response } from 'express';

import { compileContract, extractSignatures, extractPublicAndExternalFunctions } from '../utils/parseContract';
import { generateReplicatedFunctionProxyContract, generateSingularFowardingProxyContract } from '../utils/generateProxyContract';
import { deployContracts, networkType, deploymentType } from '../utils/deployContracts';

export const deploySmartContracts = (req: Request, res: Response) => {
    const smartContract = req.body.smartContract;
    const primaryNetwork: networkType = req.body.primaryNetwork;
    const secondaryNetworks: networkType[] = req.body.secondaryNetworks;
    const crossChainDeploymentType: deploymentType = req.body.crossChainDeploymentType;

    console.log(req.body);

    if (!smartContract) {
        return res.status(400).json({ error: 'No smart contract provided.' });
    }

    const compiled = compileContract(smartContract);
    const contractName = Object.keys(compiled)[0];
    const contractABI = compiled[contractName].abi;

    const functions = extractPublicAndExternalFunctions(smartContract);
    const signatures = extractSignatures(functions);

    console.log(`funcs: ${functions}`)
    console.log(`signatures: ${signatures}`)

    const signaturesAndFunctions = signatures.map((item: string, index: number) => [item, functions[index]]);
    console.log(`hello: ${signaturesAndFunctions}`);

    console.log('--- Original Contract Source ---');
    console.log(smartContract);
    
    console.log('\n--- Extracted Signatures ---');

    
    console.log('\n--- Deploying Smart Contracts ---');

    const primaryContract = smartContract;
    const primaryContractName = contractName;


    deployContracts(primaryNetwork, secondaryNetworks, primaryContract, primaryContractName, signaturesAndFunctions)
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
