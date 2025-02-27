import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Platform, TextInput, TouchableOpacity, Text } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button, View, Alert } from 'react-native';

export default function TabTwoScreen() {
  const [txtCourtRate, setTxtCourtRate] = useState('');
  const [txtBallRate, setTxtBallRate] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);


  const saveConfig = async () => {
    try {
      await AsyncStorage.setItem('courtRate', txtCourtRate);
      await AsyncStorage.setItem('ballRate', txtBallRate);
      alert('Config saved!');
      setIsDisabled(true);
    } catch (error) {
      console.error("Error saving config", error);
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    const loadRates = async () => {
      try {
        const courtRate = await AsyncStorage.getItem('courtRate');
        const ballRate = await AsyncStorage.getItem('ballRate');
        if (courtRate !== null) {
          setTxtCourtRate(courtRate)
        }

        if (ballRate !== null) {
          setTxtBallRate(ballRate)
        }

      } catch (error) {
        console.error("Error loading config", error);
      }
    };

    loadRates();
  }, []); // Empty array to run only once when component mounts

  const enableButtonOnRateChangeKeyPress = (e: any) => {
    setIsDisabled(false);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/badminton-settings.png")}
          style={styles.headerLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Rate Settings</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.textLabel}>Court Rate:</ThemedText>
        <ThemedText>
          <TextInput
            style={styles.textInput}
            value={txtCourtRate}
            onChangeText={setTxtCourtRate}
            multiline={false} // Makes the TextInput multi-line
            numberOfLines={1} // Specifies the number of lines visible in the text area
            keyboardType="numeric"
            onKeyPress={enableButtonOnRateChangeKeyPress} // Handle key press events
          />
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.textLabel}>Ball Rate:</ThemedText>
        <ThemedText>
          <TextInput
            style={styles.textInput}
            value={txtBallRate}
            onChangeText={setTxtBallRate}
            multiline={false} // Makes the TextInput multi-line
            numberOfLines={1} // Specifies the number of lines visible in the text area
            keyboardType="numeric"
            onKeyPress={enableButtonOnRateChangeKeyPress} // Handle key press events
          />
        </ThemedText>
      </ThemedView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity 
          style={[styles.button, isDisabled && styles.disabledButton]}
          onPress={saveConfig} disabled={false}>
          <Text style={styles.buttonText}>Save Rates</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    height: 200,
    width: 430,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepContainer: {
    gap: 6,
    marginBottom: 2,
  },
  textLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingLeft: 10,
    fontSize: 18,
    color: 'white'
  },
  button: {
    backgroundColor: '#4CAF50', // Green background
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 32, // Horizontal padding
    borderRadius: 8, // Rounded corners
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white', // Text color
    fontSize: 18, // Text size
    fontWeight: 'bold', // Text weight
    textAlign: 'center', // Center text
  },
  disabledButton: {
    backgroundColor: '#D3D3D3', // Gray color when disabled
  },
});
