import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSubmit?: (text: string) => void; // now optional
  recentSearches?: string[];
}

export default function SearchBar({ value, onChange, onSubmit = () => {}, recentSearches = [] }: Props) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [recent, setRecent] = useState<string[]>(recentSearches);

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Update recent searches, newest first, no duplicates
    setRecent((prev) => [trimmed, ...prev.filter((q) => q !== trimmed)]);
    setDropdownVisible(false);

    onSubmit(trimmed); // safely call even if not passed
    Keyboard.dismiss();
  };

  const handleFocus = () => setDropdownVisible(true);

  const handleBlur = () => {
    setTimeout(() => setDropdownVisible(false), 200); // delay so taps work
  };

  const handleRecentPress = (item: string) => {
    onChange(item);
    handleSubmit(item);
  };

  const handleRemove = (item: string) => {
    setRecent((prev) => prev.filter((q) => q !== item));
  };

  const handleClearAll = () => {
    setRecent([]);
  };

  return (
    <View style={{ marginHorizontal: 16 }}>
      <View style={styles.container}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search news"
          value={value}
          onChangeText={onChange}
          onSubmitEditing={() => handleSubmit(value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          placeholderTextColor="#999"
          returnKeyType="search"
        />
      </View>

      {dropdownVisible && recent.length > 0 && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={handleClearAll} style={styles.clearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>

          <FlatList
            data={recent}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.dropdownRow}>
                <TouchableOpacity onPress={() => handleRecentPress(item)} style={{ flex: 1 }}>
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleRemove(item)}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 4,
    maxHeight: 250,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
  clearAll: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  clearAllText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "bold",
  },
});
