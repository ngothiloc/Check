import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { fetchPTDData } from "../../api/apiPTD";
import PTDBox from "../../components/PTDBox";
import { PTDItem } from "../../types/ptd";

const PTDScreen = () => {
  const router = useRouter();
  const [deviceData, setDeviceData] = useState<PTDItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPTDData();
        setDeviceData(data);
      } catch (error) {
        console.error("Error loading PTD data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // const handleSortChange = (option: string) => {
  //   const sorted = [...deviceData].sort((a, b) => {
  //     const [dayA, monthA, yearA] = a.date.split("/").map(Number);
  //     const [dayB, monthB, yearB] = b.date.split("/").map(Number);
  //     const dateA = new Date(yearA, monthA - 1, dayA);
  //     const dateB = new Date(yearB, monthB - 1, dayB);

  //     return option === "newest"
  //       ? dateB.getTime() - dateA.getTime()
  //       : dateA.getTime() - dateB.getTime();
  //   });

  //   setDeviceData(sorted);
  // };

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
        <Sort />
        <Filter />
      </View>
      <View style={styles.ptdBox}>
        <FlatList
          data={deviceData}
          renderItem={({ item }) => (
            <PTDBox
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
        />
      </View>
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
    marginTop: 20,
    shadowColor: "#409CF0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 1.5,
  },
});

export default PTDScreen;
