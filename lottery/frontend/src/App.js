import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import 'flowbite/dist/flowbite.min.css';
import { Web3Provider } from "@ethersproject/providers";

function App() {
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Function to check if MetaMask is already connected
  const checkMetaMaskConnection = async () => {
    if (window.ethereum && window.ethereum.isConnected()) {
      const providerInstance = new Web3Provider(window.ethereum);
      setProvider(providerInstance);

      const signer = providerInstance.getSigner();
      try {
        const address = await signer.getAddress();
        setWalletAddress(address);
        setWallet(signer);
        setIsConnected(true);
      } catch (error) {
        console.error("Error getting address:", error);
        setIsConnected(false);
      }
    } else {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      checkMetaMaskConnection();

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setIsConnected(false);
        } else {
          checkMetaMaskConnection();
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const providerInstance = new Web3Provider(window.ethereum);
        setProvider(providerInstance);

        const signer = providerInstance.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setWallet(signer);
        setIsConnected(true);

        alert(`Connected to wallet\n\nAddress: ${address}`);
      } catch (error) {
        console.error('Error connecting to wallet:', error.message);
      }
    } else {
      alert('MetaMask or other Ethereum wallet extension is not installed. Please install it to connect your wallet.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 p-8 items-center">
        <div className="mt-8 mb-12 text-center">
            <h1 className="text-5xl text-white font-bold tracking-wide">Cross-Chain Lottery</h1>
            <p className="text-xl text-gray-400 mt-4">Connect your wallet to get started.</p>
        </div>

        <Button 
            variant="primary" 
            onClick={connectWallet}
            className="text-2xl transition-transform transform hover:scale-105 mb-4"
        >
            {isConnected ? `Connected to ${walletAddress}` : "Connect to Wallet"}
        </Button>

        {isConnected && (
            <div className="text-xl space-x-4 mt-4 flex">
                <Button variant="primary" className="mr-2">Join the lottery</Button>
            </div>
        )}
    </div>
  );
}

export default App;
