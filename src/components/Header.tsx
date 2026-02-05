import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../styles/theme";

interface HeaderProps {
  onBrightnessChange?: (value: number) => void;
}

export default function Header({ onBrightnessChange }: HeaderProps) {
  const [sliderVisible, setSliderVisible] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const router = useRouter();

  const toggleSlider = () => setSliderVisible(!sliderVisible);

  const handleValueChange = (value: number) => {
    setBrightness(value);
    onBrightnessChange?.(value);
  };

  const getFormattedDate = () => {
    return new Date()
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  };

  return (
    <>
      <View style={styles.container}>
        {/* Left radio icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("./radio")}
        >
          <Image
            source={require("../../assets/images/radio.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Center title + date */}
        <View style={styles.center}>
          <Text style={styles.title}>CLEARNEWS</Text>
          <Text style={styles.date}>{getFormattedDate()}</Text>
        </View>

        {/* Right lamp icon */}
        <TouchableOpacity style={styles.iconButton} onPress={toggleSlider}>
          <Image
            source={require("../../assets/images/lamp.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Floating brightness slider using Modal */}
      <Modal
        transparent
        visible={sliderVisible}
        animationType="fade"
        onRequestClose={toggleSlider}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sliderFloating}>
            <Text style={styles.sliderLabel}>Brightness</Text>
            <Slider
              style={{ width: 250 }}
              minimumValue={0}
              maximumValue={1}
              value={brightness}
              onValueChange={handleValueChange}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#888"
            />
            <TouchableOpacity onPress={toggleSlider} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.headerBg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  center: {
    alignItems: "center",
  },
  title: {
    fontSize: theme.fontSizes.xlarge,
    fontWeight: "900",
  },
  date: {
    color: theme.colors.accentRed,
    fontSize: theme.fontSizes.small,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
  sliderFloating: {
    width: 300,
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sliderLabel: {
    color: "#fff",
    marginBottom: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#1976D2",
    borderRadius: 10,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
