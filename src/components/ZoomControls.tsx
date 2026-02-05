import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface ZoomControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onSpeak?: () => void;
}

export default function ZoomControls({
  onZoomIn,
  onZoomOut,
  onSpeak,
}: ZoomControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#D32F2F" }]}
        onPress={onZoomOut}
      >
        <Image
          source={require("../../assets/images/minus.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FBC02D" }]}
        onPress={onSpeak}
      >
        <Image
          source={require("../../assets/images/speaker.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1976D2" }]}
        onPress={onZoomIn}
      >
        <Image
          source={require("../../assets/images/minus.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 350,
    backgroundColor: "transparent",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
