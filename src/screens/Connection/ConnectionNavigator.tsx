
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WifiConnectionPage from './WifiConnectionPage';
import HostConnectionPage from './HostConnectionPage';
import CredentialConnectionPage from './CredentialConnectionPage';
import { Image } from 'react-native';
const ConnectionTab = createBottomTabNavigator();
const ConnectionNavigator = () => {
  return (
    <ConnectionTab.Navigator>
      <ConnectionTab.Screen 
        name="Connectivity" 
        component={WifiConnectionPage}
        options={{
          tabBarLabel: 'Connectivity',
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('../../../assets/icon/no-connection.png')} // Update with your icon path
              style={{ width: 24, height: 24 }} // Set the desired width and height
            />
          ),
        }}
      />
      <ConnectionTab.Screen 
        name="Join Game" 
        component={HostConnectionPage}
        options={{
          tabBarLabel: 'Join Game',
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('../../../assets/icon/joystick.png')} // Update with your icon path
              style={{ width: 24, height: 24 }} // Set the desired width and height
            />
          ),
        }}
      />
    </ConnectionTab.Navigator>
  );
};
export default ConnectionNavigator;