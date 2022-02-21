import React, { useRef, useState } from "react";
import { StyleSheet, Text, Button, View } from "react-native";
import LevelCard from "../components/LevelCard";
import colors from "../constants/colors";

const EarTrainerMenu = props => {
  const [easyLevelHighScore, setEasyLevelHighScore] = useState(0);
  const [mediumLevelHighScore, setMediumLevelHighScore] = useState(0);
  const [hardLevelHighScore, setHardLevelHighScore] = useState(0);
  
  const handlePlayLevel = (highScore, chords) => {
    if (chords === 6 && easyLevelHighScore < 5) {
      console.log("You haven't unlocked this level yet.");
    } else{
      props.navigation.navigate("Ear Trainer")
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}> Game Levels </Text>
      </View>
      <View style={styles.levelsContainer}>
        <LevelCard
          highScore={easyLevelHighScore}
          chords={4}
          onPress={() => handlePlayLevel(easyLevelHighScore, 4)}
        >
          {" "}
          Easy{" "}
        </LevelCard>
        <LevelCard
          highScore={mediumLevelHighScore}
          chords={6}
          onPress={() => handlePlayLevel(mediumLevelHighScore, 6)}
        >
          {" "}
          Medium{" "}
        </LevelCard>
        <LevelCard
          highScore={hardLevelHighScore}
          chords={12}
          onPress={() => handlePlayLevel(hardLevelHighScore, 12)}
        >
          {" "}
          Hard{" "}
        </LevelCard>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  textContainer: {
    width: "100%",
    textAlign: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "10%",
  },
  text: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  levelsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default EarTrainerMenu;
