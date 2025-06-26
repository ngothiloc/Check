import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tab)" options={{ headerShown: false }} />
      <Stack.Screen name="(news)/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(ptd)/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(scanqr)/history" options={{ headerShown: false }} />
      <Stack.Screen
        name="(noti)/notifications"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="(account)" options={{ headerShown: false }} />
      <Stack.Screen name="booking" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
