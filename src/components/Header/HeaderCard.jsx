// src/components/Header/HeaderCard.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from "react-native";
import {
  addToMyList,
  removeFromMyList,
  isInMyList,
  onMyListChange,
} from "../../utils/myListStorage";

export default function HeaderCard({ details, onPlayPress }) {
  const [inList, setInList] = useState(false);
  const detailsRef = useRef(details);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    detailsRef.current = details;
  }, [details]);

  const checkInListStatus = useCallback(async () => {
    const id = detailsRef.current?.tmdb_id ?? detailsRef.current?.id;
    if (id == null) return;
    const isPresent = await isInMyList(id);
    setInList(isPresent);
  }, []);

  useEffect(() => {
    checkInListStatus();
    const unsubscribe = onMyListChange(checkInListStatus);
    return () => unsubscribe();
  }, [checkInListStatus]);

  const animate = (toValue = 1.06) => {
    Animated.sequence([
      Animated.timing(scale, { toValue, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const handleMyListPress = async () => {
    const details = detailsRef.current;
    if (!details) return;

    const id = details.tmdb_id ?? details.id;
    if (id == null) return;

    try {
      animate();
      if (inList) {
        await removeFromMyList(id);
        setInList(false);
      } else {
        await addToMyList(details);
        setInList(true);
      }
    } catch (e) {
      console.error("Error al actualizar la lista", e);
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: details.backdrop }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.overlay} />

      <View style={styles.info}>
        <Text style={styles.title}>{details.title}</Text>
        <Text style={styles.categories}>
          {details.genres?.join(", ") || "Géneros no disponibles"}
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onPlayPress} style={styles.playButton}>
            <Text style={styles.playButtonText}>▶ Play</Text>
          </TouchableOpacity>

          {/* ✨ Botón My List con animación y colores invertidos */}
          <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleMyListPress}
              style={[
                styles.myListButton,
                inList ? styles.myListButtonActive : styles.myListButtonInactive,
              ]}
            >
              <Text style={[styles.myListText, inList ? styles.myListTextActive : null]}>
                {inList ? "✓ My List " : "+ My List"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
    elevation: 2,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  // ✅ Estilos del botón My List — MANTIENE FORMA CUADRADA
  myListButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8, // cuadrado con bordes suaves, como antes
  },
  myListButtonInactive: {
    flexDirection: "row",
    backgroundColor: "#333",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  myListButtonActive: {
    backgroundColor: "#fff",
  },
  myListText: {
    marginLeft: 8,
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  myListTextActive: {
    color: "#000",
  },
  myListTextInactive: {
    color: "#fff",
  },
});