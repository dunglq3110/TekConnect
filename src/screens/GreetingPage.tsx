import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';

interface GreetingPageProps {
  onContinue: () => void;
}

export default function GreetingPage({ onContinue }: GreetingPageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Welcome to the App!</Text>
      <Button
        title="Go to Main Page"
        onPress={onContinue} // Call onContinue to hide the GreetingPage
      />

      <View style={styles.contactSection}>
        <Text style={styles.contactText}>Contact Us</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Image
              source={require('../../assets/icon/world-wide-web.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../assets/icon/youtube.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../assets/icon/facebook.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 20,
  },
  contactSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 200,
  },
  icon: {
    width: 40,
    height: 40,
  },
});
