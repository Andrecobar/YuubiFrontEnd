import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_URL = 'https://yuubiapi.onrender.com'; // 👈 sin barra final

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();


  const handleSearch = async (text) => {
    setQuery(text);

    if (text.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(text)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', paddingTop: insets.top}}>
      <TextInput
        placeholder="Buscar películas o series..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      {loading ? (
        <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text
                style={{ color: '#fff' }}
                onPress={() =>
                  navigation.navigate(
                    item.type === "series" || item.type === "tv"
                      ? "SeriesDetails"
                      : "MovieDetails",
                    { tmdb_id: item.tmdb_id, type: item.type }
                  )
                }
                
              >
                {item.title || item.name}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: '#111',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    margin: 12,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
});
