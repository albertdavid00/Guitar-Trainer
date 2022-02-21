import { StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import colors from "../constants/colors";

const OptionButton = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
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
    borderWidth: 2,
    borderRadius: 5,
  },
});
