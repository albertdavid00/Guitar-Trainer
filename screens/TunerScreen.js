import { Image, StyleSheet, Text, View, Button } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import colors from "../constants/colors";
import guitarImg from "../assets/guitar_headstock.png";
import StringButton from "../components/StringButton";
import { Audio } from "expo-av";
import recordingOptions from "../constants/recordingOptions";
import { Sound } from "expo-av/build/Audio";
import * as FileSystem from 'expo-file-system';
import notes from "../constants/notes";
import CustomGauge from "../components/CustomGauge";
import { LinearGradient } from "expo-linear-gradient";


const TunerScreen = () => {
  const [selectedString, setSelectedString] = useState();
  const [buttonIsPressed, setButtonIsPressed] = useState(false);
  const repeat = useRef(false);
  const stringIdRef = useRef(undefined);
  const timeoutIds = useRef([]);
  const prevStringRef = useRef(undefined);
  const recordingRef = useRef(false);
  const soundFrequencyRef = useRef(undefined);
  const [soundFreq, setSoundFreq] = useState(0);
  const sleep = time => new Promise(resolve => setTimeout(resolve, time));


  useEffect(() => {
    repeat.current = buttonIsPressed;
    stringIdRef.current = selectedString;
    recordChunks(stringIdRef.current);
  }, [buttonIsPressed, selectedString])

  useEffect(() => {
    return () => {
      for (var id of timeoutIds.current) {
        clearTimeout(id);
        console.log(id);
      }
      repeat.current = false;
      stringIdRef.current = false;
    };
  }, []);

  const handleSelectedString = (id) => {
    if (selectedString === id) {
      setSelectedString(undefined);
      setButtonIsPressed(false);
    } 
    else {
      prevStringRef.current = id;
      setButtonIsPressed(true);
      setSelectedString(id);
    }
  };

  useEffect(() => {
    console.log("Input Freq: ", soundFreq);
  }, [soundFreq])

  const recordChunks = async (stringId) => {
    if (repeat.current === true && stringId === stringIdRef.current) {
      try {
        // start recording
        recordingRef.current = true;
        let rec = new Audio.Recording();
        await Audio.requestPermissionsAsync();
        await rec.prepareToRecordAsync();
        await rec.startAsync();
        console.log("Recording started");
        
        // length of chunk 
        await sleep(1125);

        // stop recording
        await rec.stopAndUnloadAsync();
        const { status } = await rec.createNewLoadedSoundAsync();
        //console.log("\nSTATUS: ", status);

        let fileUri = rec.getURI();
        console.log("Recording stopped");

        // send data to server
        let xhr = new XMLHttpRequest();
        xhr.open('POST',"http://192.168.78.121:5000/post")
        xhr.onload = () => {
          soundFrequencyRef.current = parseInt(xhr.response);
          setSoundFreq(soundFrequencyRef.current);
          // console.log(stringId)
          //console.log(soundFrequencyRef.current);
          
        };
        xhr.onerror = e => {
          console.log(e, 'upload failed');
        };
        xhr.ontimeout = e => {
          console.log(e, 'cloudinary timeout');
        };
        let formData = new FormData();
        formData.append("audio-file", {
          uri: fileUri,
          type: "audio/x-wav",
          name: "file.wav",
        });
        xhr.send(formData);
        if (xhr.upload) {
          // track the upload progress
          xhr.upload.onprogress = ({ total, loaded }) => {
              const uploadProgress = (loaded / total);
              //console.log(uploadProgress);
          };
        }
        
        //unload objects
        rec = null;
        FileSystem.deleteAsync(fileUri);
        var timeoutId = setTimeout(recordChunks.bind(this, stringId), 1000);
        timeoutIds.current = [...timeoutIds.current, timeoutId];
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <LinearGradient style={styles.container}  colors={['rgba(0,0,0,0.8)', 'transparent']}>
      <View style={styles.upperPart}>
        <Text style={styles.text}>Standard Tuning</Text>
        <View style={styles.gaugeContainer}>
          <CustomGauge 
            inputFreq = {soundFrequencyRef.current} 
            selectedStringId = {selectedString}
          />
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
              e
            </StringButton>
          </View>
        </View>
      </View>
    </LinearGradient>
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
    fontSize: 18,
    fontWeight: "bold"
  },
  btnActive: {
    backgroundColor: "grey",
  },
  btnNotActive: {
    backgroundColor: colors.secondary,
  },
  gaugeContainer:{
     width: "100%", 
     height: '80%',
     marginTop: '5%'
  }
});
