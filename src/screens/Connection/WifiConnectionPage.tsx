import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
  ScrollView,
  PermissionsAndroid
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { useSelector } from 'react-redux';
import { RootState } from   '../../store/store';
import Toast from 'react-native-toast-message';
import { getGunWebSocket } from '../../services/gun/gunGlobalWebSocket';
import { getHostWebSocket } from '../../services/host/hostGlobalWebSocket';

const WifiConnectionPage: React.FC = () => {

  const [gunIpAddress, setGunIpAddress] = useState('');
  const [hostIP, setHostIP] = useState('');
  const playerInfo = useSelector((state: RootState) => state.player);

  const HandleConnectGunIP = () => {
    if (!gunIpAddress.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: `Please enter Gun's IP Address`,
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }  
    getGunWebSocket().connect('ws://' + gunIpAddress + ':81/ws');
  };

  const handleConnectHost = () => {
    if (!hostIP.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: `Please enter Host's IP Address`,
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }  
    getHostWebSocket().connect('ws://' + hostIP + ':8080/TekHub');
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Host IP Address Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Host IP Address</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={hostIP}
              onChangeText={setHostIP}
              placeholder="Enter Host IP Address"
              placeholderTextColor="#999"
              editable={!playerInfo.HostConnected}
            />
            <TouchableOpacity 
              style={[
                styles.iconButton,
                playerInfo.HostConnected && styles.iconButtonDisabled,
              ]}
              onPress={handleConnectHost}
              disabled={playerInfo.HostConnected}
            >
              <Image
                source={
                  playerInfo.HostConnected
                    ? require('../../../assets/icon/check.png')
                    : require('../../../assets/icon/no-connection.png')
                }
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gun IP Address Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gun's IP Address</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={gunIpAddress}
              onChangeText={setGunIpAddress}
              placeholder="Enter Gun's IP Address"
              placeholderTextColor="#999"
              editable={!playerInfo.GunConnected}
            />
            <TouchableOpacity 
              style={[
                styles.iconButton,
                playerInfo.GunConnected && styles.iconButtonDisabled,
              ]}
              onPress={HandleConnectGunIP}
              disabled={playerInfo.GunConnected}
            >
              <Image
                source={
                  playerInfo.GunConnected
                    ? require('../../../assets/icon/check.png')
                    : require('../../../assets/icon/no-connection.png')
                }
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Connection Status Display */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Host Connection: 
            <Text style={playerInfo.HostConnected ? styles.connectedText : styles.disconnectedText}>
              {playerInfo.HostConnected ? ' Connected' : ' Disconnected'}
            </Text>
          </Text>
          <Text style={styles.statusText}>
            Gun Connection: 
            <Text style={playerInfo.GunConnected ? styles.connectedText : styles.disconnectedText}>
              {playerInfo.GunConnected ? ' Connected' : ' Disconnected'}
            </Text>
          </Text>
          <Text style={styles.statusText}>
            Vest Connection: 
            <Text style={playerInfo.VestConnected ? styles.connectedText : styles.disconnectedText}>
              {playerInfo.VestConnected ? ' Connected' : ' Disconnected'}
            </Text>
          </Text>
        </View>


      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  iconButton: {
    backgroundColor: '#007AFF',
    height: 50,
    width: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconButtonDisabled: {
    backgroundColor: 'transparent',
  },
  iconImage: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  statusContainer: {
    paddingHorizontal: 10,
    marginBottom: 20, // Add space at the bottom of the page
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
  },
  connectedText: {
    color: 'green',
  },
  disconnectedText: {
    color: 'red',
  },
});



export default WifiConnectionPage;