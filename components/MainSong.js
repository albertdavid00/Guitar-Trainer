import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import React, {useRef, useState} from 'react'
import colors from '../constants/colors';
import { AntDesign } from "@expo/vector-icons";
const MainSong = props => {
	const {imgUri, title, artist, handleAddToFavorite, favoriteHeart} = props;    
	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={{uri: imgUri}} style={styles.image} resizeMode="contain"/>
			</View>
			<View style={styles.songDetailsContainer}>
				<View>
				<Text style={styles.songTitle}>{title}</Text>
				<Text style={styles.songArtist}>{artist}</Text>
					</View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={handleAddToFavorite}> 
                        <AntDesign
                            name={favoriteHeart}
                            size={30}
                            color='#ebc96e'
                            style={{ marginHorizontal: 5 }}
                            />
                    </TouchableOpacity>
                </View>
			</View>
		</View>
	)
}

export default MainSong

const styles = StyleSheet.create({
	container: {
		width:'100%',
		height: '100%',
		// backgroundColor:'black',
		justifyContent:"space-around",

		},
		imageContainer:{
			width:'100%',
			height:'50%',
			alignItems:'center',

		},
		songDetailsContainer: {
			width:'100%',

			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		image:{
			width:'50%',
			height:'100%'
		},
		songTitle:{
			fontWeight: 'bold',
			fontSize: 20,
			color: 'white'
		},
		songArtist:{
			fontWeight: 'bold',
			fontSize: 16,
			color: '#ebc96e'
		},
		button: {
			alignItems: 'center'
		}, 
		btnText: {
			color: 'white',
			fontSize: 16,
		}
})
