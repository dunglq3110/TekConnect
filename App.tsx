import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { Image } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import ConnectionNavigator from './src/screens/Connection/ConnectionNavigator';
import GamePlayNavigator from './src/screens/GamePlay/GamePlayNavigator'; 
import Toast from 'react-native-toast-message';
import GreetingPage from './src/screens/GreetingPage';
import FloatingChatButton from './src/screens/Chat/FloatingChatButton';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [showGreeting, setShowGreeting] = useState(true); // Control showing GreetingPage

  // Function to handle moving to the main app
  const handleGreetingComplete = () => {
    setShowGreeting(false); // Hide GreetingPage after button press
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        {showGreeting ? (
          // Render GreetingPage first if `showGreeting` is true
          <GreetingPage onContinue={handleGreetingComplete} />
        ) : (
          // Render main app content when `showGreeting` is false
          <Drawer.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Drawer.Screen 
              name="Connection" 
              component={ConnectionNavigator}
              options={{
                title: 'Connection',
                drawerIcon: () => (
                  <Image
                    source={require('./assets/icon/social-media.png')}
                    style={{ width: 24, height: 24 }}
                  />
                ),
              }}
            />
            <Drawer.Screen 
              name="GamePlay" 
              component={GamePlayNavigator}
              options={{
                title: 'Game Play',
                drawerIcon: () => (
                  <Image
                    source={require('./assets/icon/joystick.png')}
                    style={{ width: 24, height: 24 }}
                  />
                ),
              }}
            />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
      <FloatingChatButton />
      <Toast />
    </Provider>
  );
}