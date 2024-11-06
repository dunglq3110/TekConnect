import React, { useState, useEffect  } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { useSelector } from 'react-redux';
import { getHostWebSocket } from '../../services/host/hostGlobalWebSocket';
import { RootState } from '../../store/store';


const HostConnectionPage: React.FC = () => {
  const playerInfo = useSelector((state: RootState) => state.player);
  const [playerName, setPlayerName] = useState(playerInfo.Name || '');

  const handleJoinGame = () => {

    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter a player name');
      return;
    }
    // Send update message
    getHostWebSocket().sendMessage(101, 0, "", {
      Name: playerName,
      MacGun: playerInfo.MacGun,
      MacVest: playerInfo.MacVest
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
  
        {/* Player Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Player Name</Text>
          <TextInput
            style={styles.input}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Enter Player Name"
            placeholderTextColor="#999"
          />
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
  
        {/* Buttons: Image Button and Join Game Button */}
        <View style={styles.buttonRow}>
          {/* Join Game Button */}
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={handleJoinGame}
          >
            <Text style={styles.connectButtonText}>Join Game!</Text>
          </TouchableOpacity>
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
  input: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconButton: {
    height: 50,
    width: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconImage: {
    height: 40,  
    width: 40,   
    resizeMode: 'contain',
  },
  connectButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  statusContainer: {
    paddingHorizontal: 10,
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

export default HostConnectionPage;