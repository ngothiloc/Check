import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { NewsItem } from "../types/new";

const NewsCard = ({ news }: { news: NewsItem[] }) => {
  const router = useRouter();

  return (
    <View style={styles.newsContainer}>
      {news.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => router.push(`/(news)/${item.id}` as any)}
          style={styles.pressable}
        >
          <View style={styles.container}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              {/* <Text style={styles.content}>{item.content}</Text> */}
              <View style={styles.datetime}>
                <MaterialCommunityIcons
                  name="calendar"
                  color={"#8F9098"}
                  size={16}
                />
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  newsContainer: {
    gap: 12,
  },
  pressable: {
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    overflow: "hidden",
    borderRadius: 12,
  },
  image: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: "#5D5D5D",
    fontWeight: "500",
    marginTop: 5,
  },
  datetime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  date: {
    fontSize: 13,
    color: "#8F9098",
    fontWeight: "400",
  },
});

export default NewsCard;
