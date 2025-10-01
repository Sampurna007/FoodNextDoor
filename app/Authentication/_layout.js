// app/Authentication/_layout.js
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Login"
        options={{ title: "Sign In", headerShown: true }}
      />
      <Stack.Screen
        name="Register"
        options={{ title: "Create Account", headerShown: true }}
      />
    </Stack>
  );
}
