import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { WebView } from "react-native-webview";
import Overlay from "../../components/Overlay";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCAN_BOX_SIZE = 200;
const HISTORY_STORAGE_KEY = "@qr_scan_history";

interface HistoryItem {
  url: string;
  timestamp: number;
}

export default function App() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedLinks, setScannedLinks] = useState<{ [key: string]: number }>(
    {}
  );
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Ứng dụng chưa có quyền truy cập camera.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleFlash() {
    setFlash((current) => !current);
  }

  // Function to handle picking image from library
  const pickImage = async () => {
    // TODO: Implement image picking logic here
    console.log("Pick image button pressed");
  };

  // Function to navigate to scan history
  const goToScanHistory = () => {
    router.push("/(scanqr)/history");
  };

  // Function to save a link to history
  const saveToHistory = async (url: string) => {
    try {
      // Read existing history
      const existingHistoryJson = await AsyncStorage.getItem(
        HISTORY_STORAGE_KEY
      );
      const existingHistory: HistoryItem[] = existingHistoryJson
        ? JSON.parse(existingHistoryJson)
        : [];

      // Add the new item
      const newItem: HistoryItem = { url, timestamp: Date.now() };
      // Optional: Check if the last scanned item is the same to avoid duplicates if needed
      // if (existingHistory.length === 0 || existingHistory[existingHistory.length - 1].url !== url) {
      existingHistory.push(newItem);
      // }

      // Save the updated history (limit size if necessary, e.g., last 100 items)
      await AsyncStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(existingHistory)
      );
      console.log("Link saved to history:", url);
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  // Updated handleBarCodeScanned logic
  const handleBarCodeScanned = (event: { data: string; bounds?: any }) => {
    // Only process scan if ActionSheet is not visible
    if (activeLink) {
      // If activeLink is set, ActionSheet is visible
      return; // Do not scan if ActionSheet is open
    }

    // Check if the scanned code is within the defined scan box area
    if (event.bounds) {
      const { origin, size } = event.bounds;
      const qrCenterX = origin.x + size.width / 2;
      const qrCenterY = origin.y + size.height / 2;

      const scanBoxX = (SCREEN_WIDTH - SCAN_BOX_SIZE) / 2;
      const scanBoxY = (SCREEN_HEIGHT - SCAN_BOX_SIZE) / 2;

      if (
        qrCenterX >= scanBoxX &&
        qrCenterX <= scanBoxX + SCAN_BOX_SIZE &&
        qrCenterY >= scanBoxY &&
        qrCenterY <= scanBoxY + SCAN_BOX_SIZE
      ) {
        // const now = Date.now(); // Not needed for debounce anymore
        if (
          event.data.startsWith("http://") ||
          event.data.startsWith("https://")
        ) {
          setActiveLink(event.data);
          actionSheetRef.current?.show(); // Show ActionSheet
          saveToHistory(event.data); // Save the scanned link to history
          // setScannedLinks((prev) => ({ ...prev, [event.data]: now })); // Not needed for debounce anymore
        }
      }
    } else {
      // Handle case where bounds is not defined (e.g., from image picker later)
      // const now = Date.now(); // Not needed for debounce anymore
      if (
        event.data.startsWith("http://") ||
        event.data.startsWith("https://")
      ) {
        setActiveLink(event.data);
        actionSheetRef.current?.show(); // Show ActionSheet
        saveToHistory(event.data); // Save the scanned link to history
        // setScannedLinks((prev) => ({ ...prev, [event.data]: now })); // Not needed for debounce anymore
      }
    }
  };

  // Function to close the bottom sheet
  const closeBottomSheet = () => {
    actionSheetRef.current?.hide();
    setActiveLink(null); // Set activeLink to null to re-enable scanning
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="chevron-left" size={35} color="white" />
      </TouchableOpacity>

      <View style={styles.warning}>
        <Text style={{ color: "white" }}>
          Vui lòng để mã QRcode trong khung hình
        </Text>
      </View>

      <View style={styles.topRightButtons}>
        <TouchableOpacity style={styles.button} onPress={toggleFlash}>
          <MaterialCommunityIcons
            name={flash ? "flash" : "flash-off"}
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomLeftButtons}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <MaterialCommunityIcons name="image" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRightButtons}>
        <TouchableOpacity style={styles.button} onPress={goToScanHistory}>
          <MaterialCommunityIcons name="history" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={activeLink ? undefined : handleBarCodeScanned}
        enableTorch={flash}
      />
      <Overlay />

      <View style={styles.scanBox} />

      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled
        onClose={() => setActiveLink(null)}
      >
        {activeLink && (
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text numberOfLines={1} style={styles.sheetTitle}>
                {activeLink}
              </Text>
              <TouchableOpacity onPress={closeBottomSheet}>
                <Text style={styles.doneText}>Xong</Text>
              </TouchableOpacity>
            </View>
            <WebView source={{ uri: activeLink }} style={styles.webView} />
          </View>
        )}
      </ActionSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { width: "100%", height: "100%" },

  backButton: {
    position: "absolute",
    top: 60,
    left: 10,
    zIndex: 10,
    backgroundColor: "transparent",
    padding: 20,
  },

  warning: {
    position: "absolute",
    top: "33%",
    width: SCREEN_WIDTH * 1,
    alignItems: "center",
    zIndex: 10,
  },

  scanBox: {
    position: "absolute",
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    borderWidth: 4,
    borderColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    top: (SCREEN_HEIGHT - SCAN_BOX_SIZE) / 2,
    left: (SCREEN_WIDTH - SCAN_BOX_SIZE) / 2,
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  topRightButtons: {
    position: "absolute",
    top: 60,
    right: 10,
    zIndex: 10,
    backgroundColor: "transparent",
    padding: 20,
  },
  bottomLeftButtons: {
    position: "absolute",
    bottom: 60,
    left: 10,
    zIndex: 10,
    backgroundColor: "transparent",
    padding: 20,
  },
  bottomRightButtons: {
    position: "absolute",
    bottom: 60,
    right: 10,
    zIndex: 10,
    backgroundColor: "transparent",
    padding: 20,
  },

  sheetContainer: { height: SCREEN_HEIGHT * 0.85 },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  sheetTitle: { fontSize: 16, fontWeight: "bold", flex: 1 },
  doneText: { color: "blue", fontSize: 16 },
  webView: { flex: 1 },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  permissionButton: { backgroundColor: "blue", padding: 10, borderRadius: 5 },
  permissionButtonText: { color: "white", fontSize: 16 },
});
