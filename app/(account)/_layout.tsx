import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="userInfo" options={{ headerShown: false }} />
      <Stack.Screen name="userCompany" options={{ headerShown: false }} />
      <Stack.Screen name="security" options={{ headerShown: false }} />
      <Stack.Screen name="setting" options={{ headerShown: false }} />
      <Stack.Screen
        name="(edit)/editUserInfo"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(edit)/editCompanyInfo"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
