import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	ActivityIndicator,
  ScrollView, 
  Image
} from "react-native";
import React, {useState, useEffect} from "react";
import colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system';
import recordingOptions from "../constants/recordingOptions";
import mockData from "../constants/responseData";
import MainSong from "../components/MainSong";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";

const SongFinderScreen = (props) => {
  //TODO ADD FAVORITES TO DATABASE, DISPLAY CARD WITH SONG INFO, REMOVE FROM FAVORITES ANY ITEM, LINK TO PLAY THE SONG
	const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [song, setSong] = useState(mockData);
	const { currentUser, userData } = useAuth();
	const [searching, setSearching] = useState(false);
  const [favoriteHeart, setFavoriteHeart] = useState("hearto")
  const [favorites, setFavorites] = useState([]);
  // setFavorites(f => [{
  //   title : "Someone You Loved",
  //   artist: "Lewis Capaldi",
  //   lyrics: 'lyrics',
  //   image: 'https://is4-ssl.mzstatic.com/image/thumb/Music114/v4/cb/00/ed/cb00ed18-6552-a972-7cb3-9141ea7c91ed/19UMGIM90850.rgb.jpg/400x400cc.jpg'
  // }, ...f])
  // setFavorites(f => [{
  //   title : "Lose Yourself",
  //   artist: "Eminem",
  //   lyrics: 'lyrics',
  //   image: 'https://is4-ssl.mzstatic.com/image/thumb/Music114/v4/cb/00/ed/cb00ed18-6552-a972-7cb3-9141ea7c91ed/19UMGIM90850.rgb.jpg/400x400cc.jpg'
  // }, ...f])
  // setFavorites(f => [{
  //   title : "Jumatate stai",
  //   artist: "The Motans",
  //   lyrics: 'lyrics',
  //   image: 'https://is4-ssl.mzstatic.com/image/thumb/Music114/v4/cb/00/ed/cb00ed18-6552-a972-7cb3-9141ea7c91ed/19UMGIM90850.rgb.jpg/400x400cc.jpg'
  // }, ...f])
	useEffect(() => {
		if (!currentUser)
			props.navigation.reset({
				index: 0,
				routes: [{ name: "Login" }],
			});

	}, [])

	const handleDetect = async () => {
		setBtnDisabled(true);
    setSong(undefined)
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
		xhr.open('POST',"http://192.168.78.121:5000/song")
		xhr.onload = () => {
			const svResponse = xhr.response
			console.log(svResponse);
			if(svResponse !== "No match found")
				setSong(JSON.parse(svResponse))
			else
				setSong("No match found!");
			// console.log(JSON.stringify(JSON.parse(svResponse), null, 2))
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
     // lyrics: song.track.sections[1].text
    }
    if(favoriteHeart === "hearto"){
        setFavoriteHeart("heart")    
        setFavorites(list => [favSong, ...list])
    }
    else{
        setFavoriteHeart("hearto");
        const [head, ...tail] = favorites;
        setFavorites(tail);
    }
}

  const renderListItem = (song, id) => {
    return(
    <TouchableOpacity key={id} style={styles.listItem}>
      <Text style={styles.itemText}>{id}. </Text>
      <Image source={{uri: song.image}} style={styles.itemImage} resizeMode="contain"/>
      <Text style={[styles.itemText, {fontWeight: 'bold'}]}> {song.title} - </Text>
      <Text style={[styles.itemText, {color: '#ebc96e'}]}> {song.artist}</Text>
    </TouchableOpacity>
    )
  }

	return (
		<SafeAreaView style={styles.container}>

			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.detectButton} onPress={handleDetect} disabled = {btnDisabled}>
					<Text style={styles.text}>Press To Detect</Text>
				</TouchableOpacity>
			</View>
			<LinearGradient 
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={[styles.mainSongContainer, 
                searching ? {justifyContent: 'center'} : undefined,
                song !== undefined && song !== "No match found!" ? styles.songFoundBorder : undefined]} 
      > 
				{ searching && <ActivityIndicator size={100} color="#ebc96e"/>}
				{ song !== undefined && song !== "No match found!" && 
					<MainSong 
            title={song.track.title} 
            artist={song.track.subtitle} 
            imgUri={song.track.images.coverart}
            handleAddToFavorite={handleAddToFavorite.bind(this, favoriteHeart)}
            favoriteHeart={favoriteHeart}
            />
				} 
				{
					song === "No match found!" && 
					<View style={styles.songNotFoundContainer}>
						<Text style={styles.songNotFoundText}> No match found! </Text>
					</View>
				}
			</LinearGradient>

			<View style={[song === undefined && !searching ? {flex: 1} : styles.lowerPartContainer]}>
				<View style={styles.favoritesContainer}>
					<Text style={styles.favoritesTitle}>Favorites</Text>
          <ScrollView style={styles.list}>
            {favorites.map((song, index) => renderListItem(song, favorites.length - index))}
          </ScrollView>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SongFinderScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.primary,
	},
	text: {
		fontSize: 18,
		fontWeight: "500",
		color: "white",
		textAlign: "center",
	},
	buttonContainer: {
		width: '100%',
		flex: 0.1,
		minHeight: 10,
		alignItems: "center",
		justifyContent: 'center',

	},
	mainSongContainer: {
		flex: 0.4,
		backgroundColor: colors.primary,
		width: '100%',
		paddingHorizontal: 10,
	},
	songFoundBorder: {
		borderBottomColor: 'black',
		borderBottomWidth: 1
	},
	lowerPartContainer: {
		flex:0.5,
	}
	,
	detectButton: {
		borderRadius: 5,
		backgroundColor: colors.secondary,
		width: Dimensions.get("window").width * 0.5,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderRadius: 10,
		borderColor: '#ebc96e',
	},
	songNotFoundContainer: {
		height: '100%',
		width: '100%',
		alignItems: "center",
		justifyContent: "center"
	},
	songNotFoundText: {
		color: '#ebc96e',
		fontWeight: "bold",
		fontSize: 24
	},
	favoritesTitle:{
		color: 'white',
		fontSize: 22
	},
	favoritesContainer: {
		width: '100%',
		height:'100%',
		paddingHorizontal: 10,
		paddingTop:5,
	},
  list:{
    width:'100%',
    height:'100%',
    paddingHorizontal: 10,

  },
  listItem: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 5,
      marginVertical: 10,
      backgroundColor: colors.secondary,
      flexDirection:'row',
      alignItems:'center',
      minHeight: 45
      
  },
  itemImage: {
    width: 20,
    height: 20,
  },
  itemText: {
    color: 'white',
    fontSize: 14
  }
});
