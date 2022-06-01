import { StyleSheet, Text, View, Dimensions} from 'react-native'
import React from 'react'
import colors from '../constants/colors'
import info from '../constants/info'
const InfoCard = props => {
    
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.text}>{info}</Text>
    </View>
  )
}

export default InfoCard

const styles = StyleSheet.create({
    cardContainer: {
        position: "absolute",
        width: (Dimensions.get("window").width * 2) / 3,
        height: Dimensions.get("window").height / 3,
        backgroundColor: colors.primary,
        opacity: 0.95,
        top: Dimensions.get("window").width / 3,
        left: Dimensions.get("window").width / 6,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    text:{
        color:'white'
    }
    
})