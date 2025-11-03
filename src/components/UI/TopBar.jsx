// src/components/UI/TopBar.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TopBar({ title = "Para Andre" }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "transparent", // si quieres que sea transparente sobre fondo oscuro
  },
  title: {
    color: "#ffff", // si tu fondo en la pantalla es claro; si es oscuro cambia a #fff
    fontWeight: "800",
    fontSize: 22,
    textAlign: "start",
    position: "absolute",
    left: 0, right: 0,
    padding: 16,
    lineHeight: 24,
  },
});
