import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';

const WifiSetupPage: React.FC = () => {
    const [wifiName, setWifiName] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');

    const handleSendWifiCredentials = async () => {
        if (!wifiName.trim() || !wifiPassword.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Please fully enter WiFi credentials',
                position: 'top',
                visibilityTime: 4000,
            });
            return;
        }

        try {
            const urlString = `http://192.168.4.1/setup?ssid=${encodeURIComponent(wifiName)}&password=${encodeURIComponent(wifiPassword)}`;

            const response = await fetch(urlString, { method: 'GET' });

            if (response.ok) {
                const responseText = await response.text();
                if (responseText.includes('Received')) {
                    Toast.show({
                        type: 'success',
                        text1: 'Success sending WiFi credentials',
                        position: 'top',
                        visibilityTime: 4000,
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Unexpected server response',
                        position: 'top',
                        visibilityTime: 4000,
                    });
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to send WiFi credentials',
                    position: 'top',
                    visibilityTime: 4000,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Network request failed',
                position: 'top',
                visibilityTime: 4000,
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>WiFi Name</Text>
            <TextInput
                style={styles.input}
                value={wifiName}
                onChangeText={setWifiName}
                placeholder="Enter WiFi Name"
                autoCapitalize="none"
            />

            <Text style={styles.label}>WiFi Password</Text>
            <TextInput
                style={styles.input}
                value={wifiPassword}
                onChangeText={setWifiPassword}
                placeholder="Enter WiFi Password"
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSendWifiCredentials}
            >
                <Text style={styles.buttonText}>Send WiFi Credentials</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    }
});

export default WifiSetupPage;