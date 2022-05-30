import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import recordingOptions from "../constants/recordingOptions";
import mockData from "../constants/responseData";
import MainSong from "../components/MainSong";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
import { ref, remove, update } from "firebase/database";
import { database } from "../firebase";
import GenerateUUID from "react-native-uuid";
import { AntDesign } from "@expo/vector-icons";

const SongFinderScreen = (props) => {

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [song, setSong] = useState();
  const { currentUser, userData, setUserData } = useAuth();
  const [searching, setSearching] = useState(false);
  const [favoriteHeart, setFavoriteHeart] = useState("hearto");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!currentUser)
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    if (userData["favorites"])
      for (const [key, value] of Object.entries(userData["favorites"])) {
        setFavorites((prevFav) => [{ uid: key, ...value }, ...prevFav]);
      }
    else setFavorites([]);
  }, []);

  const handleDetect = async () => {
    setBtnDisabled(true);
    setSong(undefined);
    setSearching(true);
    let rec = new Audio.Recording();
    await Audio.requestPermissionsAsync();
    await rec.prepareToRecordAsync(recordingOptions);
    await rec.startAsync();
    console.log("Recording started");

    // length of chunk
    await sleep(6000);

    // stop recording
    await rec.stopAndUnloadAsync();
    const { sound, status } = await rec.createNewLoadedSoundAsync();
    console.log("\nSTATUS: ", status);
    //await sound.replayAsync();
    let fileUri = rec.getURI();
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://192.168.78.121:5000/song");
    xhr.onload = () => {
      setSearching(false);
      const svResponse = xhr.response;
      console.log(svResponse);
      if (svResponse !== "No match found") setSong(JSON.parse(svResponse));
      else setSong("No match found!");
      // console.log(JSON.stringify(JSON.parse(svResponse), null, 2))
    };
    xhr.onerror = (e) => {
      console.log(e, "upload failed");
    };
    xhr.ontimeout = (e) => {
      console.log(e, "cloudinary timeout");
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
        const uploadProgress = loaded / total;
        //console.log(uploadProgress);
      };
    }

    console.log("Recording stopped");
    rec = null;
    FileSystem.deleteAsync(fileUri);
    setBtnDisabled(false);
  };

  const handleAddToFavorite = (favoriteHeart) => {
    const favSong = {
      title: song.track.title,
      artist: song.track.subtitle,
      image: song.track.images.coverart,
      lyrics:
        song.track.sections[1].text !== undefined
          ? song.track.sections[1].text
          : ["Lyrics Unavailable"],
      uri:
        song.track.hub.providers[0].actions[0].uri !== undefined
          ? song.track.hub.providers[0].actions[0].uri
          : "",
    };
    if (favoriteHeart === "hearto") {
      setFavoriteHeart("heart");
      // check if song is already in the list
      if (
        favorites.filter(
          (song) =>
            song.title === favSong.title && song.artist === favSong.artist
        ).length > 0
      ) {
        console.log("Song already exists");
        return;
      }
      let songUid = GenerateUUID.v4();
      const { uid, ...rest } = userData;
      let updatedUser = { ...rest };
      let newUserData = { ...userData };
      if (userData["favorites"]) {
        updatedUser["favorites"][songUid] = favSong;
        newUserData["favorites"][songUid] = favSong;
      } else {
        updatedUser["favorites"] = Object();
        newUserData["favorites"] = Object();
        updatedUser["favorites"][songUid] = favSong;
        newUserData["favorites"][songUid] = favSong;
      }
      update(ref(database, "users/" + currentUser.uid), updatedUser).then(
        () => {
          setUserData(newUserData);
          favSong["uid"] = songUid;
          setFavorites((list) => [favSong, ...list]);
        }
      );
    } else {
      setFavoriteHeart("hearto");
      const [head, ...tail] = favorites;
      remove(
        ref(database, "users/" + currentUser.uid + "/favorites/" + head.uid)
      );
      let newData = userData;
      delete newData["favorites"][head.uid];
      setUserData(newData);
      setFavorites(tail);
    }
  };

  const goToMoreDetails = (song) => {
    if (currentUser) props.navigation.navigate("Song Details", { song: song });
  };

  const deleteFromFavorites = (song) => {
    let newFavorites = favorites.filter(s => s.uid !== song.uid)
    remove(
      ref(database, "users/" + currentUser.uid + "/favorites/" + song.uid)
    );
    let newData = userData;
    delete newData["favorites"][song.uid];
    setUserData(newData);
    setFavorites(newFavorites);
  }

  const renderListItem = (song, id) => {
    return (
      <View key={id} style={styles.listItem}>
        <View style={styles.itemDetailsContainer}>
          <Text style={styles.itemText}>{id}. </Text>
          <Image
            source={{ uri: song.image }}
            style={styles.itemImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.textItemContainer} onPress={goToMoreDetails.bind(this, song)}>
            <Text style={[styles.itemText, { fontWeight: "bold" }]}>
              {song.title} {" - "}
              <Text style={[styles.itemText, { color: "#ebc96e" }]}>
                {song.artist}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.moreDetailsContainer}>
          <TouchableOpacity
            style={styles.moreDetailsButton}
            onPress={deleteFromFavorites.bind(this, song)}
          >
            <AntDesign name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["rgba(0,0,0,0.8)", "transparent"]}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.detectButton}
          onPress={handleDetect}
          disabled={btnDisabled}
        >
          <Text style={styles.text}>Press To Detect</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.mainSongContainer,
          searching ? { justifyContent: "center" } : undefined,
          song !== undefined && song !== "No match found!"
            ? styles.songFoundBorder
            : undefined,
        ]}
      >
        {searching && <ActivityIndicator size={100} color="#ebc96e" />}
        {song !== undefined && song !== "No match found!" && (
          <MainSong
            title={song.track.title}
            artist={song.track.subtitle}
            imgUri={song.track.images.coverart}
            handleAddToFavorite={handleAddToFavorite.bind(this, favoriteHeart)}
            favoriteHeart={favoriteHeart}
          />
        )}
        {song === "No match found!" && (
          <View style={styles.songNotFoundContainer}>
            <Text style={styles.songNotFoundText}> No match found! </Text>
          </View>
        )}
      </View>

      <View
        style={[
          song === undefined && !searching
            ? { flex: 1 }
            : styles.lowerPartContainer,
        ]}
      >
        <View style={styles.favoritesContainer}>
          <Text style={styles.favoritesTitle}>Favorites</Text>
          <ScrollView style={styles.list}>
            {favorites.map((song, index) =>
              renderListItem(song, favorites.length - index)
            )}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SongFinderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: "3%",
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    flex: 0.1,
    minHeight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  mainSongContainer: {
    flex: 0.4,
    width: "100%",
    paddingHorizontal: 10,
  },
  songFoundBorder: {
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },
  lowerPartContainer: {
    flex: 0.5,
  },
  detectButton: {
    borderRadius: 5,
    backgroundColor: colors.primary,
    width: Dimensions.get("window").width * 0.5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "white",
  },
  songNotFoundContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  songNotFoundText: {
    color: "#ebc96e",
    fontWeight: "bold",
    fontSize: 24,
  },
  favoritesTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  favoritesContainer: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  list: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  listItem: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "white",
    padding: 5,
    marginVertical: 10,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 45,
    justifyContent: "space-between",
  },
  itemImage: {
    width: 20,
    height: 20,
  },
  itemText: {
    color: "white",
    fontSize: 14,
  },
  itemDetailsContainer: {
    height: "100%",
    maxWidth: "85%",
    flexDirection: "row",
    alignItems: "center",
  },
  moreDetailsContainer: {
    minWidth: 20,
  },
  textItemContainer: {
    width: "90%",
    justifyContent: "center",
    paddingLeft: 2,
  },
});
