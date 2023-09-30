import * as dotenvenc from '@chainlink/env-enc'
import { ethers } from "ethers";

dotenvenc.config();
const solc = require('solc');

export type networkType = 'arbitrum_georli' | 'mumbai' | 'sepolia';

function compileContract(sourceCode: string, contractName: string) {
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

export async function deployMainSmartContract(smartContract: string, smartContractName: string, network: networkType): Promise<string> {

    const wallet = await connectWallet(network);

    const contract = compileContract(smartContract, smartContractName);

    if (!contract) {
        throw new Error('Failed to compile the smart contract.');
    }

    const contractFactory = new ethers.ContractFactory(
      contract.abi,
      contract.bytecode,
      wallet
    );
  
    // Deploy the contract
    const deploymentTransaction = await contractFactory.getDeployTransaction();
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
    let providerUrl: string;  // Declare providerUrl here

    if (network == 'arbitrum_georli') {
        providerUrl = process.env.INFURA_ARBITRUM_GOERLI_URL!;
    } else if (network == 'mumbai') {
        providerUrl = process.env.INFURA_MUMBAI_URL!;
    } else if (network == 'sepolia') {
        providerUrl = process.env.INFURA_SEPOLIA_URL!;
    } else {
        throw new Error('Network not supported.');
    }

    const privateKey = process.env.PRIVATE_KEY;
    const provider = ethers.getDefaultProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey!, provider);

    return wallet;
}
