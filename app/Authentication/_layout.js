import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="Login" options={{ title: "Sign In" }} />
      <Stack.Screen name="Register" options={{ title: "Register" }} />
    </Stack>
  );
}
