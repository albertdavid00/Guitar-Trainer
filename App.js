import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainMenuScreen from "./screens/MainMenuScreen";
import EarTrainerMenu from "./screens/EarTrainerMenuScreen";
import EarTrainerGameScreen from "./screens/EarTrainerGameScreen";
import colors from "./constants/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style= {{backgroundColor: 'black'}}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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
