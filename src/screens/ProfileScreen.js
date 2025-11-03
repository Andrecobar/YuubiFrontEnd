import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, StatusBar, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ProfileScreen({ navigation }) {  
  const insets = useSafeAreaInsets()
 
  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
