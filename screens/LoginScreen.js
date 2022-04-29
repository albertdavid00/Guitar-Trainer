import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../constants/colors";
import { auth, database } from "../firebase";
import { useAuth } from "../contexts/AuthContext";


const LoginScreen = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  
  useEffect(()=>{
    if(currentUser)
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main Menu' }]})
  }, []);

  const handleLogin = async () => {
      if(!email || !password)
        return setError("Both fields are required")
      const trimEmail = email.trim();
      setEmail(trimEmail);
      try{
        setError("");
        setLoading(true);
        await login(trimEmail, password);
        
        setLoading(false);
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'Main Menu' }]
        });

      } catch (e) {
        setError("Failed to login");
        console.log(e);
        setLoading(false);
      }
  }
  //TODO Remember me
  return (
    <KeyboardAvoidingView style={styles.container}>
      {error !== "" && (
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}> {error} </Text>
          </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
          
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}> Login </Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={{color: 'white'}}> Don't have an account? </Text>
          <Text style={{color:'#0fa3ff', textDecorationLine:'underline'}} onPress={() => {props.navigation.navigate("Register")}}>Sign Up</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary
  },
  buttonContainer:{
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    width: '60%',
  },
  button:{
    backgroundColor: colors.secondary,
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  textContainer:{
      flexDirection: "row",
      marginTop: 15
  },
  inputContainer:{
      width: '80%'
  },
  input:{
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5

  },
  alertContainer: {
    width: "80%",
    backgroundColor: "#e0968b",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  alertText: {
    color: "#871d0c",
  },
});
