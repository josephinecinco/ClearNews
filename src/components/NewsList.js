// src/components/NewsList.js
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import NewsCard from "../../app/NewsCard";
import { fetchTopHeadlines } from "../config/newsApi";

export default function NewsList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      const data = await fetchTopHeadlines("us", "technology");
      setArticles(data);
      setLoading(false);
    };
    getNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <NewsCard
          title={item.title}
          description={item.description}
          imageUrl={item.urlToImage}
          article={item} // pass the full article for navigation
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
