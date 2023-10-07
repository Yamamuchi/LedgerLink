import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      padding: 16,
    },
    centeredContainer: {
      alignItems: 'center',
      marginTop: 8,
    },
    logoText: {
      fontSize: 110,
      marginBottom: 5,
      color: '#fff',
      fontFamily: 'Druk',
      fontWeight: 'bold',
    },
    // Move the connectButton to the top-right corner and make it slightly bigger
    connectButton: {
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12, // Increased padding for vertical space
      paddingHorizontal: 16, // Increased padding for horizontal space
      borderRadius: 8,
      position: 'absolute',
      top: 16, // Adjust the top position as needed
      right: 16, // Adjust the right position as needed
    },
    connectButtonText: {
      fontFamily: 'Inter-Black',
      fontSize: 14, // Adjust the font size as needed
      fontWeight: 'bold',
      color: '#6a5acd',
    },
    inputField: {
      marginBottom: 0.1,
      width: '28%',
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 8,
      backgroundColor: '#fff',
      fontFamily: 'Inter-Black',
      borderRadius: 8,
      fontSize: 14,
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
      marginTop: 8,
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
      fontFamily: 'Inter-Thin',
      fontSize: 14,
      fontWeight: 'bold',
    },
    deployButton: {
      backgroundColor: '#FF1493',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 8,
      marginTop: 8,
      width: '28%',
      borderColor: '#ccc',
      borderWidth: 2,
      alignSelf: 'center',
    },
    deployButtonText: {
      fontFamily: 'Druk2',
      fontSize: 45,
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
      fontSize: 16,
      fontWeight: 'bold',
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
    pickerItem: {
      fontFamily: 'Druk',
      fontSize: 16,  // Adjust the font size as needed
      color: '#fff', // Adjust the text color as needed
    },
  });