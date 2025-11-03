// src/components/Header/HeaderCard.jsx
import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function HeaderCard({ details, onPlayPress, onMyListPress }) {
  if (!details) return null;

  return (
    <View style={styles.card}>
      {/* fondo */}
      <Image source={{ uri: details.backdrop || details.poster }} style={styles.image} />

      {/* overlay para hacer legible el texto */}
      <View style={styles.overlay} />

      {/* info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {details.title}
        </Text>
        <Text style={styles.categories} numberOfLines={1}>
          {(details.genres || details.genresText)
            ? (details.genres?.join(" • ") || details.genresText)
            : ""}
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.playButton} onPress={onPlayPress} activeOpacity={0.85}>
            <Ionicons name="play" size={22} color="#000" />
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.myListButton} onPress={onMyListPress} activeOpacity={0.85}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.myListText}>My List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    height: 480,
    alignSelf: "center",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 20,
    backgroundColor: "#000",
    boxShadow: "0 0 1px rgb(255, 255, 255)",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.46)",
  },
  info: {
    position: "absolute",
    bottom: 28,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  categories: {
    color: "#cfcfcf",
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    flexShrink: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 14,
    gap: 12,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  playButtonText: {
    marginLeft: 8,
    color: "#000",
    fontWeight: "700",
    fontSize: 18,
  },
  myListButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  myListText: {
    marginLeft: 8,
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
