import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../src/components/Header";

export default function RadioScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const RADIO_URL = "https://streaming.radio.co/s0a0b0c0d0/listen"; // replace with your station

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const togglePlay = async () => {
    try {
      if (!playing) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: RADIO_URL },
          { shouldPlay: true, volume },
        );
        setSound(newSound);
        setPlaying(true);
      } else {
        await sound?.stopAsync();
        await sound?.unloadAsync();
        setSound(null);
        setPlaying(false);
      }
    } catch (e) {
      console.log("Error playing radio:", e);
    }
  };

  const changeVolume = async (val: number) => {
    setVolume(val);
    if (sound) await sound.setVolumeAsync(val);
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>Radio Player</Text>

        <TouchableOpacity onPress={togglePlay} style={styles.button}>
          <Text style={styles.buttonText}>{playing ? "Stop" : "Play"}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Volume</Text>
        <Slider
          style={{ width: 250 }}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={changeVolume}
          minimumTrackTintColor="#1976D2"
          maximumTrackTintColor="#ccc"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333" },
  button: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  label: { fontSize: 16, color: "#333", marginTop: 10, marginBottom: 5 },
});
