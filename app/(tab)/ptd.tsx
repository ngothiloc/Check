import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchPTDDataFromAPI } from "../../api/apiPTD";
import FilterModal from "../../app/(ptd)/filter";
import FilterComponent from "../../components/Filter";
import PTDBox from "../../components/PTDBox";
import Sort from "../../components/Sort";
import { PTDItem } from "../../types/ptd";

// Hàm chuyển đổi status text sang số cho API
function statusTextToNumber(statusText: string): number | undefined {
  switch (statusText) {
    case "Hiệu lực":
      return 1;
    case "Sắp hết hiệu lực":
      return 2;
    case "Hết hiệu lực":
      return 3;
    case "Chờ cấp mới":
      return 4;
    case "Huỷ bỏ":
      return 5;
    default:
      return undefined;
  }
}

const PTDScreen = () => {
  const router = useRouter();
  const [deviceData, setDeviceData] = useState<PTDItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [originalData, setOriginalData] = useState<PTDItem[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  // Hàm load dữ liệu từ API, truyền filter vào API
  const loadData = useCallback(
    async (isFilter = false) => {
      if (firstLoad || isFilter) {
        setLoading(true);
        setDeviceData([]); // Xóa dữ liệu cũ ngay khi bắt đầu filter hoặc load lần đầu
      }
      try {
        // Chuyển status text sang số nếu có
        let apiFilters = { ...activeFilters };
        if (apiFilters.status) {
          const statusNumber = statusTextToNumber(apiFilters.status);
          apiFilters.status = statusNumber;
        }
        const data = await fetchPTDDataFromAPI(1, apiFilters);
        setDeviceData(data);
        setOriginalData(data);
        setCurrentPage(1);
        setHasMoreData(data && data.length === 30);
        setError(false);
        setErrorMessage("");
      } catch (error) {
        console.error("Error loading PTD data:", error);
        setError(true);
        setErrorMessage("Không thể tải dữ liệu PTD. Vui lòng thử lại sau.");
        setDeviceData([]);
        setOriginalData([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setFirstLoad(false);
      }
    },
    [activeFilters, firstLoad]
  );

  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {};
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData(false);
  }, [loadData]);

  // Khi filter thay đổi, load lại dữ liệu từ API
  useEffect(() => {
    loadData(true);
  }, [activeFilters]);

  // Hàm sort dữ liệu trên client
  const handleSortChange = (option: "newest" | "oldest" | null) => {
    if (!originalData) return;
    if (!option) {
      setDeviceData(originalData);
      return;
    }
    const sorted = [...deviceData].sort((a, b) => {
      const dateA = a.date.includes("/")
        ? new Date(a.date.split("/").reverse().join("-"))
        : new Date(a.date);
      const dateB = b.date.includes("/")
        ? new Date(b.date.split("/").reverse().join("-"))
        : new Date(b.date);
      return option === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
    setDeviceData(sorted);
  };

  const handleFilterPress = () => setFilterModalVisible(true);
  const handleFilterModalClose = () => setFilterModalVisible(false);

  const handleApplyFilters = (criteria: any) => {
    setActiveFilters(criteria);
    setFilterModalVisible(false);
    // KHÔNG gọi loadData ở đây!
  };

  // Load thêm dữ liệu khi scroll
  const loadMoreData = async () => {
    if (!hasMoreData || loading || loadingMore) return;
    try {
      setLoadingMore(true);
      let apiFilters = { ...activeFilters };
      if (apiFilters.status) {
        const statusNumber = statusTextToNumber(apiFilters.status);
        apiFilters.status = statusNumber;
      }
      const nextPage = currentPage + 1;
      const newData = await fetchPTDDataFromAPI(nextPage, apiFilters);
      if (!newData || newData.length === 0) {
        setHasMoreData(false);
        return;
      }
      setDeviceData((prevData) => [...prevData, ...newData]);
      setOriginalData((prevData) => [...prevData, ...newData]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading && (firstLoad || refreshing === false)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#888" />
        <Text style={{ color: "#888", marginTop: 16, fontSize: 16 }}>
          Đang tải dữ liệu...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.sort}>
        <Sort onSortChange={handleSortChange} />
        <FilterComponent onPress={handleFilterPress} />
      </View>
      <View style={styles.ptdBox}>
        {error ? (
          <Text style={{ color: "red", textAlign: "center" }}>
            {errorMessage}
          </Text>
        ) : deviceData.length === 0 ? (
          <Text style={{ textAlign: "center" }}>Không có dữ liệu PTD nào.</Text>
        ) : (
          <FlatList
            data={deviceData}
            renderItem={({ item }) => (
              <PTDBox
                id={item.id}
                user_id={item.user_id}
                image={item.image}
                deviceName={item.deviceName}
                status={item.status}
                companyName={item.companyName}
                model={item.model}
                serial={item.serial}
                staffName={item.staffName}
                date={item.date}
                requirement={item.requirement}
                receiveStatus={item.receiveStatus}
                returnStatus={item.returnStatus}
                bbdStatus={item.bbdStatus}
                certificateNumber={item.certificateNumber}
                sealNumber={item.sealNumber}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#gray"]}
                tintColor="#gray"
              />
            }
            ListFooterComponent={
              hasMoreData ? (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={loadMoreData}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <ActivityIndicator size="small" color="#409CF0" />
                  ) : (
                    <Text style={styles.loadMoreText}>Xem thêm</Text>
                  )}
                </TouchableOpacity>
              ) : null
            }
          />
        )}
      </View>
      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleFilterModalClose}
        onApplyFilters={handleApplyFilters}
        initialCriteria={activeFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FCFCFC",
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCFCFC",
  },
  sort: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ptdBox: {
    marginVertical: 30,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1.5,
  },
  loadMoreButton: {
    alignItems: "center",
    marginVertical: 20,
    padding: 10,
    borderRadius: 8,
    width: "100%",
    marginBottom: 30,
  },
  loadMoreText: {
    color: "#409CF0",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PTDScreen;
