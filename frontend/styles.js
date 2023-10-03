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
    pickerItem: {
      fontFamily: 'Inter-Black',
      fontSize: 16,  // Adjust the font size as needed
      color: '#fff', // Adjust the text color as needed
    },
  });