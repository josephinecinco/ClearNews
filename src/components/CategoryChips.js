import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const CATEGORY_COLORS = {
  local: "#D32F2F",
  weather: "#1976D2",
  government: "#AF8F00",
  health: "#000000",
};

export default function CategoryChips({ categories, onSelect }) {
  const [selected, setSelected] = useState(categories[0]);

  const handlePress = (cat) => {
    setSelected(cat);
    onSelect(cat);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 6,
      }}
    >
      {categories.map((cat) => {
        const color = CATEGORY_COLORS[cat.toLowerCase()] || "#333";
        const isSelected = selected === cat;

        return (
          <TouchableOpacity
            key={cat}
            onPress={() => handlePress(cat)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              marginRight: 8,
              borderRadius: 700,
              borderWidth: 2,
              borderColor: color,
              backgroundColor: isSelected ? color : "#fff",
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 12,
                color: isSelected ? "#fff" : color,
              }}
            >
              {cat.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
