import * as dotenvenc from '@chainlink/env-enc'
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { generateReplicatedFunctionProxyContract, generateSingularFowardingProxyContract } from '../utils/generateProxyContract';

dotenvenc.config();
const solc = require('solc');

export type networkType = 'arbitrum-goerli' | 'maticmum' | 'sepolia';
export type deploymentType = 'replicated' | 'singular';

interface ConstructorArgsMapping {
    [network: string]: any[];
}

const networkConstructorArguments: ConstructorArgsMapping = {
    'sepolia': ["0xD0daae2231E9CB96b94C8512223533293C3693Bf", "0x779877A7B0D9E8603169DdbD7836e478b4624789", BigNumber.from("16015286601757825753")],
    'arbitrum-goerli': ["0x88E492127709447A5ABEFdaB8788a15B4567589E", "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28", BigNumber.from("6101244977088475029")],
    'maticmum': ["0x70499c328e1E2a3c41108bd3730F6670a44595D1", "0x326C977E6efc84E512bB9C30f76E30c160eD06FB", BigNumber.from("12532609583862916517")],
};

function compileProxyContract(sourceCode: string, contractName: string) {
    // Compile the source code
    const input = {
        language: 'Solidity',
        sources: {
            'CCIPProxy.sol': {
                content: sourceCode
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        console.error('Compilation errors:', output.errors);
        return null;
    }

    const contract = output.contracts['CCIPProxy.sol'][contractName];
    return {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
    };
}

function compileMainContract(sourceCode: string) {

    const input = {
        language: 'Solidity',
        sources: {
            'Pseudorandom.sol': {
                content: sourceCode
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        console.error('Compilation errors:', output.errors);
        return null;
    }

    const contract = output.contracts['Pseudorandom.sol']['Pseudorandom'];
    return {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
    };
}

async function deploySmartContract(wallet: ethers.Wallet, smartContract: string, smartContractName: string, ...args: any[]): Promise<string> {

    console.log(smartContract)
    let contract: any;

    if (smartContractName == 'CCIPProxy') {
        contract = compileProxyContract(smartContract, smartContractName);
    } else {
        contract = compileMainContract(smartContract);
    }

    console.log(contract);

    if (!contract) {
        throw new Error('Failed to compile the smart contract.');
    }

    const contractFactory = new ethers.ContractFactory(
      contract.abi,
      contract.bytecode,
      wallet
    );

    // Deploy the contract
    const deploymentTransaction = await contractFactory.getDeployTransaction(...args);
    const txResponse = await wallet.sendTransaction(deploymentTransaction);
  
    // Wait for the transaction to be mined and get the receipt
    const receipt = await txResponse.wait();
  
    // Check if 'receipt' is null or undefined
    if (!receipt) {
      throw new Error('Transaction receipt is null. Deployment might have failed.');
    }
  
    // The contract address is available in the receipt
    const contractAddress = receipt.contractAddress || '0x0';

    return contractAddress;
}

async function connectWallet(network: string): Promise<ethers.Wallet> {
    let providerUrl: string;

    if (network == 'arbitrum-goerli') {
        providerUrl = process.env.INFURA_ARBITRUM_GOERLI_URL!;
    } else if (network == 'maticmum') {
        providerUrl = process.env.INFURA_MUMBAI_URL!;
    } else if (network == 'sepolia') {
        providerUrl = process.env.INFURA_SEPOLIA_URL!;
    } else {
        throw new Error('Network not supported.');
    }

    const privateKey = process.env.PRIVATE_KEY;
    const provider = new ethers.providers.InfuraProvider(network, {
        projectId: "8c5559aecb814cf589d38436b3bcb2da",
        projectSecret: "9c7fb95161ef4fae8bcedb66b9f89c4f"});
    const wallet = new ethers.Wallet(privateKey!, provider);

    return wallet;
}

export async function deployContracts(
        primaryNetwork: networkType, 
        secondaryNetworks: networkType[], 
        primaryContract: string,
        primaryContractName: string,
        signaturesAndFunctions: string[][],
    ): Promise<string[]> {


    const proxyContractName = 'CCIPProxy';

    let wallet = await connectWallet(primaryNetwork);

    console.log('Hello');
    console.log(`Deploying to primary network: ${primaryNetwork}...`);
    console.log(`Hello: ${networkConstructorArguments[primaryNetwork][0]}`)
    console.log('Hello');
    const primaryAddress = await deploySmartContract(wallet, primaryContract, primaryContractName, networkConstructorArguments[primaryNetwork][0]);

    const proxyContract = generateReplicatedFunctionProxyContract(signaturesAndFunctions, primaryAddress);

    console.log('\n--- Replicated Proxy Contract Code ---');
    console.log(proxyContract);
    

    const promises = secondaryNetworks.map(async (network) => {
        console.log(`Deploying to secondary network: ${network}...`);

        wallet = await connectWallet(network);

        const address = await deploySmartContract(wallet, 
            proxyContract, 
            proxyContractName, 
            networkConstructorArguments[network][0],
            networkConstructorArguments[network][1],
            primaryAddress,
            networkConstructorArguments[primaryNetwork][2].toString());
        return address;
    });

    const addresses = await Promise.all(promises);

    return [primaryAddress, ...addresses];
}


