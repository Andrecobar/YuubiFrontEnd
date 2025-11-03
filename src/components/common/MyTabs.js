import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HomeScreen from "../../screens/HomeScreen";
import SearchScreen from "../../screens/SearchScreen";
import MyListScreen from "../../screens/MyListScreen";
import ProfileScreen from "../../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#161616",
          borderTopWidth: 0,
          color: "#505050",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
        
          if (route.name === "Inicio") iconName = "home-filled";
          else if (route.name === "Buscar") iconName = "search";
          else if (route.name === "Mylista") iconName = "bookmark";
          else if (route.name === "Perfil") iconName = "person";
        
          return <MaterialIcons name={iconName} size={size} color={color} />;
        }        
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Mylista" component={MyListScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
