import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hide headers for all screens
      }}
    >
      {/* Language selection screen as initial */}
      <Stack.Screen name="language" />

      {/* Main news list */}
      <Stack.Screen name="index" />

      {/* Individual article */}
      <Stack.Screen name="article" />
    </Stack>
  );
}
