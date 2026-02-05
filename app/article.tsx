import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import ZoomControls from "../src/components/ZoomControls";

export default function ArticleScreen() {
  const { article } = useLocalSearchParams<{ article?: string }>();
  const router = useRouter();
  const webviewRef = useRef<WebView>(null);
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
  const [ttsSpeaking, setTtsSpeaking] = useState(false);

  if (!article) return <Text>No article data.</Text>;

  let parsedArticle;
  try {
    parsedArticle = JSON.parse(article);
  } catch {
    return <Text>Invalid article data.</Text>;
  }

  const generateInjectedJS = () => {
    const bgColor = darkMode ? "#121212" : "#ffffff";
    const textColor = darkMode ? "#ffffff" : "#000000";

    return `
      (function() {
        const oldStyle = document.getElementById('darkmode-style');
        if(oldStyle) oldStyle.remove();
        const style = document.createElement('style');
        style.id = 'darkmode-style';
        style.innerHTML = \`
          body, p, span, div, h1, h2, h3, h4, h5, h6, li, a, td {
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
            font-size: ${fontSize}px !important;
          }
          img, iframe, video {
            filter: ${darkMode ? "brightness(0.8)" : "none"} !important;
          }
        \`;
        document.head.appendChild(style);
      })();
      true;
    `;
  };

  useEffect(() => {
    webviewRef.current?.injectJavaScript(generateInjectedJS());
  }, [darkMode, fontSize]);

  const handleZoomIn = () => setFontSize((f) => Math.min(f + 2, 36));
  const handleZoomOut = () => setFontSize((f) => Math.max(f - 2, 14));

  // Text-to-Speech function (reads first 500 words)
  const handleSpeak = () => {
    if (ttsSpeaking) {
      Speech.stop();
      setTtsSpeaking(false);
      return;
    }

    const text =
      parsedArticle.content ||
      parsedArticle.body ||
      parsedArticle.title ||
      "No readable text available";

    if (!text || text.trim().length === 0) return;

    // Limit to first 500 words
    const words = text.trim().split(/\s+/);
    const limitedText = words.slice(0, 500).join(" ");

    setTtsSpeaking(true);
    Speech.speak(limitedText, {
      onDone: () => setTtsSpeaking(false),
      onStopped: () => setTtsSpeaking(false),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#fff" }}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: darkMode ? "#1E1E1E" : "#fff" },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Image
            source={require("../assets/images/back.png")}
            style={{
              width: 40,
              height: 40,
              tintColor: darkMode ? "#fff" : "#1976D2",
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, { color: darkMode ? "#fff" : "#000" }]}
          numberOfLines={1}
        >
          {parsedArticle.title}
        </Text>

        <TouchableOpacity
          onPress={() => setDarkMode((prev) => !prev)}
          style={styles.iconBtn}
        >
          <Image
            source={require("../assets/images/darkmode.png")}
            style={{
              width: 40,
              height: 40,
              tintColor: darkMode ? "#FFD700" : "#1976D2",
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        ref={webviewRef}
        source={{ uri: parsedArticle.url }}
        style={{ flex: 1 }}
        injectedJavaScriptBeforeContentLoaded={generateInjectedJS()}
      />

      {/* Zoom + TTS controls */}
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onSpeak={handleSpeak} // middle button now reliably triggers TTS
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  iconBtn: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 12,
  },
});
