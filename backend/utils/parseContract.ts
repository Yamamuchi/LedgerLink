import solc from 'solc';

// This function compiles the Solidity contract and returns the JSON output.
export function compileContract(source: string): any {
    const input = {
        language: 'Solidity',
        sources: {
            'contract.sol': {
                content: source
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
    return output.contracts['contract.sol'];
}

// This function extracts public and external functions from a contract's ABI.
export function extractFunctions(contractABI: any[]): string[] {
    return contractABI
        .filter(item => (item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable')))
        .map(func => func.name);
}

// This function generates function signatures from the function names and their inputs.
export function generateSignatures(contractABI: any[]): string[] {
    return contractABI
        .filter(item => (item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable')))
        .map(func => {
            const params = func.inputs.map((input: any) => input.type).join(',');
            return `${func.name}(${params})`;
        });
}

// // Example Usage
// const source = `
// pragma solidity ^0.8.0;

// contract Example {
//     function mint(address receiver, uint256 amount) public {}
//     function burn(address holder) external {}
// }
// `;

// const compiled = compileContract(source);
// const contractName = Object.keys(compiled)[0];
// const contractABI = compiled[contractName].abi;

// const functions = extractFunctions(contractABI);
// console.log('Functions:', functions);

// const signatures = generateSignatures(contractABI);
// console.log('Signatures:', signatures);