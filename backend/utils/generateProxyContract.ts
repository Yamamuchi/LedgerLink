
export function generateProxyContract(contractName: string, contractABI: any[], signatures: string[]): string {
    let proxyCode = `
pragma solidity ^0.8.0;
import "..."; // Your imports here, e.g. for Chainlink's CCIP

contract CCIPProxy {
`;

    signatures.forEach(sig => {
        proxyCode += `
    function ${sig} {
        // Chainlink CCIP call to the primary contract here
    }
`;
    });

    proxyCode += `}`;

    return proxyCode;
}
