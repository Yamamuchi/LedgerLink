// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  CheckBox,
  Picker,
  Image
} from 'react-native';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';
import { ethers } from 'ethers';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles.js'; // Import styles from another file
import { parseConstructor } from '../backend/src/api/utils/parseConstructor';

// Define the main App component
export default function App() {
  // State variables for various aspects of the application
  const [contractInput, setContractInput] = useState('');
  const [primaryChain, setPrimaryChain] = useState('sepolia');
  const [secondaryChains, setSecondaryChains] = useState([]);
  const [crossChainDeploymentType, setCrossChainDeploymentType] = useState(null);
  const [isPolygonChecked, setPolygonChecked] = useState(false);
  const [isSepoliaChecked, setSepoliaChecked] = useState(false);
  const [isArbitrumGoerliChecked, setArbitrumGoerliChecked] = useState(false);
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [primaryAddress, setPrimaryAddress] = useState('');
  const [secondaryAddresses, setSecondaryAddresses] = useState([]);
  const [constructorParams, setConstructorParams] = useState({});
  const [constructorInputs, setConstructorInputs] = useState([]);
  const [parsedConstructorParams, setParsedConstructorParams] = useState([]);

  // Load fonts for the application
  useFonts({
    'Inter-Black': require('./assets/fonts/static/Inter-Black.ttf'),
  });

  // Load the Chainlink logo as an asset
  const chainlinkLogo = Asset.fromModule(require('./assets/Chainlink-white.png'));

  // Initialize the Ethereum provider using Infura
  useEffect(() => {
    const initProvider = async () => {
      const infuraApiKey = 'YOUR_INFURA_API_KEY';
      const infuraProvider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${infuraApiKey}`
      );
      setProvider(infuraProvider);
    };

    initProvider();
  }, []);

  // Function to connect to a wallet
const connectWallet = async () => {
  if (provider) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setPrimaryAddress(address); // Set the primaryAddress state
      setWallet(signer);

      setIsConnected(true); // Update connection status

      alert(`Connected to wallet\n\nAddress: ${address}`);
    } catch (error) {
      console.error('Error connecting to wallet:', error.message);
    }
  } else {
    alert('MetaMask extension is not installed. Please install it to connect your wallet.');
  }
};


  useEffect(() => {
    if (contractInput) {
      // Parse the smart contract code when contractInput changes
      const parsedParams = parseConstructor(contractInput);
      console.log('Parsed Constructor Parameters:', parsedParams);

      // Check if parsedParams is an object with a "Constructor" property
      if (parsedParams && Array.isArray(parsedParams.Constructor)) {
        // Initialize constructorInputs as an array of empty arrays
        const initialInputs = parsedParams.Constructor.map(() => []);
        setConstructorInputs(initialInputs);
        setParsedConstructorParams(parsedParams.Constructor); // Set parsedParams directly
      } else {
        console.error('Parsed Constructor is not in the expected format:', parsedParams);
      }
    }
  }, [contractInput]);

  useEffect(() => {
    console.log('Parsed Constructor Parameters:', parsedConstructorParams);
  }, [parsedConstructorParams]);
  
  
  

  // State variable to track deployment status
  const [isDeploying, setIsDeploying] = useState(false);

  // Function to handle primary chain selection
  const handlePrimaryChainChange = (value) => {
    setPrimaryChain(value);
    if (secondaryChains.includes(value)) {
      setSecondaryChains(secondaryChains.filter((c) => c !== value));
      if (value === 'sepolia') {
        setSepoliaChecked(false);
      } else if (value === 'maticmum') {
        setPolygonChecked(false);
      } else if (value === 'arbitrum-goerli') {
        setArbitrumGoerliChecked(false);
      }
    }
  };

  // Function to handle secondary chain selection
  const handleSecondaryChainChange = (chain) => {
    if (chain === primaryChain) {
      alert('You cannot select the same chain as both primary and secondary.');
      return;
    }
    if (secondaryChains.includes(chain)) {
      setSecondaryChains(secondaryChains.filter((c) => c !== chain));
    } else {
      setSecondaryChains([...secondaryChains, chain]);
    }
  };

  // Function to handle contract deployment
  const handleDeployContract = async () => {
    setIsDeploying(true);

    console.log('Smart Contract:', contractInput);
    console.log('Primary Chain:', primaryChain);
    console.log('Secondary Chains:', secondaryChains);
    console.log('Replication Type:', crossChainDeploymentType);

    // Define the request body for API call
    const requestBody = {
      smartContract: contractInput,
      primaryNetwork: primaryChain,
      secondaryNetworks: secondaryChains,
      crossChainDeploymentType: crossChainDeploymentType,
    };

    // Define the API endpoint URL
    const apiEndpoint = 'http://localhost:3000/deploy';

    try {
      // Make the API call to deploy the contract
      let response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Send the formatted contract as the body
      });

      // Handle the response (assuming the response is JSON)
      if (response.ok) {
        let jsonResponse = await response.json();
        console.log('API Response:', jsonResponse);

        // Show the response as a popup
        alert(
          `Contract Deployment Successful\n\nPrimary Address: ${jsonResponse.primaryAddress}\n\nSecondary Addresses: ${jsonResponse.secondaryAddresses.join(
            ', '
          )}`,
          [{ text: 'Ok' }]
        );

        setPrimaryAddress(jsonResponse.primaryAddress);
        setSecondaryAddresses(jsonResponse.secondaryAddresses);
      } else {
        console.error('API Error:', response.statusText);
      }

      setIsDeploying(false);
    } catch (error) {
      console.error('Fetch error:', error.message);
      setIsDeploying(false);
    }
  };

  // Return the JSX for the App component
  return (
    <LinearGradient
      colors={['purple', 'pink']} // Updated gradient colors to purple and pink
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.centeredContainer}>
          <Text style={styles.logoText}>LedgerLink</Text>
        </View>
        <Pressable style={styles.connectButton} onPress={isConnected ? undefined : connectWallet}>
          <Text style={styles.connectButtonText}>
          {isConnected ? (
            `Connected: ${primaryAddress.substring(0, 6)}...${primaryAddress.substring(38)}`
          ) : (
            'Connect to wallet'
          )}

          </Text>
        </Pressable>


        <View style={styles.centeredContainer}>
          <Text style={styles.label}>Smart Contract Code:</Text>
          <TextInput
            placeholder="Enter smart contract code here ..."
            multiline
            value={contractInput}
            onChangeText={(text) => setContractInput(text)}
            style={styles.inputField}
          />
        </View>
        
        {Array.isArray(parsedConstructorParams) && parsedConstructorParams.map((param, paramIndex) => (
          <View key={paramIndex} style={styles.centeredContainer}>
            <TextInput
              key={paramIndex}
              placeholder={`Enter ${param.name} (${param.type})`}
              value={constructorInputs[paramIndex] || ''}
              onChangeText={(text) => {
                const updatedInputs = [...constructorInputs];
                updatedInputs[paramIndex] = text;
                setConstructorInputs(updatedInputs);
              }}
              style={styles.inputField}
            />
          </View>
        ))}





        
        <View style={styles.centeredContainer}>
          <Text style={styles.label}>Primary Chain:</Text>
        </View>
        <View style={[styles.centeredContainer, styles.pickerContainer]}>
          <Picker selectedValue={primaryChain} onValueChange={(itemValue) => handlePrimaryChainChange(itemValue)} style={styles.picker} >
            <Picker.Item label="Sepolia" value="sepolia" itemTextStyle={styles.pickerItem} />
            <Picker.Item label="Polygon Mumbai" value="maticmum" style={styles.pickerItem} />
            <Picker.Item label="Arbitrum Goerli" value="arbitrum-goerli" style={styles.pickerItem} />
          </Picker>
        </View>
        
        <View style={styles.centeredContainer}>
          <Text style={styles.label}>Secondary Chains:</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxAndText}>
            <CheckBox
              value={isSepoliaChecked}
              onValueChange={() => {
                if (primaryChain !== 'sepolia') {
                  setSepoliaChecked(!isSepoliaChecked);
                  handleSecondaryChainChange('sepolia');
                } else {
                  alert('You cannot select the same chain as both primary and secondary.');
                }
              }}
            />
            <Text style={styles.checkboxText}>Sepolia</Text>
          </View>
          <View style={styles.checkboxAndText}>
            <CheckBox
              value={isPolygonChecked}
              onValueChange={() => {
                if (primaryChain !== 'maticmum') {
                  setPolygonChecked(!isPolygonChecked);
                  handleSecondaryChainChange('maticmum');
                } else {
                  alert('You cannot select the same chain as both primary and secondary.');
                }
              }}
            />
            <Text style={styles.checkboxText}>Polygon Mumbai</Text>
          </View>
          <View style={styles.checkboxAndText}>
            <CheckBox
              value={isArbitrumGoerliChecked}
              onValueChange={() => {
                if (primaryChain !== 'arbitrum-goerli') {
                  setArbitrumGoerliChecked(!isArbitrumGoerliChecked);
                  handleSecondaryChainChange('arbitrum-goerli');
                } else {
                  alert('You cannot select the same chain as both primary and secondary.');
                }
              }}
            />
            <Text style={styles.checkboxText}>Arbitrum Goerli</Text>
          </View>
        </View>
        
        <View style={styles.centeredContainer}>
          <Text style={styles.label}>Cross Chain Replication Type:</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxAndText}>
            <CheckBox
              value={crossChainDeploymentType === 'replicated'}
              onValueChange={() => setCrossChainDeploymentType('replicated')}
              containerStyle={[
                styles.checkbox,
                crossChainDeploymentType === 'replicated' ? styles.checked : styles.unchecked,
              ]}
            />
            <Text style={styles.checkboxText}>Replicated</Text>
          </View>
          <View style={styles.checkboxAndText}>
            <CheckBox
              value={crossChainDeploymentType === 'singular'}
              onValueChange={() => setCrossChainDeploymentType('singular')}
              containerStyle={[
                styles.checkbox,
                crossChainDeploymentType === 'singular' ? styles.checked : styles.unchecked,
              ]}
            />
            <Text style={styles.checkboxText}>Singular</Text>
          </View>
        </View>

        <View style={styles.centeredContainer}>
          <Pressable style={styles.deployButton} onPress={handleDeployContract}>
            <Text style={styles.deployButtonText}>
              {isDeploying ? 'Deploying...' : 'DEPLOY'}
            </Text>
          </Pressable>

          {primaryAddress && (
            <View>
              <Text style={styles.addressText}>Primary Address:</Text>
              <Text style={styles.addressText}>{primaryAddress}</Text>
            </View>
          )}

          {secondaryAddresses.length > 0 && (
            <View>
              <Text style={styles.addressText}>Secondary Addresses:</Text>
              {secondaryAddresses.map((address, index) => (
                <Text key={index} style={styles.addressText}>
                  {address}
                </Text>
              ))}
            </View>
          )}
        </View>
        <View style={styles.poweredByContainer}>
          <Image source={chainlinkLogo} style={styles.bottomRightImage} />
          <View style={styles.poweredByTextContainer}>
            <Text style={styles.poweredBy}>Powered by</Text>
            <Text style={styles.chainlinkText}>Chainlink</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
