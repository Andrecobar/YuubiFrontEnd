import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderCard } from "../components/Header/HeaderCard";


export default function HomeCard({ navigation }) {
  const [details, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets()

  useEffect(() => {
    fetch("https://yuubiapi.onrender.com/api/details/552524?type=movie")
      .then((res) => res.json())
      .then((data) => {
        // 🔹 Accedemos al objeto details que viene dentro de la respuesta
        const details = data.details;
  
        // 🔹 Normalizamos la estructura para que sea clara y consistente
        const mappedMovie = {
          title: details.title,
          poster: details.backdrop, // usamos el backdrop para fondo (más ancho)
          genres: details.genres,
          rating: details.rating,
          description: details.description,
          year: details.year,
        };
  
        setMovie(mappedMovie);
        setLoading(false);
      })
      .catch((err) => console.error("Error al cargar película:", err));
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />;

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <HeaderCard style={styles.headerContainer}
        details={details}
        onPlayPress={() => alert(`Reproducir: ${details.title}`)}
        onMyListPress={() => alert(`Agregado a My List: ${details.title}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
