import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Overlay from "../../components/Overlay";

export default function App() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setFlash((current) => !current);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={flash}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Components positioned absolutely on top of the CameraView */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="chevron-left" size={35} color="white" />
      </TouchableOpacity>

      <Overlay />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <MaterialCommunityIcons name="camera-flip" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={toggleFlash}>
          <MaterialCommunityIcons
            name={flash ? "flash" : "flash-off"}
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute", // Position absolutely
    bottom: 0, // Adjust positioning as needed
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end", // May need adjustment based on buttonContainer positioning
    alignItems: "center",
    marginHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 10,
    zIndex: 10,
    backgroundColor: "transparent",
    padding: 20,
  },
});
