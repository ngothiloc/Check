import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fetchPTDData } from "../../api/apiPTD";
import { fetchFullUserData } from "../../api/user";
import FilterModal from "../../app/(ptd)/filter";
import FilterComponent from "../../components/Filter";
import PTDBox from "../../components/PTDBox";
import Sort from "../../components/Sort";
import { PTDItem } from "../../types/ptd";
import { BasicUserData } from "../../types/user";

const PTDScreen = () => {
  const router = useRouter();
  const [deviceData, setDeviceData] = useState<PTDItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState<PTDItem[]>([]); // Store original data
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({}); // Store active filter criteria
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Wrap loadData in useCallback to make it stable
  const loadData = useCallback(async () => {
    try {
      const data = await fetchPTDData();
      setDeviceData(data);
      setOriginalData(data); // Save original data
      setError(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error loading PTD data:", error);
      setError(true);
      setErrorMessage("Không thể tải dữ liệu PTD. Vui lòng thử lại sau.");
      setDeviceData([]); // Clear data on error
      setOriginalData([]); // Clear original data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // Empty dependency array means this function is created only once

  // Use useFocusEffect to load data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();

      // Cleanup function (optional)
      return () => {
        // Any cleanup needed when the screen loses focus
      };
    }, [loadData]) // loadData is a dependency
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Get basic user data to access email
      const userDataStr = await AsyncStorage.getItem("userData");
      if (userDataStr) {
        const basicUserData: BasicUserData = JSON.parse(userDataStr);
        // Fetch full user data from server to update AsyncStorage
        await fetchFullUserData(basicUserData.email);
        // Load updated data from AsyncStorage
        await loadData();
      } else {
        console.warn(
          "Cannot refresh: No basic user data found in AsyncStorage."
        );
        // Optionally redirect to login or show an error
        setRefreshing(false);
      }
    } catch (error) {
      console.error("Error during refresh:", error);
      setRefreshing(false);
      // Optionally show an error message on the UI
    }
  }, [loadData]);

  useEffect(() => {
    // Apply filters whenever activeFilters or originalData changes
    applyFilters();
  }, [activeFilters, originalData]);

  const applyFilters = () => {
    let filteredData = [...originalData];

    // Apply deviceName filter (case-insensitive, contains)
    if (activeFilters.deviceName) {
      filteredData = filteredData.filter((item) =>
        item.deviceName
          .toLowerCase()
          .includes(activeFilters.deviceName.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilters.status) {
      filteredData = filteredData.filter(
        (item) => item.status === activeFilters.status
      );
    }

    // Apply companyName filter (contains)
    if (activeFilters.companyName) {
      filteredData = filteredData.filter((item) =>
        item.companyName
          .toLowerCase()
          .includes(activeFilters.companyName.toLowerCase())
      );
    }

    // Apply model filter (contains)
    if (activeFilters.model) {
      filteredData = filteredData.filter((item) =>
        item.model.toLowerCase().includes(activeFilters.model.toLowerCase())
      );
    }

    // Apply serial filter (exact match)
    if (activeFilters.serial) {
      filteredData = filteredData.filter(
        (item) => item.serial === activeFilters.serial
      );
    }

    // Apply date range filter
    if (activeFilters.dateFrom && activeFilters.dateTo) {
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.date.split("/").map(Number);
        const itemDate = new Date(year, month - 1, day);
        return (
          itemDate >= activeFilters.dateFrom && itemDate <= activeFilters.dateTo
        );
      });
    } else if (activeFilters.dateFrom) {
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.date.split("/").map(Number);
        const itemDate = new Date(year, month - 1, day);
        return itemDate >= activeFilters.dateFrom;
      });
    } else if (activeFilters.dateTo) {
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.date.split("/").map(Number);
        const itemDate = new Date(year, month - 1, day);
        return itemDate <= activeFilters.dateTo;
      });
    }

    // Apply requirement filter
    if (activeFilters.requirement) {
      filteredData = filteredData.filter(
        (item) => item.requirement === activeFilters.requirement
      );
    }

    // Apply receiveStatus filter
    if (activeFilters.receiveStatus) {
      filteredData = filteredData.filter(
        (item) => item.receiveStatus === activeFilters.receiveStatus
      );
    }

    // Apply returnStatus filter
    if (activeFilters.returnStatus) {
      filteredData = filteredData.filter(
        (item) => item.returnStatus === activeFilters.returnStatus
      );
    }

    // Apply bbdStatus filter
    if (activeFilters.bbdStatus) {
      filteredData = filteredData.filter(
        (item) => item.bbdStatus === activeFilters.bbdStatus
      );
    }

    // Apply certificateNumber filter (contains)
    if (activeFilters.certificateNumber) {
      filteredData = filteredData.filter((item) =>
        item.certificateNumber
          .toLowerCase()
          .includes(activeFilters.certificateNumber.toLowerCase())
      );
    }

    // Apply sealNumber filter (contains)
    if (activeFilters.sealNumber) {
      filteredData = filteredData.filter((item) =>
        item.sealNumber
          .toLowerCase()
          .includes(activeFilters.sealNumber.toLowerCase())
      );
    }

    setDeviceData(filteredData);
  };

  const handleSortChange = (option: "newest" | "oldest" | null) => {
    if (!originalData) return; // Ensure originalData is loaded before sorting

    if (!option) {
      // Reset to filtered data if no sort option is selected (maintain current filters)
      applyFilters(); // Re-apply filters without sorting
      return;
    }

    const sorted = [...deviceData].sort((a, b) => {
      // Xử lý trực tiếp định dạng YYYY-MM-DD từ API
      const dateA = new Date(a.date); // a.date có định dạng "YYYY-MM-DD"
      const dateB = new Date(b.date); // b.date có định dạng "YYYY-MM-DD"

      return option === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    setDeviceData(sorted);
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true); // Open the filter modal
  };

  const handleFilterModalClose = () => {
    setFilterModalVisible(false);
  };

  const handleApplyFilters = (criteria: any) => {
    setActiveFilters(criteria);
    setFilterModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#409CF0" />
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
                staffImages={item.staffImages}
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
                // title="Đang tải lại..."
                // titleColor="#409CF0"
              />
            }
          />
        )}
      </View>

      {/* Filter Modal */}
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
    // shadowColor: "#409CF0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1.5,
  },
});

export default PTDScreen;
