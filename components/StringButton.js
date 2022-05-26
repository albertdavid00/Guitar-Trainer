import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../constants/colors";
const StringButton = (props) => {
  
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.selectedBtn !== undefined && props.selectedBtn !== props.btnId}
      style={[
        styles.stringButton,
        props.selectedBtn === props.btnId
          ? styles.btnActive
          : styles.btnNotActive,
      ]}
    >
      <View style={styles.btnContainer}>
        <Text style={styles.text}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default StringButton;

const styles = StyleSheet.create({
  stringButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    borderWidth: 2,
  },
  btnContainer: {
    borderRadius: 20,
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    color: "white",
    fontSize: 17
    
  },
  btnActive: {
    backgroundColor: "grey",
  },
  btnNotActive: {
    backgroundColor: colors.secondary,
  },
});
