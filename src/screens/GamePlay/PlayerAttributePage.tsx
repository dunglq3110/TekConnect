// PlayerAttributePage.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const AttributeCard: React.FC<{
  name: string;
  value: number;
}> = ({ name, value }) => (
  <View style={styles.card}>
    <Text style={styles.cardText}>{name}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const DropdownSection: React.FC<{
  title: string;
  attributes: Array<{ Name: string; Value: number }>;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ title, attributes, isOpen, onToggle }) => (
  <View style={styles.section}>
    <TouchableOpacity 
      style={[
        styles.dropdownHeader,
        isOpen && styles.dropdownHeaderOpen
      ]} 
      onPress={onToggle}
    >
      <Text style={styles.dropdownTitle}>{title}</Text>
      <Text>{isOpen ? '▼' : '▶'}</Text>
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.dropdownContent}>
        {attributes.map((attr, index) => (
          <AttributeCard 
            key={index} 
            name={attr.Name} 
            value={attr.Value} 
          />
        ))}
      </View>
    )}
  </View>
);

const PlayerAttributePage: React.FC = () => {
  const [gunOpen, setGunOpen] = useState(true);  // Default to open for better UX
  const [vestOpen, setVestOpen] = useState(true);
  
  const attributes = useSelector((state: RootState) => state.attributes.attributes);
  
  const gunAttributes = attributes.filter(attr => attr.IsGun);
  const vestAttributes = attributes.filter(attr => !attr.IsGun);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Player Attributes</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <DropdownSection
          title="Gun Attributes"
          attributes={gunAttributes}
          isOpen={gunOpen}
          onToggle={() => setGunOpen(!gunOpen)}
        />
        
        <DropdownSection
          title="Vest Attributes"
          attributes={vestAttributes}
          isOpen={vestOpen}
          onToggle={() => setVestOpen(!vestOpen)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32, // Extra padding at bottom for better scroll experience
  },
  section: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  dropdownHeaderOpen: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownContent: {
    padding: 8,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardText: {
    fontSize: 16,
    flex: 1, // Allow text to wrap if too long
    marginRight: 8,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 50, // Ensure some minimum space for values
    textAlign: 'right',
  },
});

export default PlayerAttributePage;