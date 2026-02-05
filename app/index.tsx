import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CategoryChips from "../src/components/CategoryChips";
import Header from "../src/components/Header";
import SearchBar from "../src/components/SearchBar";
import ZoomControls from "../src/components/ZoomControls";
import NewsCard from "./NewsCard";

const API_KEY = "e9b82d2c81894251a7bb86e6087a9df3";
const COUNTRY = "ph";

export default function Index() {
  const router = useRouter();

  const [language, setLanguage] = useState<"en" | "tl" | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("general");
  const [errorMsg, setErrorMsg] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [search, setSearch] = useState("");
  const [brightness, setBrightness] = useState(1);

  const fetchNews = async (cat: string, lang: "en" | "tl") => {
    setLoading(true);
    setErrorMsg("");

    try {
      let response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          country: COUNTRY,
          category: cat,
          language: lang,
          apiKey: API_KEY,
        },
      });

      if (!response.data.articles?.length) {
        response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "Philippines",
            language: lang,
            sortBy: "publishedAt",
            apiKey: API_KEY,
          },
        });
      }

      setArticles(response.data.articles);
    } catch {
      setErrorMsg("Failed to load news");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (language) fetchNews(category, language);
  }, [category, language]);

  const filteredArticles = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const renderLanguageModal = () => (
    <Modal transparent animationType="fade" visible={language === null}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Choose your language</Text>

          <TouchableOpacity
            style={[styles.langBtn, { backgroundColor: "#1976D2" }]}
            onPress={() => setLanguage("en")}
          >
            <Text style={styles.langText}>English</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langBtn, { backgroundColor: "#D32F2F" }]}
            onPress={() => setLanguage("tl")}
          >
            <Text style={styles.langText}>Tagalog</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header onBrightnessChange={setBrightness} />
      {renderLanguageModal()}

      {language && (
        <>
          <SearchBar value={search} onChange={setSearch} />

          <CategoryChips
            categories={["general", "sports", "business", "technology"]}
            onSelect={setCategory}
          />

          {errorMsg ? (
            <Text style={{ color: "red", margin: 12 }}>{errorMsg}</Text>
          ) : loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 30 }} />
          ) : (
            <FlatList
              data={filteredArticles}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <NewsCard
                  article={item}
                  fontSize={fontSize}
                  onPress={() =>
                    router.push({
                      pathname: "/article",
                      params: {
                        article: JSON.stringify({
                          title: item.title,
                          url: item.url,
                          description: item.description,
                          image: item.urlToImage,
                        }),
                      },
                    })
                  }
                />
              )}
            />
          )}

          <ZoomControls
            onZoomIn={() => setFontSize((f) => Math.min(f + 2, 30))}
            onZoomOut={() => setFontSize((f) => Math.max(f - 2, 12))}
          />

          {/* brightness overlay */}
          <View
            pointerEvents="none"
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "black",
              opacity: 1 - brightness,
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  langBtn: {
    width: "70%",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  langText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
