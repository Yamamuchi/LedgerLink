import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, CheckBox, Picker, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
  const [contractInput, setContractInput] = useState('');
  const [primaryChain, setPrimaryChain] = useState('ethereum');
  const [secondaryChains, setSecondaryChains] = useState([]);
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/static/Inter-Black.ttf'), // Update the path to your font file
  });

  // Create separate state for each checkbox
  const [isPolygonChecked, setPolygonChecked] = useState(false);
  const [isSepoliaChecked, setSepoliaChecked] = useState(false);

  // Create separate state for Cross Chain Replication Type checkboxes
  const [isReplicatedChecked, setReplicatedChecked] = useState(false);
  const [isSingularChecked, setSingularChecked] = useState(false);

  const handleSecondaryChainChange = (chain) => {
    if (secondaryChains.includes(chain)) {
      setSecondaryChains(secondaryChains.filter((c) => c !== chain));
    } else {
      setSecondaryChains([...secondaryChains, chain]);
    }
  };

  const handleDeployContract = () => {
    console.log('Smart Contract:', contractInput);
    console.log('Primary Chain:', primaryChain);
    console.log('Secondary Chains:', secondaryChains);
    // Add your deployment logic here
  };

  const handleConnectWallet = () => {
    // Add logic to connect to the wallet here
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View style={styles.centeredContainer}>
        <Text style={styles.logoText}>LEDGERLINK</Text>
      </View>
      <Pressable
        style={styles.connectButton}
        onPress={handleConnectWallet}
      >
        <Text style={styles.connectButtonText}>Connect to wallet</Text>
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
          onValueChange={(itemValue) => setPrimaryChain(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Ethereum" value="ethereum" />
          <Picker.Item label="Binance Smart Chain" value="bsc" />
          {/* Add more options as needed */}
        </Picker>
      </View>
      <View style={styles.centeredContainer}>
        <Text style={styles.label}>Secondary Chains:</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxAndText}>
          <CheckBox
            value={isPolygonChecked}
            onValueChange={() => setPolygonChecked(!isPolygonChecked)}
            containerStyle={[
              styles.checkbox,
              isPolygonChecked ? styles.checked : styles.unchecked,
            ]}
          />
          <Text style={styles.checkboxText}>Polygon Mumbai</Text>
        </View>
        <View style={styles.checkboxAndText}>
          <CheckBox
            value={isSepoliaChecked}
            onValueChange={() => setSepoliaChecked(!isSepoliaChecked)}
            containerStyle={[
              styles.checkbox,
              isSepoliaChecked ? styles.checked : styles.unchecked,
            ]}
          />
          <Text style={styles.checkboxText}>Sepolia</Text>
        </View>
      </View>

      <View style={styles.centeredContainer}>
        <Text style={styles.label}>Cross Chain Replication Type:</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxAndText}>
          <CheckBox
            value={isReplicatedChecked}
            onValueChange={() => setReplicatedChecked(!isReplicatedChecked)}
            containerStyle={[
              styles.checkbox,
              isReplicatedChecked ? styles.checked : styles.unchecked,
            ]}
          />
          <Text style={styles.checkboxText}>Replicated</Text>
        </View>
        <View style={styles.checkboxAndText}>
          <CheckBox
            value={isSingularChecked}
            onValueChange={() => setSingularChecked(!isSingularChecked)}
            containerStyle={[
              styles.checkbox,
              isSingularChecked ? styles.checked : styles.unchecked,
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
          <Text style={styles.deployButtonText}>DEPLOY</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#6a5acd',
    backgroundImage: 'linear-gradient(45deg, #6a5acd, #a452e0)',
  },
  centeredContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  logoText: {
    fontSize: 60,
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
    width: '25%',
  },
  connectButtonText: {
    fontFamily: 'Inter-Black',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a5acd',
  },
  inputField: {
    marginBottom: 16,
    width: '25%',
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
    width: '25%',
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
    width: '25%',
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
});
