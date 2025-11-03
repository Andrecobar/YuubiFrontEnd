// src/components/UI/Carousel.jsx
import React, { useMemo } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";

export default function Carousel({ data = [], renderItem, title, itemWidth = 140, gap = 12, contentPadding = 16 }) {
  const keyExtractor = (item) => (item.id ? item.id.toString() : item.tmdb_id?.toString() || Math.random().toString());

  const contentStyle = useMemo(() => ({ paddingLeft: contentPadding, paddingRight: contentPadding }), [contentPadding]);

  return (
    <View style={styles.container}>
      {title && <View style={styles.titleWrap}><Text style={styles.titleText}>{title}</Text></View>}

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={contentStyle}
        ItemSeparatorComponent={() => <View style={{ width: gap }} />}
        getItemLayout={(_, index) => ({ length: itemWidth + gap, offset: (itemWidth + gap) * index, index })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  titleWrap: { marginLeft: 16, marginBottom: 8 },
  titleText: { color: "#fff", fontSize: 20, fontWeight: "700" },
});
