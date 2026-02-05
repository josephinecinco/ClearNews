import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const API_KEY = "e55d9911204b04450aa8c913745929348";
const BASE_URL = "https://newsapi.org/v2";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchTopHeadlines = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
          params: {
            country: "us",
            category: "general",
            apiKey: API_KEY,
          },
        });
        setArticles(response.data.articles);
      } catch (error) {
        if (error.response) {
          setErrorMsg(
            `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
          );
        } else if (error.request) {
          setErrorMsg("No response received: " + error.request);
        } else {
          setErrorMsg("Axios error: " + error.message);
        }
      }
    };

    fetchTopHeadlines();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {errorMsg ? <Text style={{ color: "red" }}>{errorMsg}</Text> : null}
      {articles.map((a, i) => (
        <Text key={i}>{a.title}</Text>
      ))}
    </View>
  );
}
