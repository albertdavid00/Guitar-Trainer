import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";

const LevelCard = (props) => {
  const { highScore, chords, lock } = props;

  return (
    <TouchableOpacity style={styles.boxContainer} onPress={props.onPress}>
      <View style={styles.container}>
        <Text style={styles.text}> {props.children} </Text>
      </View>
      <View style={styles.details}>
        <Text style={{color:'white'}}> HighScore: {highScore} </Text>
        <AntDesign
          name= {lock ? "lock1" : "unlock"}
          size={25}
          color="white"
        /> 
        <Text style={{color:'white'}}> Chords: {chords}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  details: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginTop: '10%'
  },
  boxContainer: {
    marginHorizontal: 15,
    marginVertical: 20,
    width: "80%",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderRadius: 5,
  },
  text: {
    color: colors.text,
    fontSize: 25,
    textAlign: "center",
  },
});

export default LevelCard;
