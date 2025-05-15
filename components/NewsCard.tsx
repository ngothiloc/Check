import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { NewsItem } from "../types/new";

const NewsCard = ({ news }: { news: NewsItem[] }) => {
  return (
    <View>
      {news.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => console.log(`Mở bài viết: ${item.id}`)}
        >
          <View style={styles.container}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
              <View style={styles.datetime}>
                <MaterialCommunityIcons
                  name="calendar"
                  color={"#8F9098"}
                  size={18}
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
  container: {
    flexDirection: "column",
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    borderColor: "#409CF0",
    backgroundColor: "white",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 15,
    color: "#5D5D5D",
    fontWeight: "600",
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
    justifyContent: "flex-end",
    gap: 7,
  },
  date: {
    fontSize: 13,
    color: "#7F7F7F",
    fontWeight: "400",
    fontStyle: "italic",
  },
});

export default NewsCard;
