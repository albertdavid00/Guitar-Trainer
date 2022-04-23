import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import CustomButton from "../components/CustomButton";
import colors from "../constants/colors";

const MainMenuScreen = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState("false");

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={styles.buttonContainer}>
           <Button title="Login" color={colors.secondary} />
        </View>
        <View style={styles.buttonContainer}>
           <Button title="Register" color={colors.secondary} />
        </View>
      </View>
      <View style={styles.menuContainer}>
        <CustomButton onPress = {() => navigation.navigate("Tuner")}>  Tune  </CustomButton>
        <CustomButton  onPress = {() => navigation.navigate("Ear Trainer Menu")}> Ear Trainer </CustomButton>
        <CustomButton> Find Song </CustomButton>
        <CustomButton> Find Chord </CustomButton>
        <CustomButton> Settings </CustomButton>
      </View>


    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary
  },
  statusContainer: {
    width: '100%',
    minHeight: 45,
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    flexDirection: 'row',
    padding: 5,
    marginTop: 5
  },
  buttonContainer: {
    width: "49%"
  },
  menuContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15%',
    
  },
});

export default MainMenuScreen;
