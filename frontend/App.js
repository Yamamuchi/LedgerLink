import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, CheckBox, Picker, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';
import { ethers } from 'ethers';

export default function App() {
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

  useFonts({
    'Inter-Black': require('./assets/fonts/static/Inter-Black.ttf'), 
  });

  const chainlinkLogo = Asset.fromModule(require('./assets/chainlinklogo.png'));

  useEffect(() => {
    const initProvider = async () => {
      const infuraApiKey = 'YOUR_INFURA_API_KEY';
      const infuraProvider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${infuraApiKey}`);
      setProvider(infuraProvider);
    };

    initProvider();
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const signer = provider.getSigner();
        const address = await signer.getAddress();
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
  

  const [isDeploying, setIsDeploying] = useState(false);


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

  const handleDeployContract = async () => {
    setIsDeploying(true);

    console.log('Smart Contract:', contractInput);
    console.log('Primary Chain:', primaryChain);
    console.log('Secondary Chains:', secondaryChains);
    console.log('Replication Type:', crossChainDeploymentType);

    // const formatContractInline = (input) => {
    //   return input.split('\n').map(line => line.trim()).join('\\n');
    // };
  
    // const contract = formatContractInline(contractInput);

    // console.log('Formatted Contract:', contract);

    const requestBody = {
      "smartContract": contractInput,
      "primaryNetwork": primaryChain,
      "secondaryNetworks": secondaryChains,
      "crossChainDeploymentType": crossChainDeploymentType
    };

    // Define your endpoint URL
    const apiEndpoint = 'http://localhost:3000/deploy';

    try {
      // Make the API call
      let response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)  // Send the formatted contract as the body
      });

      // Handle the response (assuming the response is JSON)
      if (response.ok) {
        let jsonResponse = await response.json();
        console.log('API Response:', jsonResponse);
      
        // Show the response as a popup
        alert(
          `Contract Deployment Successful\n\nPrimary Address: ${jsonResponse.primaryAddress}\n\nSecondary Addresses: ${jsonResponse.secondaryAddresses.join(", ")}`,
          [{ text: "HELP" }]
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.centeredContainer}>
        <Text style={styles.logoText}>LedgerLink</Text>
      </View>
      <Pressable style={styles.connectButton} onPress={isConnected ? undefined : connectWallet}>
        <Text style={styles.connectButtonText}>{isConnected ? 'Connected' : 'Connect to wallet'}</Text>
      </Pressable>

      <View style={styles.centeredContainer}>
        <TextInput
          placeholder="Enter smart contract code here ..."
          multiline
          value={contractInput}
          onChangeText={(text) => setContractInput(text)}
          style={styles.inputField}
        />
      </View>
      <View style={styles.centeredContainer}>
        <Text style={styles.label}>Primary Chain:</Text>
      </View>
      <View style={[styles.centeredContainer, styles.pickerContainer]}>
        <Picker
          selectedValue={primaryChain}
          onValueChange={(itemValue) => handlePrimaryChainChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Sepolia" value="sepolia" />
          <Picker.Item label="Polygon Mumbai" value="maticmum" />
          <Picker.Item label="Arbitrum Goerli" value="arbitrum-goerli" />
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
            <Pressable
                style={styles.deployButton}
                onPress={handleDeployContract}
            >
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
                        <Text key={index} style={styles.addressText}>{address}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // Adjust the background color with a slightly increased transparency
    backgroundImage: 'linear-gradient(45deg, rgba(106,90,205,0.8), rgba(164,82,224,0.8))',
    backgroundColor: '#6a5acd',
  },
  centeredContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  logoText: {
    fontSize: 69,
    marginBottom: 5,
    color: '#fff',
    fontFamily: 'Inter-Black',
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
    width: '28%',
  },
  connectButtonText: {
    fontFamily: 'Inter-Black',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a5acd',
  },
  inputField: {
    marginBottom: 16,
    width: '28%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    backgroundColor: '#fff',
    fontFamily: 'Inter-Black',
    borderRadius: 8,
    fontSize: 16,
    color: '#aaa',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter-Black',
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginTop: 4,
  },
  picker: {
    marginBottom: 16,
    width: '28%',
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
    alignSelf: 'center',
  },
  checkboxAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  checked: {
    backgroundColor: 'green',
  },
  unchecked: {
    backgroundColor: 'red',
  },
  checkboxText: {
    color: '#fff',
    fontFamily: 'Inter-Black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deployButton: {
    backgroundColor: '#6a5acd',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 4,
    width: '28%',
    borderColor: '#ccc',
    borderWidth: 2,
    alignSelf: 'center',
  },
  deployButtonText: {
    fontFamily: 'Inter-Black',
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  poweredByContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 75,
    bottom: 20,
    alignItems: 'center',
  },
  bottomRightImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  poweredByTextContainer: {
    marginLeft: 10,
  },
  poweredBy: {
    color: '#fff',
    fontFamily: 'Inter-Black',
    fontSize: 14,
  },
  chainlinkText: {
      color: '#fff',
      fontFamily: 'Inter-Black',
      fontSize: 16,  // adjust as needed
      fontWeight: 'bold',
  },
  addressText: {
    marginTop: 16,
    color: '#fff',
    fontFamily: 'Inter-Black',
    fontSize: 14,
  },
});