// app/_layout.js
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#388e3c" }, // Green header
        headerTintColor: "#fff", // Text + back button color
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Welcome" }} />
      <Stack.Screen name="Authentication/Register" options={{ title: "Register" }} />
      <Stack.Screen name="Authentication/Login" options={{ title: "Login" }} />
      <Stack.Screen name="Authentication/ReceiverForm" options={{ title: "Complete Profile" }} />
      <Stack.Screen name="Authentication/DonorForm" options={{ title: "Business Details" }} />
      <Stack.Screen name="Profile" options={{ title: "My Profile" }} />
    </Stack>
  );
}
