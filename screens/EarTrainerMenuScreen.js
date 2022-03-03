import React, { useRef, useState } from "react";
import { StyleSheet, Text, Button, View } from "react-native";
import LevelCard from "../components/LevelCard";
import colors from "../constants/colors";

const EarTrainerMenu = (props) => {
  const [easyLevelHighScore, setEasyLevelHighScore] = useState(0);
  const [mediumLevelHighScore, setMediumLevelHighScore] = useState(0);
  const [hardLevelHighScore, setHardLevelHighScore] = useState(0);

  const handlePlayLevel = (highScore, chords, level) => {
    if (level === "easy") {
      props.navigation.navigate("Ear Trainer", { level: "easy", highscore: highScore });
    }

    if (level === "medium" && easyLevelHighScore >= 5) {
      props.navigation.navigate("Ear Trainer", { level: "medium", highscore: highScore });
    } else if (level === "medium") {
      console.log("Level locked");
    }
    if (level === "hard" && mediumLevelHighScore >= 10) {
      props.navigation.navigate("Ear Trainer", { level: "hard", highscore: highScore });
    } else if (level === "hard"){
      console.log("Level locked!");
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
          chords={6}
          onPress={() => handlePlayLevel(easyLevelHighScore, 6, "easy")}
        >
          {" "}
          Easy{" "}
        </LevelCard>
        <LevelCard
          highScore={mediumLevelHighScore}
          chords={10}
          onPress={() => handlePlayLevel(mediumLevelHighScore, 10, "medium")}
        >
          {" "}
          Medium{" "}
        </LevelCard>
        <LevelCard
          highScore={hardLevelHighScore}
          chords={14}
          onPress={() => handlePlayLevel(hardLevelHighScore, 14, "hard")}
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
