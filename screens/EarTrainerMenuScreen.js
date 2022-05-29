import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import LevelCard from "../components/LevelCard";
import colors from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";


const EarTrainerMenu = (props) => {
  const { currentUser, userData } = useAuth();
  const [easyLevelHighScore, setEasyLevelHighScore] = useState(0);
  const [mediumLevelHighScore, setMediumLevelHighScore] = useState(0);
  const [hardLevelHighScore, setHardLevelHighScore] = useState(0);
  const [ mediumLocked, setMediumLocked] = useState(true);
  const [ hardLocked, setHardLocked] = useState(true);
  useEffect(()=>{
    if(!currentUser)
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]})
    else{
      setEasyLevelHighScore(userData?.easyHighscore)
      setMediumLevelHighScore(userData?.mediumHighscore)
      setHardLevelHighScore(userData?.hardHighscore)

      if(userData?.easyHighscore >= 5)
        setMediumLocked(false);
      if(userData?.mediumHighscore >= 10)
        setHardLocked(false);
    }
  }, [userData]);


  const handlePlayLevel = (highScore, chords, level) => {
    if (level === "easy") {
      props.navigation.navigate("Ear Trainer", { level: "easy", highscore: highScore, numChords: chords });
    }

    if (level === "medium" && easyLevelHighScore >= 5) {
      props.navigation.navigate("Ear Trainer", { level: "medium", highscore: highScore, numChords: chords });
    } else if (level === "medium") {
      console.log("Level locked");
    }
    if (level === "hard" && mediumLevelHighScore >= 10) {
      props.navigation.navigate("Ear Trainer", { level: "hard", highscore: highScore, numChords: chords });
    } else if (level === "hard"){
      console.log("Level locked!");
    }
  };

  return (
    <LinearGradient style={styles.container}  colors={['rgba(0,0,0,0.8)', 'transparent']}>
      <View style={styles.textContainer}>
        <Text style={styles.text}> Game Levels </Text>
      </View>
      <View style={styles.levelsContainer}>
        <LevelCard
          highScore={easyLevelHighScore}
          chords={6}
          lock={false}
          onPress={() => handlePlayLevel(easyLevelHighScore, 6, "easy")}
        >         
          Easy
        </LevelCard>
        <LevelCard
          highScore={mediumLevelHighScore}
          chords={10}
          lock={mediumLocked}
          onPress={() => handlePlayLevel(mediumLevelHighScore, 10, "medium")}
        >
          Medium
        </LevelCard>
        <LevelCard
          highScore={hardLevelHighScore}
          chords={14}
          lock={hardLocked}
          onPress={() => handlePlayLevel(hardLevelHighScore, 14, "hard")}
        > 
          Hard
        </LevelCard>
      </View>
    </LinearGradient>
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
