// src/components/MyListButton.jsx
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, Animated, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addToMyList, removeFromMyList, isInMyList } from "../utils/myListStorage";

export default function MyListButton({ item, userId = "default", onChange }) {
  const [inList, setInList] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let mounted = true;
    isInMyList(item.tmdb_id, userId).then((res) => mounted && setInList(res));
    return () => (mounted = false);
  }, [item, userId]);

  const animate = (toValue = 1.06) => {
    Animated.sequence([
      Animated.timing(scale, { toValue, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = async () => {
    try {
      animate();
      if (inList) {
        const newList = await removeFromMyList(item.tmdb_id, userId);
        setInList(false);
        onChange?.(newList);
      } else {
        const newList = await addToMyList(item, userId);
        setInList(true);
        onChange?.(newList);
      }
    } catch (e) {
      console.error("MyListButton error", e);
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={[styles.button, inList ? styles.buttonActive : null]}
      >
        <Ionicons name={inList ? "checkmark" : "add"} size={18} color={inList ? "#000" : "#fff"} />
        <Text style={[styles.text, inList ? styles.textActive : null]}>
          {inList ? "En mi lista" : "Mi lista"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 999,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  buttonActive: {
    backgroundColor: "#fff",
    borderColor: "rgba(0,0,0,0.08)",
  },
  text: { color: "#fff", marginLeft: 6, fontWeight: "700" },
  textActive: { color: "#000" },
});
