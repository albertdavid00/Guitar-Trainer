import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainMenuScreen from "./screens/MainMenuScreen";
import EarTrainerMenu from "./screens/EarTrainerMenuScreen";
import EarTrainerGameScreen from "./screens/EarTrainerGameScreen";
import SongFinderScreen from "./screens/SongFinderScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import colors from "./constants/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TunerScreen from "./screens/TunerScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { LogBox } from 'react-native';
import SongDetailsScreen from "./screens/SongDetailsScreen";
import SettingsScreen from "./screens/SettingsScreen";

LogBox.ignoreLogs(['Setting a timer']);
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider style={{ backgroundColor: "black" }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main Menu"
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.secondary,
              },
              headerTintColor: "#fff",
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen
              name="Main Menu"
              component={MainMenuScreen}
              options={{
                title: "Guitar Trainer",
              }}
            />
            <Stack.Screen
              name="Ear Trainer Menu"
              component={EarTrainerMenu}
              options={{
                title: "Ear Trainer Menu",
              }}
            />
            <Stack.Screen name="Ear Trainer" component={EarTrainerGameScreen} />
            <Stack.Screen
              name="Tuner"
              component={TunerScreen}
              options={{
                title: "Tuner",
              }}
            />

            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="Song Finder"
              component={SongFinderScreen}
              options={{
                title: "Song Finder",
              }}
            />
            <Stack.Screen
              name="Song Details"
              component={SongDetailsScreen}
              options={{
                title: "Details",
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: "User Settings",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
