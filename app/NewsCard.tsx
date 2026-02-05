import { Image, Text, TouchableOpacity } from "react-native";

interface NewsCardProps {
  article: any;
  onPress: () => void;
  fontSize: number;
}

export default function NewsCard({
  article,
  onPress,
  fontSize,
}: NewsCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2, // Android shadow
      }}
    >
      {/* Title */}
      <Text
        style={{ fontSize: fontSize + 4, fontWeight: "bold", marginBottom: 8 }}
      >
        {article.title}
      </Text>

      {/* Image */}
      {article.urlToImage && (
        <Image
          source={{ uri: article.urlToImage }}
          style={{ width: "100%", height: 200, borderRadius: 8 }}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
}
