import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#409CF0",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ptd"
        options={{
          title: "Phương tiện đo",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "gauge" : "gauge"}
              color={color}
              size={24}
            />
          ),
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerRightContainerStyle: {
            paddingRight: 20,
          },
          headerStyle: {
            height: 120,
          },
        }}
      />
      <Tabs.Screen
        name="scanqr"
        options={{
          title: "Button",
          tabBarStyle: { display: "none" },
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              color={color}
              size={24}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={() => router.push("/scanqr")}
              style={{
                position: "absolute",
                top: -20,
                left: "50%",
                transform: [{ translateX: -25 }],
                backgroundColor: "#308BFF",
                borderRadius: 50,
                padding: 15,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                color="white"
                size={30}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="feedback"
        options={{
          title: "Phản hồi",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              color={color}
              size={24}
            />
          ),
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerRightContainerStyle: {
            paddingRight: 20,
          },
          headerStyle: {
            height: 120,
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Hồ sơ",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
