import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import CustomButton from "../components/CustomButton";
import colors from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { Entypo , FontAwesome5, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { database } from "../firebase";
import {
	ref,
	get,
	child,
	query,
	orderByChild,
	equalTo,
	set,
	update,
} from "firebase/database";
import { LinearGradient } from "expo-linear-gradient";

const MainMenuScreen = ({ navigation }) => {
	const { currentUser, logout, userData } = useAuth();

	const Hlogout = async () => {
		await logout();
	};

	const goToEarTrainerMenu = () => {
		if (currentUser) navigation.navigate("Ear Trainer Menu");
		else navigation.navigate("Login");
	};

	const goToSongFinder = () => {
		if (currentUser) navigation.navigate("Song Finder");
		else navigation.navigate("Login");
	};

	return (
		<LinearGradient style={styles.container} colors={['rgba(0,0,0,0.8)', 'transparent']}>
			<View style={styles.statusContainer}>
				{currentUser !== null && (
					<View style={styles.welcomeContainer}>
						<Text style={styles.welcomeMessage}>
							Welcome, {currentUser.displayName}!{" "}
						</Text>
            <MaterialCommunityIcons name="human-greeting" size={24} color="white" />
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
					<Text> Tune </Text>
					<FontAwesome5 name="guitar" size={24} color="white" />
				</CustomButton>
				<CustomButton onPress={goToEarTrainerMenu}>
					<Text> Ear Trainer</Text> {"\n"}
					<FontAwesome name="music" size={24} color="white"/>
					{" "}
					<MaterialCommunityIcons name="ear-hearing" size={24} color="white" />
				</CustomButton>
				<CustomButton onPress={goToSongFinder}> 
          <Text>Find Song </Text> 
          <FontAwesome5 name="search" size={24} color="white" />
          {" "}
          <Entypo name="folder-music" size={24} color="white" />
        </CustomButton>
				<CustomButton> Find Chord </CustomButton>
				<CustomButton onPress={Hlogout}>
					<FontAwesome name="gears" size={45} color="white" />
				</CustomButton>
			</View>
		</LinearGradient>
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
    flexDirection: 'row',
	},
	welcomeMessage: {
		fontWeight: "700",
		color: "white",
		fontSize: 17,
	},
});

export default MainMenuScreen;
