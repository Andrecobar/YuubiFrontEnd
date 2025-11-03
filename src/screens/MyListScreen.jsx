// src/screens/MyListScreen.jsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMyList } from "../utils/myListStorage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PLACEHOLDER = "https://placehold.co/300x450?text=No+Image";

export default function MyListScreen({ navigation, route }) {
  const [list, setList] = useState([]);
  const userId = route?.params?.userId || "default";
  const insets = useSafeAreaInsets();

  // Recarga la lista cada vez que la pantalla está enfocada
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        try {
          const items = await getMyList(userId);
          console.log("[MyListScreen] loaded list:", items);
          if (mounted) setList(items || []);
        } catch (e) {
          console.error("[MyListScreen] error loading list", e);
          if (mounted) setList([]);
        }
      })();
      return () => {
        mounted = false;
      };
    }, [userId])
  );

  // Si no hay elementos, muestra el mensaje
  if (!list || list.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.empty}>
          Tu lista está vacía. Agrega películas o series con el botón + My lista
        </Text>
      </View>
    );
  }

  // Render de cada poster en la cuadrícula
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(
          item.type === "series" || item.type === "tv" ? "SeriesDetails" : "MovieDetails",
          { tmdb_id: item.tmdb_id, type: item.type }
        )
      }
    >
      <Image source={{ uri: item.poster || PLACEHOLDER }} style={styles.image} />
    </TouchableOpacity>
  );

  const safeKeyExtractor = (i, idx) => {
    // intenta varias propiedades; si no hay ninguna, usa índice
    const id = i?.tmdb_id ?? i?.id ?? i?.tmdbId ?? idx;
    return String(id);
  };

  return (
    <View style={[styles.container,{paddingTop: insets.top}]}>
      <FlatList
        data={list.slice().reverse()} // muestra el más reciente primero
        keyExtractor={safeKeyExtractor}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  empty: {
    color: "#cfcfcf",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  listContent: {
    padding: 12,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: "31%", // 3 columnas con espacio
    aspectRatio: 0.67,
    backgroundColor: "#111",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
