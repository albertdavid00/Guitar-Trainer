import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import OptionButton from "../components/OptionButton";
import colors from "../constants/colors";
import chord_samples from "../constants/chords";
import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import GameOver from "../components/GameOver";

const EarTrainerGameScreen = (props) => {
  const [numOfChords, setNumOfChords] = useState(0);
  const [samples, setSamples] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [sound, setSound] = useState();
  const [sample, setSample] = useState();
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelUnlockedMessage, setLevelUnlockedMessage] = useState("");
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const { level, highscore } = props.route.params;
  const [levelHighScore, setLevelHighScore] = useState(highscore);
  const isMounted = useRef(true);
  const lost = useRef(false);
  const answering = useRef(false);

  useEffect(() => {
    return () => {
      // TODO  on unmount save highscore and send to menu
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (level === "easy") {
      setNumOfChords(6);
    } else if (level === "medium") {
      setNumOfChords(10);
    } else {
      setNumOfChords(14);
    }
  }, [level]);

  const getNewSound = async () => {
    try {
      if (isMounted.current) {
        const newSample = generateRandomChord();
        if (newSample) {
          const name = newSample.name;
          const chord = newSample.chord;
          setSample(newSample);
          const { sound } = await Audio.Sound.createAsync(chord);
          setSound(sound);
          console.log("Playing sound " + name);
          await sound.playAsync();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  const generateOptions = () => {
    if (sample) {
      const chordName = sample.name;
      let chordsSet = new Set();
      chordsSet.add(chordName);

      while (chordsSet.size < 4) {
        let randomSample = generateRandomChord();
        chordsSet.add(randomSample.name);
      }
      const chordsArray = Array.from(chordsSet);
      shuffleArray(chordsArray);
      setOptions(chordsArray);
    }
  };
  useEffect(() => {
    setSamples(chord_samples);
    try {
      if (samples) {
        getNewSound();
      }
    } catch (error) {
      console.log(error);
    }
  }, [samples]);

  // re-renders the options every time the state of the sample changes.
  useEffect(() => {
    if (sample) {
      generateOptions();
    }
  }, [sample]);

  const generateRandomChord = () => {
    let randIndex = 0;
    randIndex = Math.floor(Math.random() * numOfChords);
    return samples[randIndex];
  };

  const handlePlayButton = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(sample.chord);
      console.log("Playing sound " + sample.name);
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleOption = (option, btnId) => {
    answering.current = true;
    setSelectedButtonId(btnId);
    if (option === sample.name) {
      setAnswer(true);
      setScore((prevState) => prevState + 1);
      console.log("Correct!");
    } else {
      setAnswer(false);
      if (lives == 1) {
        lost.current = true;
        setLives((prevState) => prevState - 1);
        setGameOver(true);
      } else {
        setLives((prevState) => prevState - 1);
        console.log("Incorrect!");
      }
    }

    setTimeout(() => {
      if (!lost.current) {
        getNewSound();
        answering.current = false;
      }
      setSelectedButtonId(null);
      setAnswer(false);
    }, 1000);
  };
  useEffect(() => {
    if (score > levelHighScore) {
      setLevelHighScore(score);
    }
    if (level === "easy" && score === 5) {
      setLevelUnlockedMessage("New level unlocked!");
      // TODO
    } else if (level === "medium" && score === 10) {
      setLevelUnlockedMessage("New level unlocked!");
      // TODO
    }
  }, [score]);

  return (
    <View style={styles.container}>
      <View style={styles.topSide}>
        <View>
          <Text style={{ color: colors.text, fontSize: 20 }}>
            {" "}
            Score: {score}{" "}
          </Text>
        </View>
        <View style={styles.livesContainer}>
          {lives >= 1 && (
            <AntDesign
              name="heart"
              size={20}
              color="red"
              style={{ marginHorizontal: 5 }}
            />
          )}
          {lives >= 2 && (
            <AntDesign
              name="heart"
              size={20}
              color="red"
              style={{ marginHorizontal: 5 }}
            />
          )}
          {lives >= 3 && (
            <AntDesign
              name="heart"
              size={20}
              color="red"
              style={{ marginHorizontal: 5 }}
            />
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayButton}
          disabled={gameOver}
        >
          <Text style={styles.playButtonText}> Tap </Text>
          <Text style={styles.playButtonText}> to </Text>
          <Text style={styles.playButtonText}> Listen </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionsContainer}>
        <OptionButton
          answering={answering.current}
          gameOver={gameOver}
          correctAnswer={answer}
          answerId={selectedButtonId}
          btnId={1}
          onPress={() => {
            handleOption(options[0], 1);
          }}
        >
          {" "}
          {options[0]}{" "}
        </OptionButton>
        <OptionButton
          answering={answering.current}
          gameOver={gameOver}
          correctAnswer={answer}
          answerId={selectedButtonId}
          btnId={2}
          onPress={() => {
            handleOption(options[1], 2);
          }}
        >
          {" "}
          {options[1]}{" "}
        </OptionButton>
        <OptionButton
          answering={answering.current}
          gameOver={gameOver}
          correctAnswer={answer}
          answerId={selectedButtonId}
          btnId={3}
          onPress={() => {
            handleOption(options[2], 3);
          }}
        >
          {" "}
          {options[2]}{" "}
        </OptionButton>
        <OptionButton
          answering={answering.current}
          gameOver={gameOver}
          correctAnswer={answer}
          answerId={selectedButtonId}
          btnId={4}
          onPress={() => {
            handleOption(options[3], 4);
          }}
        >
          {" "}
          {options[3]}{" "}
        </OptionButton>
      </View>
      {gameOver && (
        <GameOver
          score={score}
          levelHighScore={levelHighScore}
          levelUnlockedMessage={levelUnlockedMessage}
          navigation={props.navigation}
        />
      )}
    </View>
  );
};

export default EarTrainerGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  topSide: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "5%",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colors.primary,
  },
  playButton: {
    marginVertical: "10%",
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.5,
    borderWidth: 1,
    borderRadius: (Dimensions.get("window").width * 0.5) / 2,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  playButtonText: {
    fontSize: 25,
    color: "white",
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap-reverse",
    justifyContent: "center",
    marginBottom: "10%",
  },
  livesContainer: {
    flexDirection: "row",
  },
});
