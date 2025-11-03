import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import MyListButton from "../components/MyListButton"

const API_URL = "https://yuubiapi.onrender.com";

export default function MovieDetailsScreen({ route, navigation }) {
  const { tmdb_id, type } = route.params || {};
  const [details, setDetails] = useState(null);
  const [links, setLinks] = useState(null);
  const [loadingLinks, setLoadingLinks] = useState(false);

  useEffect(() => {
    console.log("📦 PARAMS:", route.params);
    fetchDetails();
    fetchLinks();
  }, []);

  const fetchDetails = async () => {
    try {
      console.log("🔍 Fetching details from:", `${API_URL}/api/details/${tmdb_id}?type=${type}`);
      const response = await fetch(`${API_URL}/api/details/${tmdb_id}?type=${type}`);
      const data = await response.json();
      console.log("✅ DETAILS DATA:", data);

      // Si la API devuelve el objeto directo, ajustamos dinámicamente
      setDetails(data.details ? data.details : data);
    } catch (error) {
      console.error("❌ Error al obtener detalles:", error);
    }
  };

  const fetchLinks = async () => {
    setLoadingLinks(true);
    try {
      console.log("🔗 Fetching links from:", `${API_URL}/api/links/${tmdb_id}?auto_scrape=true`);
      const response = await fetch(`${API_URL}/api/links/${tmdb_id}?auto_scrape=true`);
      const data = await response.json();
      console.log("✅ LINKS DATA:", data);
      setLinks(data);
    } catch (error) {
      console.error("❌ Error al obtener links:", error);
    } finally {
      setLoadingLinks(false);
    }
  };

  const handlePlay = (server) => {
    console.log("▶️ Playing on:", server);
    navigation.navigate("MoviePlayer", {
      url: server.url,
      title: details?.title,
    });
  };

  if (!details) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#09f" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Fondo */}
      <Image source={{ uri: details.backdrop }} style={styles.backdrop} blurRadius={6} />
      <MyListButton
  item={{
    tmdb_id: details.tmdb_id,
    type: details.type || "movie",
    poster: details.poster || details.backdrop,
    title: details.title,
  }}
  userId={"default"}
  onChange={(newList) => {
    // opcional: si quieres que MyListScreen se actualice inmediatamente
    // podrías usar algún event emitter o rely en useFocusEffect para recargar al abrir MyList
  }}
/>
      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.title}>{details.title}</Text>
        <Text style={styles.meta}>
          ⭐ {details.rating || "N/A"} • 🎬 {details.year || "?"} • {details.duration || "?"} min
        </Text>
        <Text style={styles.description}>{details.description || "Sin descripción."}</Text>

        {/* Botón de reproducir */}
        {loadingLinks ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Buscando enlaces...</Text>
          </View>
        ) : links && links.success ? (
          <View>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => handlePlay(links.links[0])}
            >
              <Text style={styles.playButtonText}>▶️ VER AHORA</Text>
            </TouchableOpacity>

            <Text style={styles.serversTitle}>Servidores disponibles:</Text>
            {links.links.map((server, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serverButton}
                onPress={() => handlePlay(server)}
              >
                <Text style={styles.serverText}>
                  {server.server} — {server.language}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.notAvailable}>
            <Text style={styles.notAvailableText}>
              Esta película aún no está disponible 😢
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backdrop: {
    width: "100%",
    height: 250,
    opacity: 0.4,
    position: "absolute",
  },
  content: {
    padding: 16,
    marginTop: 200,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  meta: {
    color: "#ccc",
    marginVertical: 4,
  },
  description: {
    color: "#eee",
    marginVertical: 10,
  },
  playButton: {
    backgroundColor: "#09f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  playButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  serversTitle: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 10,
  },
  serverButton: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  },
  serverText: {
    color: "#fff",
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
  notAvailable: {
    marginTop: 20,
    alignItems: "center",
  },
  notAvailableText: {
    color: "#ccc",
  },
});

