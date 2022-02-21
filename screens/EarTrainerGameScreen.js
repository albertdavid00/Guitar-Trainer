import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import OptionButton from "../components/OptionButton";
import colors from "../constants/colors";

const handlePlayButton = () => {
  console.log("Play sound!");
}

const EarTrainerGameScreen = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSide}>
        <Text style={{color: 'white', fontSize: 20}}> Score: 0 </Text>
        <Text style={{color: 'white', fontSize: 20}}> Lives: 3 </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayButton}>
          <Text style={styles.playButtonText}> Tap </Text>
          <Text style={styles.playButtonText}> to </Text>
          <Text style={styles.playButtonText}> Listen </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionsContainer}>
        <OptionButton> Am </OptionButton>
        <OptionButton> Bm </OptionButton>
        <OptionButton> Em </OptionButton>
        <OptionButton> C </OptionButton>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  topSide: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "5%",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colors.primary,
  },
  playButton: {
    marginVertical: "10%",
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.5,
    borderWidth: 1,
    borderRadius: (Dimensions.get("window").width * 0.5) / 2,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  playButtonText: {
    fontSize: 25,
    color: "white",
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap-reverse",
    justifyContent: "center",
    marginBottom: '10%',
    
  },
});

export default EarTrainerGameScreen;
