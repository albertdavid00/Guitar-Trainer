import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import LevelCard from "../components/LevelCard";
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
  update,
} from "firebase/database";

const EarTrainerMenu = (props) => {
  const { currentUser, userData } = useAuth();
  const [easyLevelHighScore, setEasyLevelHighScore] = useState(0);
  const [mediumLevelHighScore, setMediumLevelHighScore] = useState(0);
  const [hardLevelHighScore, setHardLevelHighScore] = useState(0);
  const [mediumLocked, setMediumLocked] = useState(true);
  const [hardLocked, setHardLocked] = useState(true);
  const [btnSelected, setBtnSelected] = useState("levels");
  const [users, setUsers] = useState();
  useEffect(() => {
    if (!currentUser)
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    else {
      setEasyLevelHighScore(userData?.easyHighscore);
      setMediumLevelHighScore(userData?.mediumHighscore);
      setHardLevelHighScore(userData?.hardHighscore);

      if (userData?.easyHighscore >= 5) setMediumLocked(false);
      if (userData?.mediumHighscore >= 10) setHardLocked(false);
    }
    // Get top players
    get(child(ref(database), "users")).then((snapshot) => {
      if (snapshot.exists()) {
        let usersArray = [];
        snapshot.forEach((childSnapshot) => {
          let user = {
            id: childSnapshot.key,
            username: childSnapshot.val().username,
            easy: childSnapshot.val().easyHighscore,
            medium: childSnapshot.val().mediumHighscore,
            hard: childSnapshot.val().hardHighscore,
          };
          if (usersArray.length < 20) usersArray.push(user);
        });
        usersArray.sort((u1, u2) =>
          u1.hard < u2.hard
            ? 1
            : u1.hard === u2.hard
            ? u1.medium < u2.medium
              ? 1
              : u1.medium === u2.medium
              ? u1.easy < u2.easy
                ? 1
                : -1
              : -1
            : -1
        );
        setUsers(usersArray);
      }
    });
  }, [userData]);

  // useEffect(() => {
  //   console.log(users);
  // }, [users]);

  const handlePlayLevel = (highScore, chords, level) => {
    if (level === "easy") {
      props.navigation.navigate("Ear Trainer", {
        level: "easy",
        highscore: highScore,
        numChords: chords,
      });
    }

    if (level === "medium" && easyLevelHighScore >= 5) {
      props.navigation.navigate("Ear Trainer", {
        level: "medium",
        highscore: highScore,
        numChords: chords,
      });
    } else if (level === "medium") {
      console.log("Level locked");
    }
    if (level === "hard" && mediumLevelHighScore >= 10) {
      props.navigation.navigate("Ear Trainer", {
        level: "hard",
        highscore: highScore,
        numChords: chords,
      });
    } else if (level === "hard") {
      console.log("Level locked!");
    }
  };

  const handleShowLevels = () => {
    setBtnSelected("levels");
  };

  const handleShowTop = () => {
    setBtnSelected("top");
  };
  const renderUser = (user, id) => {
    return (
      <View key={id} style={[styles.itemContainer, userData.uid === user.id ? {backgroundColor:'grey'} : undefined ]}>
        <View style={styles.id}>
          <Text style={styles.itemText}>{id}.</Text>
        </View>
        <View style={styles.username}>
          <Text style={styles.itemText}>{user.username}</Text>
        </View>
        <View style={styles.hard}>
          <Text style={styles.itemText}>{user.hard}</Text>
        </View>
        <View style={styles.medium}>
          <Text style={styles.itemText}>{user.medium}</Text>
        </View>
        <View style={styles.easy}>
          <Text style={styles.itemText}>{user.easy}</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["rgba(0,0,0,0.8)", "transparent"]}
    >
      <View style={styles.textContainer}>
        <TouchableOpacity
          style={styles.levelsTextContainer}
          onPress={handleShowLevels}
        >
          <Text
            style={[
              styles.text,
              btnSelected === "levels"
                ? styles.btnSelected
                : styles.btnNotSelected,
            ]}
          >
            {" "}
            Game Levels{" "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.TopPlayersTextContainer}
          onPress={handleShowTop}
        >
          <Text
            style={[
              styles.text,
              btnSelected === "top"
                ? styles.btnSelected
                : styles.btnNotSelected,
            ]}
          >
            {" "}
            Top Players{" "}
          </Text>
        </TouchableOpacity>
      </View>
      {btnSelected === "levels" && (
        <View style={[styles.levelsContainer]}>
          <LevelCard
            highScore={easyLevelHighScore}
            chords={6}
            lock={false}
            onPress={() => handlePlayLevel(easyLevelHighScore, 6, "easy")}
          >
            Easy
          </LevelCard>
          <LevelCard
            highScore={mediumLevelHighScore}
            chords={10}
            lock={mediumLocked}
            onPress={() => handlePlayLevel(mediumLevelHighScore, 10, "medium")}
          >
            Medium
          </LevelCard>
          <LevelCard
            highScore={hardLevelHighScore}
            chords={14}
            lock={hardLocked}
            onPress={() => handlePlayLevel(hardLevelHighScore, 14, "hard")}
          >
            Hard
          </LevelCard>
        </View>
      )}
      {btnSelected === "top" && (
        <View style={styles.topUsersContainer}>
          <View style={styles.firstRowContainer}>
            <View style={styles.id}>
              <Text style={styles.firstRowText}>#</Text>
            </View>
            <View style={styles.username}>
              <Text style={styles.firstRowText}>Player</Text>
            </View>
            <View style={styles.hard}>
              <Text style={styles.firstRowText}>H</Text>
            </View>
            <View style={styles.medium}>
              <Text style={styles.firstRowText}>M</Text>
            </View>
            <View style={styles.easy}>
              <Text style={styles.firstRowText}>E</Text>
            </View>
          </View>
          <ScrollView style={styles.list}>
            {users.map((user, index) => renderUser(user, index + 1))}
          </ScrollView>
        </View>
      )}
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  textContainer: {
    width: "100%",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "10%",
  },
  text: {
    fontSize: 18,
    // color: "white",
    fontWeight: "bold",
  },
  levelsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  levelsTextContainer: {
    width: "40%",
    alignItems: "center",
  },
  TopPlayersTextContainer: {
    width: "40%",
    alignItems: "center",
  },
  btnSelected: {
    color: "white",
  },
  btnNotSelected: {
    color: "grey",
  },
  list: {
    width: "80%",
  },
  topUsersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "20%",
  },
  itemContainer: {
    marginVertical: 10,
    padding: 5,
    flexDirection: "row",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    borderRadius: 5
  },
  itemText: {
    color: "white",
    fontSize: 16,
  },
  id: {
    width: "5%",
    alignItems: "center",
  },
  username: {
    width: "45%",
    alignItems: "flex-start",
    paddingLeft: "2%",
  },
  hard: {
    alignItems: "center",
    width: "16%",
  },
  medium: {
    alignItems: "center",
    width: "16%",
  },
  easy: {
    alignItems: "center",
    width: "16%",
  },
  firstRowContainer: {
    flexDirection: "row",
    width:'80%',
    borderBottomColor:'yellow',
    borderBottomWidth: 1,
    padding: 5,
  },
  firstRowText:{
    color:'yellow',
    fontSize: 16
  }
});
export default EarTrainerMenu;
