import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store'; // Adjust the import path as needed
import React from 'react';

const PlayerStatPage: React.FC = () => {
  const playerState = useSelector((state: RootState) => state.player);

  // Prepare player stats data for FlatList
  const playerStats = [
    { label: 'Name', value: playerState.Name || 'N/A' },
    { label: 'Gun', value: playerState.MacGun || 'N/A' },
    { label: 'Vest', value: playerState.MacVest || 'N/A' },
    { label: 'Health', value: playerState.CurrentHealth.toString() },
    { label: 'Armor', value: playerState.CurrentArmor.toString() },
    { label: 'Bullets', value: playerState.CurrentBullet.toString() },
    { label: 'Sketch', value: playerState.CurrentSSketch.toString() },
    { label: 'Host Connection', value: playerState.HostConnected ? 'Connected' : 'Disconnected' },
    { label: 'Vest Connection', value: playerState.VestConnected ? 'Connected' : 'Disconnected' },
    { label: 'Gun Connection', value: playerState.GunConnected ? 'Connected' : 'Disconnected' },
    { label: 'Total Damage', value: playerState.TotalDamage.toString() },
    { label: 'Total Heal', value: playerState.TotalHeal.toString() },
    { label: 'Total Shots', value: playerState.TotalShots.toString() },
    { label: 'Total Hits', value: playerState.TotalHits.toString() },
    { label: 'Total Kills', value: playerState.TotalKills.toString() },
    { label: 'Total Assists', value: playerState.TotalAssists.toString() },
    { label: 'Total Deaths', value: playerState.TotalDeath.toString() },
    { label: 'Credits', value: playerState.Credits.toString() }
  ];

  const renderStat = ({ item }: { item: { label: string; value: string } }) => (
    <View style={styles.statRow}>
      <Text style={styles.label}>{item.label}:</Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Statistics</Text>
      
      <FlatList
        data={playerStats}
        keyExtractor={(item: { label: any; }) => item.label}
        renderItem={renderStat}
        contentContainerStyle={styles.statSection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statSection: {
    paddingBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
});

export default PlayerStatPage;
