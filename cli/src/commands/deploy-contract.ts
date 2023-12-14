import { Command, Flags } from '@oclif/core';
import * as fs from 'fs/promises';
import * as path from 'path';
import fetch from 'node-fetch';
import { deploySmartContracts } from '../../../backend/src/api/controllers/deployContractsController.js';


export default class DeployContract extends Command {
  static description = 'Deploy a smart contract to a primary chain and optionally to secondary chains';

  static examples = [
    '<%= config.bin %> <%= command.id %> --code "./path/to/contract.sol" --primary sepolia --secondary maticmum,arbitrum-goerli --type replicated',
  ];

  static flags = {
    code: Flags.string({
      char: 'c',
      description: 'path to the contract file',
      required: true,
    }),
    primary: Flags.string({
      char: 'p',
      description: 'Primary chain for deployment',
      options: ['sepolia', 'maticmum', 'arbitrum-goerli'], 
      required: true,
    }),
    secondary: Flags.string({
      char: 's',
      description: 'Comma-separated list of secondary chains for deployment',
      required: true, 
    }),
    type: Flags.string({
      char: 't',
      description: 'Type of deployment (singular or replicated)',
      options: ['singular', 'replicated'], 
      required: true, 
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(DeployContract);

    const primaryChain = flags.primary;
    const secondaryChains = flags.secondary.split(',');
    const deploymentType = flags.type;

    if (secondaryChains.includes(primaryChain)) {
      this.error(`Secondary chains cannot include the primary chain: ${primaryChain}`);
    }

    const contractFilePath = path.resolve(process.cwd(), flags.code);
    let contractCode: string;

    try {
      contractCode = await fs.readFile(contractFilePath, 'utf-8');
      
      this.log(`Smart Contract Code Path: ${contractFilePath}`);
      this.log(`Smart Contract Code (Preview): ${contractCode.substring(0, 100)}...`);

    } catch (error) {
      this.error(`Failed to read contract code from file: ${contractFilePath}`);
    }
  }
}
