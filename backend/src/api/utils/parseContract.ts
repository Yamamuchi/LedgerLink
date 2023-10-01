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
        const functionName = match[1];
        if (functionName !== "supportsInterface" && functionName !== "ccipReceive" && functionName !== "getRouter") {
            functions.push(`function ${functionName}(${match[2]}) ${match[3]}`);
        }
    }

    return functions;
}

export function extractSignatures(functionList: string[]): string[] {
    const regex = /function (\w+?)\((.*?)\)/;

    return functionList
        .map(funcString => {
            const match = funcString.match(regex);
            return match ? `${match[1]}(${match[2]})` : null;
        })
        .filter(signature => 
            signature && 
            !signature.startsWith("ccipReceive(") && 
            !signature.startsWith("supportsInterface(")
        )
        .filter(Boolean) as string[]; 
}
