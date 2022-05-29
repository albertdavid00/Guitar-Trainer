import { StyleSheet, Text, View } from "react-native";
import React, {useRef, useEffect} from "react";
import notes from "../constants/notes";
import Svg, { Circle, Line, Text as SVGText } from 'react-native-svg';
import { getInfoAsync } from "expo-file-system";

const CustomGauge = (props) => {
  const { inputFreq, selectedStringId } = props;
  const guitarStrings = ["E", "A", "D", "G", "B", "e"];
  const currentStringRef = useRef();
  const hzToCircleRef = useRef();
  let tunedNote = undefined;
  const options = ["Tune higher", "Tune lower", "Tuned"];
  const epsilon = 1; // negligible value for Hz
  const messageRef = useRef();
  let changeIndex = 0;
  const valuesOnCircle = [90, 88.5, 85, 76, 70, 62, 52, 50, 48, 38, 30, 24, 15, 11.5, 10]
  const needle = {
    x1: 50,
    x2: 50, // 90 >= x2 >= 10
    y1: 40,
    NEEDLE_LEN: 40
  }
  needle.x2 = Math.floor(Math.random() * 90) + 10
  const getArgMin = (array) => {
    if(array.length < 1) return -1;
    let Min = array[0];
    let argMin = 0;  
    for (let i = 0; i < array.length; i++){
        if(array[i] < Min){
            Min = array[i];
            argMin = i;
        }
    }
    return argMin;
  }

  const getClosestHzIndex = (input, freqs) => {
    let Min = 100000;
    let indexMin = 0;
    for(let i = 0; i < freqs.length; i++){
      if(Math.abs(input - freqs[i]) < Min){
        Min = Math.abs(input - freqs[i]);
        indexMin = i;
      }
    }
    return indexMin;
  }

  const getY2 = (x1, y1, x2, lineLength) => {
    if(Math.abs(x1 - x2) > lineLength)
      return y1;
    let y2 = Math.abs(y1 + Math.sqrt(Math.pow(lineLength, 2) - Math.pow((x1 - x2), 2)));
    return y2;
   
  }

  // let hzToLowerCircle = []
  // let sum = 0;
  // for(let i = 0; i < 6; i++){
  //   hzToLowerCircle.push(sum);
  //   sum = sum + 1;
  // }
  // console.log("Len: ", hzToLowerCircle.length);
  // console.log(hzToLowerCircle);
  currentStringRef.current = selectedStringId !== undefined ? guitarStrings[selectedStringId] : "";
    if (currentStringRef.current !== "" && inputFreq && (inputFreq < 830 && inputFreq > 57)) {
      let prevNote = undefined;
      let nextNote = undefined;
      for (const note of notes) {
        if (note.name == currentStringRef.current.toUpperCase()) {
          tunedNote = note;
          let i = notes.indexOf(note);
          if(i == 0){
            changeIndex = -1;
          }
          else if (i == notes.length - 1){
            changeIndex = 1;
          }
          prevNote = notes[(i - 1 + notes.length) % notes.length];
          nextNote = notes[(i + 1 + notes.length) % notes.length];
        }
      }
  
      let minDiffs = [];
      console.log(tunedNote)
      tunedNote.freq.forEach((freq) => {
        let diff = inputFreq - freq;
        minDiffs.push((freq, diff));
      });
      console.log("MinDiffs ", minDiffs)
      let index = getArgMin(minDiffs.map(val => Math.abs(val)));
      console.log("Index", index);
      let octave = tunedNote.freq[index]; // center of needle
      
      let nextNoteOctave = changeIndex === 0 ?  nextNote.freq[index] : (index + 1) < nextNote.freq.length ? nextNote.freq[index + 1] : nextNote.freq[index];
      let prevNoteOctave = changeIndex === 0 ?  prevNote.freq[index] : (index - 1) >= 0 ? prevNote.freq[index - 1] : prevNote.freq[index];
  
      console.log("octaves (prev, curr, next): ", prevNoteOctave, octave, nextNoteOctave);
      let hzPerLowerSegment = Math.round(((octave - epsilon - prevNoteOctave) / 6) * 100) / 100;
      let hzPerHigherSegment = Math.round(((nextNoteOctave - octave + epsilon) / 6) * 100) / 100; 
      let hzToLowerCircle = []
      let sum = prevNoteOctave;
      for(let i = 0; i < 6; i++){
        hzToLowerCircle.push(sum);
        sum = sum + hzPerLowerSegment;
      }
      hzToLowerCircle.push(octave - epsilon)
      hzToLowerCircle.push(octave - epsilon)
      hzToLowerCircle.push(octave + epsilon)
  
      let hzToHigherCircle = []
      sum = nextNoteOctave;
      for(let i = 0; i < 6; i++){
        hzToHigherCircle.push(sum);
        sum = sum - hzPerHigherSegment;
      }
      hzToHigherCircle.reverse();
      
      let hzToCircle = hzToLowerCircle.concat(hzToHigherCircle) ;
      console.log("LEn: ", hzToCircle.length)
      console.log(" HzToCircle: ", hzToCircle);
      let circleIndex = getClosestHzIndex(inputFreq, hzToCircle);
      console.log("circleIndex + value: ", circleIndex, valuesOnCircle[circleIndex]);
      needle.x2 = valuesOnCircle[circleIndex];
      // hzToCircle = [];
      // hzToHigherCircle = [];
      // hzToLowerCircle = [];
      // if (inputFreq < octave - epsilon){
      //     messageRef.current = options[0]
      // } else if (inputFreq > octave + epsilon) {
      //     messageRef.current = options[1];
      // }
      // else{
      //     messageRef.current = options[2]
      // }
    }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>
        {inputFreq} , {currentStringRef.current}, {messageRef.current}
      </Text> */}
      <Svg style={styles.svg} width={'100%'} height={'100%'} viewBox="0 0 100 100">
        <Circle cx="50" cy="40%" r="40" stroke="red" strokeWidth="10" strokeDasharray="126, 251" fill="none" />
        <Circle cx="50" cy="40%" r="40" stroke="orange" strokeWidth="10" strokeDasharray="97, 251" fill="none" />
        <Circle cx="50" cy="40%" r="40" stroke="green" strokeWidth="10" strokeDasharray="68, 251" fill="none" />
        <Circle cx="50" cy="40%" r="40" stroke="orange" strokeWidth="10" strokeDasharray="58, 251" fill="none" />
        <Circle cx="50" cy="40%" r="40" stroke="red" strokeWidth="10" strokeDasharray="29, 251" fill="none" />
        <Line x1={needle.x1} y1={needle.y1} x2={needle.x2} y2={getY2(needle.x1, needle.y1, needle.x2, needle.NEEDLE_LEN)} strokeWidth={3} stroke="black"/>
        <SVGText x="26" y="40" stroke="white" transform="translate(120, 70) rotate(180)" fontSize={10}> - </SVGText>
        <SVGText x="105" y="40" stroke="white" transform="translate(120, 70) rotate(180)" fontSize={10}> + </SVGText>
        <SVGText x="-22" y="-20" stroke="white" strokeWidth={0.8} transform="translate(30, 70) rotate(180)" fontSize={10}>{currentStringRef.current}</SVGText>
      </Svg>
    </View>
  );
};

export default CustomGauge;

const styles = StyleSheet.create({
  text: {
    color: "white",
  },
  container: {
    width: '100%',
    height: '100%',
    
  },
  svg: {
     transform: [{rotate: '180deg'}],
     top: 0,
     
  }
})