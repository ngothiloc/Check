import { fetchNewsFromWordPress } from "@/api/apiNewsWP";
import BoxInfo from "@/components/BoxInfo";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { NewsItem } from "@/types/new";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const itemsPerPage = 5;

  const fetchNews = async () => {
    try {
      const news = await fetchNewsFromWordPress();
      setNewsData(news);
      // Initialize with first 5 items
      setDisplayedNews(news.slice(0, itemsPerPage));
      setCurrentPage(1);
      setError(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(true);
      setErrorMessage("Không thể tải tin tức. Vui lòng thử lại sau.");
      setNewsData([]); // Clear data on error
      setDisplayedNews([]); // Clear displayed data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNews();
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
        style={{ flex: 1, zIndex: 0, marginTop: 25 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#gray"]} // Màu của indicator khi refresh
            tintColor="#gray" // Màu của indicator khi refresh (iOS)
            // title="Đang tải lại..." // Text hiển thị khi refresh (iOS)
            // titleColor="#409CF0" // Màu của text khi refresh (iOS)
          />
        }
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
            ) : error ? (
              <Text style={{ color: "red", textAlign: "center" }}>
                {errorMessage}
              </Text>
            ) : newsData.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="access-point-off"
                  size={60}
                  color="#666"
                  style={{ marginBottom: 10 }}
                />
                <Text style={{ textAlign: "center" }}>
                  Không có tin tức nào.
                </Text>
              </View>
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
  },
  newsCard: {
    // shadowColor: "#409CF0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  loadMoreButton: {
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },
  loadMoreText: {
    color: "#409CF0",
    fontSize: 16,
    fontWeight: "600",
  },
});
