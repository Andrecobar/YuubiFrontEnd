// src/screens/HomeScreen.jsx
import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import TopBar from "../components/UI/TopBar";
import HeaderCard from "../components/Header/HeaderCard";
import Carousel from "../components/UI/Carousel";
import SmallCard from "../components/UI/SmallCard";
import { fetchHome } from "../services/homeService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets(); // para manejar márgenes seguros
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Cargamos la data del Home
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const home = await fetchHome();

      // 🔧 Normaliza el objeto destacado (featured)
      if (home.featured && home.featured.details) {
        home.featured = home.featured.details;
      }

      // Si no hay imagen o título, pon valores por defecto
      home.featured = {
        tmdb_id: home.featured?.tmdb_id || home.featured?.id, // ⬅️ ¡IMPORTANTE!
        type: home.featured?.type || "movie", // ⬅️ ¡IMPORTANTE!
        title: home.featured?.title || "Película destacada",
        backdrop: home.featured?.backdrop || home.featured?.poster || "https://placehold.co/600x800",
        genres: home.featured?.genres || ["Acción", "Drama"],
      };

      setData(home);
    } catch (err) {
      console.error("Home load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#fff" />;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TopBar title="Para Andre" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 🎬 HEADER PRINCIPAL */}
        <HeaderCard
          details={data.featured}
          onPlayPress={() => navigation.navigate("MoviePlayer", { movie: data.featured })}
          onMyListPress={() => console.log("Añadido a la lista")}
        />

        {/* 🎞️ SECCIONES */}
        <Carousel
          title="Disponibles Ahora"
          data={data.verified_movies}
          itemWidth={140}
          renderItem={({ item }) => (
            <SmallCard
              item={item}
              onPress={() =>
                navigation.navigate(
                  item.type === "series" || item.type === "tv"
                    ? "SeriesDetails"
                    : "MovieDetails",
                  { tmdb_id: item.tmdb_id, type: item.type }
                )
              }
            />
          )}
        />

        <Carousel
          title="Trending Esta Semana"
          data={data.trending}
          renderItem={({ item }) => (
            <SmallCard
              item={item}
              onPress={() =>
                navigation.navigate(
                  item.type === "series" || item.type === "tv"
                    ? "SeriesDetails"
                    : "MovieDetails",
                  { tmdb_id: item.tmdb_id, type: item.type }
                )
              }
            />
          )}
        />

        <Carousel
          title="Películas Populares"
          data={data.popular_movies}
          renderItem={({ item }) => (
            <SmallCard
              item={item}
              onPress={() =>
                navigation.navigate(
                  item.type === "series" || item.type === "tv"
                    ? "SeriesDetails"
                    : "MovieDetails",
                  { tmdb_id: item.tmdb_id, type: item.type }
                )
              }
            />
          )}
        />

<Carousel
          title="Series Populares"
          data={data.popular_series}
          renderItem={({ item }) => (
            <SmallCard
              item={item}
              onPress={() =>
                navigation.navigate(
                  item.type === "series" || item.type === "tv"
                    ? "SeriesDetails"
                    : "MovieDetails",
                  { tmdb_id: item.tmdb_id, type: item.type }
                )
              }
            />
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
});
