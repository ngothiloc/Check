import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tab)" options={{ headerShown: false }} />
      <Stack.Screen name="(news)/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(ptd)/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
