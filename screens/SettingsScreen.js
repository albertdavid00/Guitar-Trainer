import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

const SettingsScreen = (props) => {
  const { currentUser, logout, userData } = useAuth();
  const [numOfSongs, setNumOfSongs] = useState(
    userData.favorites ? ObjectLength(userData.favorites) : 0
  );

  useEffect(() => {
    if(!currentUser)
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main Menu' }]})
  }, [currentUser])

  function ObjectLength(object) {
    var length = 0;
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        ++length;
      }
    }
    return length;
  }

  const handleLogout = async () => {
      await logout();
  }

  return (
    <LinearGradient
      colors={["rgba(0,0,0,0.8)", "transparent"]}
      style={styles.screen}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name="user-circle" size={60} color="white" />
      </View>
      <View style={styles.cardContainer}>
        <LinearGradient
          start={{ x: 1, y: 0.75 }}
          end={{ x: 0, y: 0.25 }}
          colors={["rgba(24, 112, 190, 0.8)", "transparent"]}
          style={styles.card}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Username </Text>
            <Text style={styles.infoText}> {userData.username}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Email </Text>
            <Text style={styles.infoText}> {userData.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Easy Level Score </Text>
            <Text style={styles.infoText}>
              points: {userData.easyHighscore}{" "}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Medium Level Score </Text>
            <Text style={styles.infoText}>
              points: {userData.mediumHighscore}{" "}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Hard Level Score</Text>
            <Text style={styles.infoText}>
              points: {userData.hardHighscore}{" "}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Favorites</Text>
            <Text style={styles.infoText}> {numOfSongs} songs </Text>
          </View>
        </LinearGradient>
        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
          <Text style={styles.infoText}> Log Out</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  iconContainer: {
    marginTop: "20%",
    marginBottom: "10%",
    width: "100%",
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  card: {
    width: "90%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    padding: "5%",
    marginBottom: "10%",
  },
  infoContainer: {
    width: "100%",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoText: {
    color: "white",
  },
  btn: {
    width: "90%",
    backgroundColor: colors.primary,
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
  },
});
