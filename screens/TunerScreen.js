import { Image, StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import colors from "../constants/colors";
import guitarImg from "../assets/guitar_headstock.png";
import StringButton from "../components/StringButton";
import { Audio } from "expo-av";

const TunerScreen = () => {
  const [selectedString, setSelectedString] = useState();
  const [recording, setRecording] = useState();
  const handleSelectedString = (id) => {
    setSelectedString(id);
  };
  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };
  const stopRecording = async () => {
    try {
      console.log("Stopping recording..");
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      console.log(recording._options.android)
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.upperPart}>
        <Text style={styles.text}>Standard Tuning</Text>
        <View style={{ width: 100 }}>
          <Button title="Start Record" onPress={startRecording} />
          <Button title="Stop Record" onPress={stopRecording} />
        </View>
      </View>
      <View style={styles.lowerPart}>
        <View style={styles.bottomContainer}>
          <View style={styles.buttons}>
            <StringButton
              onPress={handleSelectedString.bind(this, 2)}
              btnId={2}
              selectedBtn={selectedString}
            >
              D
            </StringButton>
            <StringButton
              onPress={handleSelectedString.bind(this, 1)}
              btnId={1}
              selectedBtn={selectedString}
            >
              A
            </StringButton>
            <StringButton
              onPress={handleSelectedString.bind(this, 0)}
              btnId={0}
              selectedBtn={selectedString}
            >
              E
            </StringButton>
          </View>
          <Image source={guitarImg} style={styles.img} resizeMode="contain" />
          <View style={styles.buttons}>
            <StringButton
              onPress={handleSelectedString.bind(this, 3)}
              btnId={3}
              selectedBtn={selectedString}
            >
              G
            </StringButton>
            <StringButton
              onPress={handleSelectedString.bind(this, 4)}
              btnId={4}
              selectedBtn={selectedString}
            >
              B
            </StringButton>
            <StringButton
              onPress={handleSelectedString.bind(this, 5)}
              btnId={5}
              selectedBtn={selectedString}
            >
              E
            </StringButton>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TunerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  upperPart: {
    padding: 20,
    flex: 0.5,
    width: "100%",
    alignItems: "center",
  },
  lowerPart: {
    flex: 0.5,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 1,

    justifyContent: "space-between",
    flexDirection: "row",
  },
  img: {
    height: "100%",
    width: "50%",
    position: "relative",
    top: 2,
  },
  buttons: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    height: "50%",
    top: "10%",
  },
  stringButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
  },
  text: {
    color: "white",
  },
  btnActive: {
    backgroundColor: "grey",
  },
  btnNotActive: {
    backgroundColor: colors.secondary,
  },
});
