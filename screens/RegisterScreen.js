import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TextInput
} from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../firebase";
import { ref, get, child, query, orderByValue, equalTo } from "firebase/database";

const RegisterScreen = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUsername] = useState("");
  const { register, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(currentUser)
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main Menu' }]})
  }, []);

  const handleSubmit = () => {
    setEmail(prev => prev.trim());
    if (!email || !username || !password || !passwordConfirm) {
      return setError("All fields are required");
    }
    if (!email.includes("@")) return setError("Invalid email address");
    let regExpName = /^(?=[a-zA-Z0-9._]{4,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    let regExpPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{7,}$/;
    const trimmedUsername = username.trim();
    if (!regExpName.test(trimmedUsername))
      return setError(
        "Invalid username \n- can contain alphanumeric characters, underscore or dot (not start or end) \n" +
          "- underscore and dot can't be next to each other or used multiple times in a row\n- between 4 - 30 characters"
      );
    if (!regExpPass.test(password))
    return setError(
      "Password must contain \n- both uppercase and lowercase letters \n- at least 1 number \n" +
        "- minimum 7 characters"
    );
    if (password !== passwordConfirm) return setError("Passwords don't match");
    
    //DONE check if username already exists
    const dbRef = ref(database);
    get(query(child(dbRef, "usernames"), orderByValue(), equalTo(trimmedUsername))).then(
      async (snapshot) => {
        if(snapshot.exists()){
            setError("Username already exists")
        }
        else{
          try {
            setError("");
            setLoading(true);
            
            await register(email, trimmedUsername, password);
            
            setLoading(false);
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Main Menu' }]
            });
      
          } catch (error) {
            setError("Failed to register: " + error);
            console.log(error);
            setLoading(false);
          }
        }
    }).catch(e => console.log(e));;
  };

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
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {handleSubmit()}}
          disabled={loading}
        >
          <Text style={styles.buttonText}> Register </Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={{ color: "white" }}> Already have an account? </Text>
          <Text
            style={{ color: "#0fa3ff", textDecorationLine: "underline" }}
            onPress={() => {
              props.navigation.navigate("Login");
            }}
          >
            Login
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    width: "60%",
  },
  button: {
    backgroundColor: colors.secondary,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  textContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
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
