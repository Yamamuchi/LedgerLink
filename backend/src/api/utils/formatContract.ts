export function formatContract(contract: string): string {
    return contract.split('\n').map(line => line.trim()).join('\\n');
}