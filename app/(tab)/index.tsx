import { fetchNewsFromWordPress } from "@/api/apiNewsWP";
import BoxInfo from "@/components/BoxInfo";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { NewsItem } from "@/types/new";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function index() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedNews, setDisplayedNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await fetchNewsFromWordPress();
        setNewsData(news);
        // Initialize with first 5 items
        setDisplayedNews(news.slice(0, itemsPerPage));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * itemsPerPage;

    if (endIndex <= newsData.length) {
      setDisplayedNews(newsData.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
    }
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Header />
      <ScrollView
        style={{ flex: 1, zIndex: 0 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.boxContact}>
          <BoxInfo />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              alignSelf: "flex-start",
            }}
          >
            Năng Lực ETV
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              alignSelf: "flex-start",
            }}
          >
            Tin tức kiểm định
          </Text>
          <View style={styles.newsCard}>
            {loading ? (
              <ActivityIndicator size="large" color="#409CF0" />
            ) : (
              <NewsCard news={displayedNews} />
            )}
          </View>
          {displayedNews.length < newsData.length && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
            >
              <Text style={styles.loadMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32, // để tránh đụng đáy
  },
  container: {
    display: "flex",
    flexDirection: "column",
  },
  boxContact: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  newsCard: {
    shadowColor: "#409CF0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1.5,
  },
  loadMoreButton: {
    alignItems: "center",
    marginBottom: 40,
    padding: 10,
  },
  loadMoreText: {
    color: "#409CF0",
    fontSize: 16,
    fontWeight: "600",
  },
});
