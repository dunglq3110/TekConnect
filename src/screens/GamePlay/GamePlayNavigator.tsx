import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlayerStatPage from './PlayerStatPage';
import PlayerAttributePage from './PlayerAttributePage';
import UpgradesPage from './UpgradesPage';
import { Image } from 'react-native';
const GamePlayTab = createBottomTabNavigator();
const GamePlayNavigator = () => {
  return (
    <GamePlayTab.Navigator>
      <GamePlayTab.Screen 
        name="PlayerStat" 
        component={PlayerStatPage}
        options={{
          tabBarLabel: 'Player Stat',
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('../../../assets/icon/user.png')} // Update with your icon path
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <GamePlayTab.Screen 
        name="PlayerAttribute" 
        component={PlayerAttributePage}
        options={{
          tabBarLabel: 'Player Attribute',
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('../../../assets/icon/muscle.png')} // Update with your icon path
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <GamePlayTab.Screen 
        name="Upgrades" 
        component={UpgradesPage}
        options={{
          tabBarLabel: 'Upgrades',
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require('../../../assets/icon/right.png')} // Update with your icon path
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </GamePlayTab.Navigator>
  );
};
export default GamePlayNavigator;