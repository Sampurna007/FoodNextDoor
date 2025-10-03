// app/Authentication/Login.js

import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { auth } from "../../utils/firebase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please enter both email and password.");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!", [
        { text: "OK", onPress: () => router.replace("/Authentication/FoodReceiverProfile") },
      ]);
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return Alert.alert("Error", "Please enter your email to reset password.");
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", `A password reset email has been sent to ${email}`);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword} style={styles.link}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    justifyContent: "center",
     backgroundColor: "#fff" },

  title: {
     fontSize: 26, 
     fontWeight: "bold", 
     marginBottom: 16, 
     color: "#2e7d32",
      textAlign: "center" },

  input: {
     borderWidth: 1,
      borderColor: "#ccc",
       borderRadius: 8, 
       padding: 12,
        marginBottom: 16 },

  button: { 
    backgroundColor: "#388e3c",
     padding: 14, 
     borderRadius: 8,
      alignItems: "center", 
      marginVertical: 5 },

  buttonText: {
     color: "#fff",
      fontSize: 16, 
      fontWeight: "bold" },

  link: { 
    marginTop: 10,
     alignItems: "center" },

  linkText: { 
    color: "#388e3c", 
    fontSize: 14, 
    fontWeight: "600" },
});
