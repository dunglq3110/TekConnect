import React from 'react';
import { View, Text, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from   '../../store/store';
import { getHostWebSocket } from '../../services/host/hostGlobalWebSocket';
import { PlayerData } from '../../services/host/hostTypes';
const CredentialConnectionPage : React.FC = () => {

    const playerInfo = useSelector((state: RootState) => state.player);
    return (
        <View style={{ flex: 1, padding: 20 }}>
          <Text>Player Name: {playerInfo.Name}</Text>
          <Text>Gun MAC: {playerInfo.MacGun}</Text>
          <Text>Vest MAC: {playerInfo.MacVest}</Text>      
        </View>
      );
}

export default CredentialConnectionPage;