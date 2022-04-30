import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import colors from "../constants/colors";
import React from "react";

const GameOver = (props) => {
  const { score, levelHighScore, levelUnlockedMessage, numChords, level } = props;
  
  return (
    <View style={styles.gameOverView}>
      <View style={styles.gameOverHeader}>
        <Text style={{ ...styles.textStyle, fontSize: 22 }}>GAME OVER</Text>
      </View>
      <View style={styles.gameOverBody}>
        <Text style={{ ...styles.textStyle, color: "yellow" }}>
          {levelUnlockedMessage}
        </Text>
        <View style={{ marginTop: 15 }}>
          <Text style={styles.textStyle}> Your score: {score} </Text>
          <Text style={styles.textStyle}> Highscore: {levelHighScore}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            color={colors.secondary}
            title="Try again"
            onPress={() => {
                props.navigation.navigate("Ear Trainer Menu");
                props.navigation.navigate("Ear Trainer", { level: level, highscore: levelHighScore, numChords: numChords});
            }}
          />
          <Button
            color={colors.secondary}
            title="Go Back"
            onPress={() => {
              props.navigation.navigate("Ear Trainer Menu");
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default GameOver;

const styles = StyleSheet.create({
    gameOverView: {
        position: "absolute",
        width: (Dimensions.get("window").width * 2) / 3,
        height: Dimensions.get("window").height / 3,
        backgroundColor: colors.secondary,
        top: Dimensions.get("window").width / 3,
        left: Dimensions.get("window").width / 6,
        borderWidth: 2,
        borderRadius: 10,
      },
      textStyle: {
        color: colors.text,
        textAlign: "center",
        fontSize: 18,
      },
      gameOverHeader: {
        padding: 10,
        backgroundColor: colors.secondary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },
      gameOverBody: {
        flex: 1,
        marginHorizontal: 15,
        marginBottom: 15,
        paddingTop: 10,
        justifyContent: "flex-start",
        backgroundColor: colors.primary,
        borderRadius: 10,
      },
      buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
      },
});
