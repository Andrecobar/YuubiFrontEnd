// src/components/UI/SmallCard.jsx
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function SmallCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)}>
      <Image source={{ uri: item.poster || item.image }} style={styles.image} />
      <View style={styles.meta}>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 140, borderRadius: 4, overflow: "hidden", backgroundColor: "#111" },
  image: { width: "100%", height: 200 },
});
