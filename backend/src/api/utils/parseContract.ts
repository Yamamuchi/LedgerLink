import solc from 'solc';

export function compileContract(source: string): any {
    console.log("Raw contract source:", source);

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
    console.log("Compiler output:", output);
    return output.contracts['contract.sol'];
}

export function extractPublicAndExternalFunctions(contract: string): string[] {
    const functionRegex = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(public|external)/g;

    let match;
    const functions = [];

    while ((match = functionRegex.exec(contract)) !== null) {
        functions.push(`function ${match[1]}(${match[2]}) ${match[3]}`);
    }

    return functions;
}


export function generateSignatures(contractABI: any[]): string[] {
    return contractABI
        .filter(item => (item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable')))
        .map(func => {
            const params = func.inputs.map((input: any) => input.type).join(',');
            return `${func.name}(${params})`;
        });
}