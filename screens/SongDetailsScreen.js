import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import React, {useState, useRef} from "react";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const SongDetailsScreen = (props) => {
  const { song } = props.route.params;
  const [favoriteHeart, setFavoriteHeart] = useState("heart");
  const [scrollTop, setScrollTop] = useState(false);
  const scrollRef = useRef();

  const renderLine = (lyrics, id) => {
    return(
      <View style={styles.listItem} key={id}>
        <Text style={styles.lyrics}> {lyrics} </Text>
      </View>
    )
  }

  const autoScroll = () => {
    if(scrollTop){
      scrollRef.current.scrollTo({x: 0});
      setScrollTop(false)
      return;
    }
    scrollRef.current.scrollToEnd({animated: true});
    setScrollTop(true);
    
  }

  const openExternalApp = () => {
    Linking.openURL(song.uri);
  }

  return (
    <LinearGradient
      colors={["rgba(0,0,0,0.8)", "transparent"]}
      style={styles.screen}
    >
      <View style={styles.upperPartContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: song.image }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </View>
        <LinearGradient
          style={styles.textButtonsContainer}
          start={{ x: 1, y: 0.75 }}
          end={{ x: 0, y: 0.25 }}
          colors={["rgba(24, 112, 190, 0.8)", "transparent"]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{song.title}</Text>
            <Text style={styles.artistText}> {song.artist}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.btn} onPress={openExternalApp}>
              <AntDesign name="play" size={24} color="lightgreen" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
              <AntDesign name={favoriteHeart} size={24} color="#ebc96e" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.lowerPartContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Lyrics</Text>
          <TouchableOpacity onPress={() => {autoScroll()}}>
            <FontAwesome5 name="scroll" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView styles={styles.list} ref={scrollRef}>
          {song.lyrics.map((line, index) => renderLine(line, index + 1))}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default SongDetailsScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  upperPartContainer: {
    paddingVertical: 10,
    alignItems: "center",
    flex: 0.3,
    justifyContent: "space-between",
  },
  titleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  artistText: {
    color: "#ebc96e",
    fontSize: 15,
  },
  imageContainer: {
    padding: 5,
    width: "100%",
    height: "60%",
  },
  textButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    height: "30%",
  },
  textContainer:{
    width:'70%',
  },
  lowerPartContainer: {
    width: "100%",
    padding: "3%",
    flex: 0.7,
  },
  titleContainer: {
    width: "100%",
    paddingHorizontal: '5%',
    height: '7%',
    alignItems: "center",
    justifyContent: 'space-between',
    flexDirection: 'row'

  },
  buttonsContainer:{
    width: '30%',
    height:'50%',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-around',
    borderLeftWidth: 1,
    borderColor: 'white'
  },
  btn:{
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lyrics: {
    color:'white',
    fontSize: 13
  },
  list :{
    width:'100%',
    height: '100%'
  },
  listItem: {
    alignItems: 'center'
  }
});
