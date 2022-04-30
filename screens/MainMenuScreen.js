import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import CustomButton from "../components/CustomButton";
import colors from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../firebase";
import {
  ref,
  get,
  child,
  query,
  orderByChild,
  equalTo,
  set,
  update
} from "firebase/database";

const MainMenuScreen = ({ navigation }) => {
  const { currentUser, logout, userData } = useAuth();
  
  const Hlogout = async () => {
    await logout();
  };

  const goToEarTrainerMenu = () => {
    if (currentUser) navigation.navigate("Ear Trainer Menu");
    else navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {currentUser !== null && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeMessage}>
              Welcome, {currentUser.displayName}!
            </Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          {currentUser === null && (
            <Button
              title="Login"
              color={colors.secondary}
              onPress={() => navigation.navigate("Login")}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          {currentUser === null && (
            <Button
              title="Register"
              color={colors.secondary}
              onPress={() => navigation.navigate("Register")}
            />
          )}
        </View>
      </View>
      <View style={styles.menuContainer}>
        <CustomButton onPress={() => navigation.navigate("Tuner")}>
          {" "}
          Tune{" "}
        </CustomButton>
        <CustomButton onPress={goToEarTrainerMenu}> Ear Trainer </CustomButton>
        <CustomButton> Find Song </CustomButton>
        <CustomButton> Find Chord </CustomButton>
        <CustomButton onPress={Hlogout}> Settings </CustomButton>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  statusContainer: {
    width: "100%",
    minHeight: 45,
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    flexDirection: "row",
    padding: 5,
    marginTop: 5,
  },
  buttonContainer: {
    width: "49%",
  },
  menuContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
  },
  welcomeContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
  },
  welcomeMessage: {
    fontWeight: "700",
    color: "white",
    fontSize: 17,
  },
});

export default MainMenuScreen;
