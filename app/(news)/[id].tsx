import { fetchNewsFromWordPress } from "@/api/apiNewsWP";
import { NewsItem } from "@/types/new";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "ios" ? height * 0.3 : height * 0.25;
const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

export default function NewsDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
    outputRange: [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.5],
    extrapolate: "clamp",
  });

  const headerScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
    outputRange: [1.2, 1, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const news = await fetchNewsFromWordPress();
        const selectedNews = news.find((item) => item.id === Number(id));
        if (selectedNews) {
          setNewsItem(selectedNews);
        }
      } catch (error) {
        console.error("Error fetching news detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#409CF0" />
      </View>
    );
  }

  if (!newsItem) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy bài viết</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.heroSection,
            {
              transform: [
                { translateY: headerTranslateY },
                { scale: headerScale },
              ],
            },
          ]}
        >
          <Image source={{ uri: newsItem.image }} style={styles.heroImage} />
          <View style={styles.overlay} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.contentContainer}>
          <View style={styles.metaContainer}>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons
                name="calendar"
                size={16}
                color="#409CF0"
              />
              <Text style={styles.date}>{newsItem.date}</Text>
            </View>
          </View>

          <Text style={styles.title}>{newsItem.title}</Text>

          <View style={styles.divider} />

          <RenderHtml
            contentWidth={width - 32}
            source={{ html: newsItem.content }}
            tagsStyles={{
              p: styles.paragraph,
              img: styles.image,
              a: styles.link,
              ul: styles.list,
              ol: styles.list,
              li: styles.listItem,
              blockquote: styles.blockquote,
              strong: styles.strong,
              em: styles.em,
              sub: styles.subscript,
              sup: styles.superscript,
              span: styles.span,
              h1: styles.hidden,
            }}
            classesStyles={{
              keywords: styles.keywords,
              "submission-info": styles.submissionInfo,
              "article-link": styles.articleLink,
              date: styles.hidden,
            }}
          />

          <View style={styles.shareSection}>
            <Text style={styles.shareTitle}>Chia sẻ bài viết</Text>
            <View style={styles.shareButtons}>
              <TouchableOpacity style={styles.shareButton}>
                <MaterialCommunityIcons
                  name="facebook"
                  size={24}
                  color="#1877F2"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <MaterialCommunityIcons
                  name="twitter"
                  size={24}
                  color="#1DA1F2"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <MaterialCommunityIcons
                  name="linkedin"
                  size={24}
                  color="#0077B5"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: HEADER_HEIGHT,
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButton: {
    position: "absolute",
    top: STATUS_BAR_HEIGHT + 10,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: -30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    lineHeight: 32,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  keywords: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  submissionInfo: {
    fontSize: 12,
    color: "#888",
    marginBottom: 16,
    lineHeight: 18,
    textAlign: "right",
  },
  articleLink: {
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 16,
    textAlign: "justify",
  },
  image: {
    width: "100%",
    height: "100%",
    marginVertical: 16,
    borderRadius: 12,
  },
  link: {
    color: "#409CF0",
    textDecorationLine: "none",
    fontSize: 14,
  },
  list: {
    marginBottom: 16,
    paddingLeft: 16,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 8,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#409CF0",
    paddingLeft: 16,
    marginVertical: 16,
    fontStyle: "italic",
    color: "#666",
  },
  strong: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 12,
    textAlign: "right",
  },
  em: {
    fontStyle: "italic",
    color: "#666",
    fontSize: 12,
    textAlign: "right",
  },
  subscript: {
    fontSize: 10,
    color: "#666",
  },
  superscript: {
    fontSize: 10,
    color: "#666",
  },
  span: {
    fontSize: 14,
    color: "#444",
  },
  shareSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  shareButtons: {
    flexDirection: "row",
    gap: 12,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  hidden: {
    display: "none",
  },
});
