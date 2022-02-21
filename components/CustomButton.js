import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import colors from "../constants/colors";

const CustomButton = (props) => {
  return (
    <TouchableOpacity style={styles.boxContainer} onPress={props.onPress}>
      <View style={styles.container}>
        <Text style={styles.text}> {props.children} </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  boxContainer: {
    marginHorizontal: 15,
    marginVertical: 20,
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderRadius: 20,
  },
  text: {
    color: colors.text,
    fontSize: 25,
    textAlign: "center",
  },
});

export default CustomButton;
