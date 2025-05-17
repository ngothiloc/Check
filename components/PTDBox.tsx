import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Line } from "react-native-svg";
import { PTDItem } from "../types/ptd";

interface PTDBoxProps extends PTDItem {}

const PTDBox = ({
  image,
  deviceName,
  status,
  companyName,
  model,
  serial,
  staffImages,
  date,
  requirement,
  receiveStatus,
  returnStatus,
  bbdStatus,
  certificateNumber,
  sealNumber,
}: PTDBoxProps) => {
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/(ptd)/[id]",
          params: {
            id: deviceName, // Adding required 'id' parameter
            deviceData: JSON.stringify({
              image,
              deviceName,
              status,
              companyName,
              model,
              serial,
              staffImages,
              date,
              requirement,
              receiveStatus,
              returnStatus,
              bbdStatus,
              certificateNumber,
              sealNumber,
            }),
          },
        })
      }
    >
      <View style={styles.title}>
        <Image source={{ uri: image }} style={styles.image} />
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 10,
            marginLeft: 20,
          }}
        >
          <Text style={styles.deviceName}>{deviceName}</Text>
          <View
            style={[
              styles.status,
              {
                backgroundColor:
                  status === "Hiệu lực"
                    ? "#4CAF50"
                    : status === "Hết hiệu lực"
                    ? "#F44336"
                    : status === "Sắp hết hiệu lực"
                    ? "#FFC107"
                    : status === "Huỷ bỏ"
                    ? "#9E9E9E"
                    : status === "Chờ cấp mới"
                    ? "#2196F3"
                    : "#757575",
              },
            ]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.infor}>
          <Text style={styles.text}> Cơ sở sản xuất: </Text>
          <Text style={styles.text}> {companyName} </Text>
        </View>
        <View style={styles.infor}>
          <Text style={styles.text}> Model: </Text>
          <Text style={styles.text}> {model} </Text>
        </View>
        <View style={styles.infor}>
          <Text style={styles.text}> Serial: </Text>
          <Text style={styles.text}> {serial} </Text>
        </View>
      </View>
      <Svg height="2" width="100%">
        <Line
          x1="0"
          y1="1"
          x2="100%"
          y2="1"
          stroke="#409CF0"
          strokeWidth="1.5"
          strokeDasharray="3,7"
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.bottom}>
        <View style={styles.staff}>
          <Text style={styles.textBottom}>Nhân viên:</Text>
          <View style={{ justifyContent: "center" }}>
            {staffImages.map((image, index) => (
              <Image
                key={index}
                source={image}
                style={[
                  styles.imageStaff,
                  { left: index * 15, zIndex: staffImages.length - index },
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.date}>
          <MaterialCommunityIcons name="calendar" size={20} color="#656565" />
          <Text style={styles.textBottom}>{date}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 20,
    backgroundColor: "white",
    padding: 20,
    borderWidth: 1,
    borderColor: "#409CF0",
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    flexDirection: "row",
  },
  deviceName: {
    textAlign: "left",
    fontSize: 14,
    fontWeight: 500,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  content: {
    flexDirection: "column",
    gap: 10,
  },
  infor: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  text: {
    maxWidth: "60%",
    flexWrap: "wrap",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  staff: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  date: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  textBottom: {
    color: "#656565",
  },
  imageStaff: {
    width: 20,
    height: 20,
    borderRadius: 30,
    position: "absolute",
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default PTDBox;
