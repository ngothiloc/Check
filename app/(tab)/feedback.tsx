import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// 3 màn hình con
function ConfirmingScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Đang xác nhận</Text>
    </View>
  );
}
function ProcessingScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Đang xử lý</Text>
    </View>
  );
}
function CompletedScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Đã hoàn thành</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function Feedback() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarIndicatorStyle: { backgroundColor: "#409CF0" },
        tabBarActiveTintColor: "#409CF0",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: { backgroundColor: "#fff" },
      }}
    >
      <Tab.Screen name="Đang xác nhận" component={ConfirmingScreen} />
      <Tab.Screen name="Đang xử lý" component={ProcessingScreen} />
      <Tab.Screen name="Đã hoàn thành" component={CompletedScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#409CF0",
    fontWeight: "600",
  },
});
