import Header from "@/components/Header";
import React from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";

export default function account() {
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Header />
      <ScrollView
        style={{ flex: 1, zIndex: 0 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      ></ScrollView>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 25,
  },
});
