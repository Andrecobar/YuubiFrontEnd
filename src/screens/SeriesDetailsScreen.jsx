// src/screens/SeriesDetailsScreen.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { fetchDetails } from "../services/detailsService";
import { fetchSeason } from "../services/seriesService";
import MyListButton from "../components/MyListButton"

export default function SeriesDetailsScreen({ route, navigation }) {
  const { tmdb_id } = route.params;
  const [details, setDetails] = useState(null);
  const [season, setSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 🔹 Carga inicial
  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchDetails(tmdb_id, "tv");
        setDetails(data.details);
        const seasonData = await fetchSeason(tmdb_id, 1);
        setEpisodes(seasonData.episodes);
      } catch (err) {
        console.error("❌ Error cargando serie:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [tmdb_id]);

  // 🔹 Cambiar temporada
  const handleSeasonChange = async (newSeason) => {
    try {
      setSeason(newSeason);
      setLoading(true);
      const seasonData = await fetchSeason(tmdb_id, newSeason);
      setEpisodes(seasonData.episodes);
    } catch (err) {
      console.error("❌ Error al cambiar temporada:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Selección del dropdown
  const handleSeasonSelect = (selectedSeason) => {
    handleSeasonChange(selectedSeason);
    setIsDropdownOpen(false);
  };

  // 🔹 Render de episodios (optimizado)
  const renderEpisode = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.episodeCard}
        onPress={() => navigation.navigate("MoviePlayer", { movie: item })}
      >
        <Image source={{ uri: item.still_path }} style={styles.episodeImage} />
        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle}>
            {item.episode_number}. {item.name}
          </Text>
          <Text style={styles.episodeOverview} numberOfLines={2}>
            {item.overview}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation]
  );

  if (loading && !details)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );

  if (!details)
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#fff" }}>No se encontraron detalles.</Text>
      </View>
    );

  return (
    <ScrollView
      style={styles.container}
      scrollEnabled={!isDropdownOpen}
      contentContainerStyle={{ zIndex: 10 }}
    >
      {/* Imagen superior */}
      <Image source={{ uri: details.backdrop }} style={styles.backdrop} />
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

      {/* Información de la serie */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{details.title}</Text>
        <Text style={styles.meta}>
          {details.year} • {details.genres.join(", ")} • ⭐{" "}
          {details.rating.toFixed(1)}
        </Text>
        <Text style={styles.description}>{details.description}</Text>

        {/* Dropdown de temporadas */}
        <View style={styles.seasonDropdownContainer}>
          <TouchableOpacity
            style={styles.seasonToggle}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.seasonToggleText}>
              Temporada {season}
            </Text>
            <Text
              style={[
                styles.dropdownArrow,
                { transform: [{ rotate: isDropdownOpen ? "180deg" : "0deg" }] },
              ]}
            >
              ▼
            </Text>
          </TouchableOpacity>

          {isDropdownOpen && details.seasons > 0 && (
            <View style={styles.dropdownMenu}>
              <ScrollView
                style={styles.dropdownScroll}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {[...Array(details.seasons)].map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleSeasonSelect(i + 1)}
                    style={[
                      styles.seasonButton,
                      season === i + 1 && styles.seasonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.seasonText,
                        season === i + 1 && styles.seasonTextActive,
                      ]}
                    >
                      Temporada {i + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Lista de episodios */}
        {loading ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 10 }} />
        ) : (
          <FlatList
            data={episodes}
            keyExtractor={(item) => item.episode_number.toString()}
            renderItem={renderEpisode}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  backdrop: { width: "100%", height: 250 },
  infoContainer: { padding: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  meta: { color: "#ccc", fontSize: 14, marginBottom: 8 },
  description: { color: "#ddd", fontSize: 15, lineHeight: 22, marginBottom: 20 },

  // Dropdown container
  seasonDropdownContainer: {
    marginBottom: 20,
    position: "relative",
    zIndex: 9999,
  },
  seasonToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  seasonToggleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownArrow: {
    color: "#fff",
    fontSize: 12,
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#333",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  seasonButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  seasonActive: {
    backgroundColor: "#333",
  },
  seasonText: {
    color: "#ccc",
    fontSize: 14,
  },
  seasonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Episodios
  episodeCard: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#111",
    borderRadius: 10,
    overflow: "hidden",
  },
  episodeImage: { width: 120, height: 80 },
  episodeInfo: { flex: 1, padding: 10 },
  episodeTitle: { color: "#fff", fontWeight: "bold" },
  episodeOverview: { color: "#aaa", fontSize: 13, marginTop: 4 },
});
