// app/Authentication/Login.js

// Import necessary hooks and components from React Native and Firebase
import { useRouter } from "expo-router"; // navigation between screens
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Firebase auth methods
import { useState } from "react"; // React hook to manage state
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"; // UI components
import { auth } from "../../utils/firebase"; // Firebase configuration (auth object)

// Main component for the Login screen
export default function Login() {
  // State variables to store user input
  const [email, setEmail] = useState(""); // Stores email input
  const [password, setPassword] = useState(""); // Stores password input
  const router = useRouter(); // Router for navigating between screens

  // --- Function to handle email/password login ---
  const handleLogin = async () => {
    // Step 1: Validate that both email and password are entered
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      // Step 2: Try signing in with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Step 3: If login succeeds, show success alert
      Alert.alert("Success", "Logged in successfully!");

      // Step 4: Redirect to Profile screen (replace current screen)
      router.replace("/Profile");
    } catch (error) {
      // Step 5: If login fails, show error message
      Alert.alert("Login Failed", error.message);
    }
  };

  // --- Function to handle password reset ---
  const handleForgotPassword = async () => {
    // Step 1: Make sure the user entered their email
    if (!email) {
      Alert.alert("Error", "Please enter your email to reset password.");
      return;
    }

    try {
      // Step 2: Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email);

      // Step 3: Inform the user that the reset email was sent
      Alert.alert(
        "Password Reset",
        "A password reset email has been sent to " + email
      );
    } catch (error) {
      // Step 4: Handle errors (e.g., email not registered)
      Alert.alert("Error", error.message);
    }
  };

  // --- UI layout for the Login screen ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Sign In button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Forgot Password link */}
      <TouchableOpacity onPress={handleForgotPassword} style={styles.link}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Styles for the Login screen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2e7d32",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#388e3c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#388e3c",
    fontSize: 14,
    fontWeight: "600",
  },
});
