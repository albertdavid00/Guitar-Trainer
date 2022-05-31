import { StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import colors from "../constants/colors";

const OptionButton = (props) => {
  return (
    <TouchableOpacity disabled={props.gameOver || props.answering}
      style={[
        styles.container,
        props.correctAnswer && props.btnId === props.answerId
          ? styles.validAnswer
          : props.btnId === props.answerId && !props.correctAnswer
          ? styles.invalidAnswer
          : undefined,
        !props.correctAnswer && props.answering && props.correctChordName == props.children ? styles.highlightCorrectAnswer : undefined,
      ]}
      onPress={props.onPress}
    >
      <Text style={styles.text}> {props.children} </Text>
    </TouchableOpacity>
  );
};

export default OptionButton;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: "white",
  },
  container: {
    marginHorizontal: 15,
    marginVertical: 20,
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderRadius: 5,
    borderColor: 'white'
  },
  validAnswer: {
    backgroundColor: "green",
  },
  invalidAnswer: {
    backgroundColor: "red",
  },
  highlightCorrectAnswer: {
    borderWidth: 2,
    borderColor: "green"
  }
});
