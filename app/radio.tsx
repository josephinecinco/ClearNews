import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../src/components/Header";
import axios from "axios";

type Station = {
  name: string;
  url: string;
  country: string;
};

// Guaranteed working HTTPS streams
const GUARANTEED_STATIONS: Station[] = [
  { name: "BBC Radio 1", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one", country: "UK" },
  { name: "NPR", url: "https://nprdmp.stream.publicradio.org/npr", country: "USA" },
  { name: "Retro Cebu", url: "https://stream.rcfm.ph:8443/stream", country: "Philippines" },
  { name: "Radyo Pilipinas", url: "https://rpradio.gov.ph:8443/radio", country: "Philippines" },
];

// Replace with your actual news API key
const NEWS_API = "https://gnews.io/api/v4/top-headlines?token=YOUR_API_KEY&lang=en&country=ph";

export default function RadioScreen() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [news, setNews] = useState<any[]>([]);

  const currentStation = GUARANTEED_STATIONS[currentIndex];

  useEffect(() => {
    fetchNews();

    return () => {
      if (sound) {
        sound.stopAsync().catch(() => {});
        sound.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(NEWS_API);
      setNews(response.data.articles || []);
    } catch (e) {
      console.log("Failed to fetch news:", e);
    }
  };

  const playStation = async (station: Station) => {
    try {
      if (sound) {
        await sound.stopAsync().catch(() => {});
        await sound.unloadAsync().catch(() => {});
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: station.url },
        { shouldPlay: true, volume }
      );

      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          console.log("Playback failed for", station.name);
        }
      });
    } catch (e) {
      console.log("Error playing station:", e);
      Alert.alert(
        "Playback Error",
        `Cannot play "${station.name}". The stream may be down or unsupported.`
      );
    }
  };

  const stopStation = async () => {
    if (sound) {
      await sound.stopAsync().catch(() => {});
      await sound.unloadAsync().catch(() => {});
      setSound(null);
    }
  };

  const nextStation = () => {
    const nextIndex = (currentIndex + 1) % GUARANTEED_STATIONS.length;
    setCurrentIndex(nextIndex);
    playStation(GUARANTEED_STATIONS[nextIndex]);
  };

  const prevStation = () => {
    const prevIndex =
      (currentIndex - 1 + GUARANTEED_STATIONS.length) % GUARANTEED_STATIONS.length;
    setCurrentIndex(prevIndex);
    playStation(GUARANTEED_STATIONS[prevIndex]);
  };

  const changeVolume = async (val: number) => {
    setVolume(val);
    try {
      if (sound) await sound.setVolumeAsync(val);
    } catch (e) {
      console.log("Volume change failed:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={require("../assets/images/back.png")} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Radio Player</Text>

        {/* Radio Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn} onPress={prevStation}>
            <Image source={require("../assets/images/previous 1.png")} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={() => playStation(currentStation)}>
            <Image source={require("../assets/images/play 1.png")} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={stopStation}>
            <Image source={require("../assets/images/stop 1.png")} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={nextStation}>
            <Image source={require("../assets/images/next 1.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.stationName}>
          {currentStation.name} ({currentStation.country}) {sound ? "🔊" : ""}
        </Text>

        {/* Volume Slider */}
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

        {/* News Section */}
        <Text style={[styles.title, { marginTop: 20 }]}>News</Text>
        <ScrollView style={{ maxHeight: 200, width: "100%" }}>
          {news.map((article, idx) => (
            <View key={idx} style={styles.newsItem}>
              <Text style={styles.newsTitle}>{article.title}</Text>
              <Text style={styles.newsSource}>{article.source.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  backButton: {
    position: "absolute",
    top: 20,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  backIcon: { width: 24, height: 24, tintColor: "#1976D2" },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333" },
  controls: { flexDirection: "row", marginVertical: 20 },
  controlBtn: {
    padding: 12,
    marginHorizontal: 10,
    backgroundColor: "#d3d02a",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { width: 32, height: 32, resizeMode: "contain" },
  stationName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  label: { fontSize: 16, color: "#333", marginTop: 10, marginBottom: 5 },
  newsItem: { marginVertical: 5, padding: 10, backgroundColor: "#eee", borderRadius: 8 },
  newsTitle: { fontWeight: "bold", color: "#1976D2" },
  newsSource: { fontSize: 12, color: "#555" },
});
