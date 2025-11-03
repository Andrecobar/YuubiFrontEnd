import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import MovieDetailsScreen from "./src/screens/MovieDetailsScreen";
import SeriesDetailsScreen from "./src/screens/SeriesDetailsScreen";
import MoviePlayerScreen from "./src/screens/MoviePlayerScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import MyTabs from './src/components/common/MyTabs';
import { SafeAreaProvider } from "react-native-safe-area-context";


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName="Home">
        {/* 👇 Esto es tu navegación inferior */}
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={{ headerShown: false }}
        />

        {/* 👇 Estas pantallas se abren encima de las tabs */}
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen}
          options={{ title: "Detalles",
            headerStyle: { backgroundColor: "#161616" },
            headerTintColor: "#fff", // ← cambia texto y el icono “back”
            headerTitleStyle: { color: "#fff" },}}
        />
        <Stack.Screen
          name="SeriesDetails"
          component={SeriesDetailsScreen}
          options={{ title: "Detalles",
            headerStyle: { backgroundColor: "#161616" },
            headerTintColor: "#fff", // ← cambia texto y el icono “back”
            headerTitleStyle: { color: "#fff" },}}
        />
        <Stack.Screen
          name="MoviePlayer"
          component={MoviePlayerScreen}
          options={{ title: "Reproductor" }}
        />
        <Stack.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 400,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  genre: {
    color: "#ccc",
    fontSize: 14,
  },
  year: {
    color: "#aaa",
    fontSize: 14,
  },
  rating: {
    color: "#0f0",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
  },
  description: {
    color: "#eee",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});
