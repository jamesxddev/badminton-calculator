import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Platform, TextInput } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [playingHours, setPlayingHours] = useState(''); // State to hold the text input value
  const [ballUsed, setBallUsed] = useState(''); 
  const [numberOfPlayers, setNumberOfPlayers] = useState(''); 
  const [playerSharing, setPlayerSharing] = useState(0);
  // const [courtFee, setCourtFee] = useState(300);
  const [ballFee, setBallFee] = useState(70);

  const [resultCourtFee, setResultCourtFee] = useState(0);
  const [resultBallFee, setResultBallFee] = useState(0);
  const [resultCourtAndBallFee, setResultCourtAndBallFee] = useState(0);
  const [resultBallCostPerPlayer, setResultBallCostPerPlayer] = useState(0);
  const [totalSharingExcludeMe, setTotalSharingExcludeMe] = useState(0);

  const getCourtRate = async () => {
    try {
      const courtRate = await AsyncStorage.getItem('courtRate');
      const ballRate = await AsyncStorage.getItem('ballRate');
      if (courtRate !== null && ballRate !== null) {
        return [courtRate, ballRate];
      }
    } catch (error) {
      console.error("Error courtRate getting courtRate from storage", error);
    }
  };
  
  const calcualte = async (playingHours: string, ballUsed: string, playerCount: string) => {

    // var [courtFee] = await getCourtRate() as string;
    const rates = await getCourtRate();
    var courtFee = 0;
    var ballFee = 0;

    if (rates) {
      const [court, ball] = rates;
      courtFee = parseInt(court);
      ballFee = parseInt(ball);
    }

    if (courtFee === 0) {
      console.error("Court Fee has not been configured!");
    }

    if (ballFee === 0) {
      console.error("Ball Fee has not been configured!");
    }

    var totalBalls = (parseInt(ballUsed) * ballFee);
    var totalCourtFee = (parseInt(playingHours) * courtFee)
    var totalCourtFeeAndBallFee = totalCourtFee + totalBalls;
    var totalPerPlayerSharing = (totalCourtFeeAndBallFee / parseInt(playerCount));
    
    setResultCourtFee(totalCourtFee);
    setResultBallFee(totalBalls);
    setResultCourtAndBallFee(totalCourtFeeAndBallFee);
    setResultBallCostPerPlayer(totalBalls/parseInt(playerCount));
    setTotalSharingExcludeMe(totalPerPlayerSharing * (parseInt(playerCount)-1));

    if (!isNaN(totalPerPlayerSharing)) {
      setPlayerSharing(totalPerPlayerSharing);
    } else {
      setPlayerSharing(0);
    };
  }

  // Function to handle the change in text
  const numberOfPlayersOnChange = (numberOfPlayers: string) => {
    // Update the state with the new value from TextInput
    setNumberOfPlayers(numberOfPlayers);
    if (playingHours !== '' && ballUsed !== '') {
      calcualte(playingHours, ballUsed, numberOfPlayers);
    }
  };

  const playingHoursOnchange = (playingHours: string) => {

    setPlayingHours(playingHours);
    if (numberOfPlayers !== '' && ballUsed !== '') {
      calcualte(playingHours, ballUsed,numberOfPlayers);
    }
  }

  const ballUsedOnChange = (ballUsed: string) => {

    setBallUsed(ballUsed);

    if (playingHours !== '' && numberOfPlayers !== '') {
      calcualte(playingHours, ballUsed,numberOfPlayers);
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/badminton-image.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.themedTextStyle} type="title">
          Badminton Calculator🏸!
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.textLabel}>Playing Hours:</ThemedText>
        <ThemedText>
          <TextInput
            style={styles.textInput}
            value={playingHours}
            onChangeText={playingHoursOnchange}
            multiline={false} // Makes the TextInput multi-line
            numberOfLines={1} // Specifies the number of lines visible in the text area
            keyboardType="numeric"
          />
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.textLabel}>Ball Used:</ThemedText>
        <ThemedText>
          <TextInput
            style={styles.textInput}
            value={ballUsed}
            onChangeText={ballUsedOnChange}
            multiline={false} // Makes the TextInput multi-line
            numberOfLines={1} // Specifies the number of lines visible in the text area
            keyboardType="numeric"
          />
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.textLabel}>Players:</ThemedText>
        <ThemedText>
          <TextInput
            style={styles.textInput}
            value={numberOfPlayers}
            onChangeText={numberOfPlayersOnChange}
            multiline={false} // Makes the TextInput multi-line
            numberOfLines={1} // Specifies the number of lines visible in the text area
            keyboardType="numeric"
          />
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Player Sharing:
          <ThemedText style={styles.resultTextStyle} type="subtitle">
            {" "}
            {playerSharing}
          </ThemedText>
        </ThemedText>
      </ThemedView>
      <Collapsible title="MORE INFO:">
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.summaryTitle}>
          Court Fee:
          <ThemedText style={styles.summarySubTitle} type="subtitle">
            {" "}
            {resultCourtFee}
          </ThemedText>
        </ThemedText>
        <ThemedText style={styles.summaryTitle}>
          Ball Fee:
          <ThemedText style={styles.summarySubTitle} type="subtitle">
            {" "}
            {resultBallFee}
          </ThemedText>
        </ThemedText>
        <ThemedText style={styles.summaryTitle}>
          Court + Ball Fee:
          <ThemedText style={styles.summarySubTitle} type="subtitle">
            {" "}
            {resultCourtAndBallFee}
          </ThemedText>
        </ThemedText>
        <ThemedText style={styles.summaryTitle}>
          Ball Cost per player:
          <ThemedText style={styles.summarySubTitle} type="subtitle">
            {" "}
            {resultBallCostPerPlayer}
          </ThemedText>
        </ThemedText>
        <ThemedText style={styles.summaryTitle}>
          Total Sharing -me:
          <ThemedText style={styles.summarySubTitle} type="subtitle">
            {" "}
            {totalSharingExcludeMe}
          </ThemedText>
        </ThemedText>
      </ThemedView>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  moreInfoStyle:{
    fontSize: 16,
    marginBottom: -4,
    fontWeight: 'bold',
  },
  summaryTitle:{
    fontSize: 16,
    marginBottom: -4,
  },
  summarySubTitle:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5400',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 6,
    marginBottom: 2,
  },
  reactLogo: {
    height: 200,
    width: 430,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  textArea: {
    height: 100, // Height of the text area
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    textAlignVertical: 'top', // Ensures the text is aligned at the top
    fontSize: 16,
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
  textLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  themedTextStyle : {
    height: 30,
    fontSize: 30,

  },
  resultTextStyle : {
    color: '#ffd000',//'#04c2a5',

  },
});
