// src/screens/MyListScreen.jsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { getMyList } from "../utils/myListStorage";
import { useFocusEffect } from "@react-navigation/native";

export default function MyListScreen({ navigation, route }) {
  const [list, setList] = useState([]);
  const userId = route?.params?.userId || "default";

  // recargar cada vez que la screen está enfocada (useFocusEffect)
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        const items = await getMyList(userId);
        if (mounted) setList(items);
      })();
      return () => (mounted = false);
    }, [userId])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(item.type === "series" || item.type === "tv" ? "SeriesDetails" : "MovieDetails", {
          tmdb_id: item.tmdb_id,
          type: item.type,
        })
      }
    >
      <Image source={{ uri: item.poster }} style={styles.image} />
    </TouchableOpacity>
  );

  if (!list || list.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>
          Tu lista está vacía. Agrega películas o series con el botón + Mi lista
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={list.slice().reverse()} // mostrar el más reciente primero
        keyExtractor={(i) => i.tmdb_id.toString()}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#ccc", fontSize: 16, paddingHorizontal: 24, textAlign: "center" },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: { width: "31%", aspectRatio: 0.67, backgroundColor: "#111", borderRadius: 8, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
});
