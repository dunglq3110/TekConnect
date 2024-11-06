import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCredit, selectUpgrades } from '../../store/slices/upgradesSlice';
import { getHostWebSocket } from '../../services/host/hostGlobalWebSocket';

// Types
interface AttributeCardProps {
  name: string;
  value: number;
}

interface UpgradeCardProps {
  upgrade: {
    Upgrade: {
      Id: number;
      Name: string;
      Cost: number;
      Description: string;
      Attributes: Array<{
        Id: number;
        GameAttribute: {
          Name: string;
          CodeName: string;
        };
        Value: number;
      }>;
    };
    Available: boolean;
  };
  onSelect: (id: number, selected: boolean) => void;
  isSelected: boolean;
}

// Attribute Card Component
const AttributeCard: React.FC<AttributeCardProps> = ({ name, value }) => (
  <View style={styles.attributeCard}>
    <Text style={styles.attributeName}>{name}</Text>
    <Text style={styles.attributeValue}>+{value}</Text>
  </View>
);

// Upgrade Card Component
const UpgradeCard: React.FC<UpgradeCardProps> = ({ upgrade, onSelect, isSelected }) => {
  const [expanded, setExpanded] = useState(false);

  const handleUpgrade = () => {
    if (upgrade.Available) {
      onSelect(upgrade.Upgrade.Id, !isSelected);
    }
  };

  return (
    <View style={[
      styles.upgradeCard,
      isSelected && styles.selectedUpgradeCard
    ]}>
      <TouchableOpacity 
        style={styles.upgradeHeader} 
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.upgradeName}>{upgrade.Upgrade.Name}</Text>
        <TouchableOpacity
          style={[
            styles.upgradeButton,
            !upgrade.Available && styles.upgradeButtonDisabled,
            isSelected && styles.selectedUpgradeButton
          ]}
          onPress={handleUpgrade}
          disabled={!upgrade.Available}
        >
          <Text style={[
            styles.upgradeButtonText,
            !upgrade.Available && styles.upgradeButtonTextDisabled
          ]}>
            {upgrade.Upgrade.Cost}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.upgradeDetails}>
          <Text style={styles.upgradeDescription}>
            {upgrade.Upgrade.Description}
          </Text>
          <View style={styles.attributesList}>
            {upgrade.Upgrade.Attributes.map((attribute) => (
              <AttributeCard
                key={attribute.Id}
                name={attribute.GameAttribute.Name}
                value={attribute.Value}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// Summary Bar Component
const SummaryBar: React.FC<{
  selectedUpgrades: number[];
  upgrades: any[];
  currentCredit: number;
  onBuy: () => void;
}> = ({ selectedUpgrades, upgrades, currentCredit, onBuy }) => {
  const [expanded, setExpanded] = useState(false);

  const summary = useMemo(() => {
    const selected = upgrades.filter(u => selectedUpgrades.includes(u.Upgrade.Id));
    const totalCost = selected.reduce((sum, u) => sum + u.Upgrade.Cost, 0);
    
    // Calculate combined attributes
    const combinedAttributes = selected.reduce((acc, upgrade) => {
      upgrade.Upgrade.Attributes.forEach((attr: { GameAttribute: { CodeName: any; Name: any; }; Value: any; }) => {
        const key = attr.GameAttribute.CodeName;
        if (!acc[key]) {
          acc[key] = {
            name: attr.GameAttribute.Name,
            value: 0
          };
        }
        acc[key].value += attr.Value;
      });
      return acc;
    }, {});

    return {
      totalCost,
      creditLeft: currentCredit - totalCost,
      combinedAttributes
    };
  }, [selectedUpgrades, upgrades, currentCredit]);

  if (selectedUpgrades.length === 0) {
    return null;
  }

  return (
    <View style={styles.summaryContainer}>
      <TouchableOpacity 
        style={styles.summaryBar}
        onPress={() => setExpanded(!expanded)}
      >
        <View>
          <Text style={styles.summaryText}>
            Selected: {selectedUpgrades.length} upgrades
          </Text>
          <Text style={styles.summaryText}>
            Cost: {summary.totalCost} (Left: {summary.creditLeft})
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.buyButton,
            summary.creditLeft < 0 && styles.buyButtonDisabled
          ]}
          onPress={onBuy}
          disabled={summary.creditLeft < 0}
        >
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.summaryDetails}>
          {Object.values(summary.combinedAttributes).map((attr: any, index) => (
            <AttributeCard
              key={index}
              name={attr.name}
              value={attr.value}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Main Component
const UpgradesPage: React.FC = () => {
  const credit = useSelector(selectCredit);
  const upgrades = useSelector(selectUpgrades);
  const [selectedUpgrades, setSelectedUpgrades] = useState<number[]>([]);

  const handleSelect = (id: number, selected: boolean) => {
    setSelectedUpgrades(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(upId => upId !== id)
    );
  };

  const handleBuy = () => {
    try {
      getHostWebSocket().sendMessage(102,0, "", selectedUpgrades);
      setSelectedUpgrades([]); // Clear selection after purchase
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Credit Display */}
        <View style={styles.creditCard}>
          <Text style={styles.creditTitle}>Available Credits</Text>
          <Text style={styles.creditAmount}>
            {credit.toLocaleString()}
          </Text>
        </View>

        {/* Upgrades List */}
        <View style={styles.upgradesList}>
          {upgrades.map((upgrade) => (
            <UpgradeCard
              key={upgrade.Upgrade.Id}
              upgrade={upgrade}
              onSelect={handleSelect}
              isSelected={selectedUpgrades.includes(upgrade.Upgrade.Id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Summary Bar */}
      <SummaryBar
        selectedUpgrades={selectedUpgrades}
        upgrades={upgrades}
        currentCredit={credit}
        onBuy={handleBuy}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  creditCard: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  creditTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  creditAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  upgradesList: {
    padding: 16,
    paddingBottom: 100, // Space for summary bar
  },
  upgradeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedUpgradeCard: {
    borderColor: '#1a73e8',
    borderWidth: 2,
  },
  upgradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  upgradeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedUpgradeButton: {
    backgroundColor: '#34a853',
  },
  upgradeButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  upgradeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  upgradeButtonTextDisabled: {
    color: '#888',
  },
  upgradeDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  attributesList: {
    gap: 8,
  },
  attributeCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attributeName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  attributeValue: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '600',
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
  },
  summaryDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buyButton: {
    backgroundColor: '#34a853',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  buyButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default UpgradesPage;