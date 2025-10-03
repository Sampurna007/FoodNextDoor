// app/Authentication/Register.js

import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { auth, db } from "../../utils/firebase";

export default function Register() {
  const router = useRouter();

  // --- State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Food Receiver");
  const [loading, setLoading] = useState(false); // disable button while processing

  // --- Handle Registration ---
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill out all fields.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save minimal info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
        isBusiness: role === "Food Donor", // true if Donor, false if Receiver
        profileCompleted: false,
        createdAt: new Date(),
      });

      // Send verification email
      await sendEmailVerification(user);

      // Navigate to login only after alert is dismissed
      Alert.alert(
        "Verify Your Email",
        "We sent a verification link to your email. Please verify before logging in.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/Authentication/Login"),
          },
        ]
      );
    } catch (error) {
      console.log("Registration Error:", error.code, error.message);
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the FoodNextDoor community</Text>

      <Text style={styles.label}>I am a:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === "Food Receiver" && styles.roleButtonSelected]}
          onPress={() => setRole("Food Receiver")}
        >
          <Text style={[styles.roleText, role === "Food Receiver" && { color: "#fff" }]}>
            Food Receiver
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, role === "Food Donor" && styles.roleButtonSelected]}
          onPress={() => setRole("Food Donor")}
        >
          <Text style={[styles.roleText, role === "Food Donor" && { color: "#fff" }]}>
            Food Donor
          </Text>
        </TouchableOpacity>
      </View>

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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 8, color: "#2e7d32" },
  subtitle: { fontSize: 16, marginBottom: 16, color: "#555" },
  label: { fontSize: 16, marginBottom: 8, color: "#555" },
  roleContainer: { flexDirection: "row", marginBottom: 20 },
  roleButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: "#388e3c", borderRadius: 8, marginHorizontal: 5, alignItems: "center", backgroundColor: "#fff" },
  roleButtonSelected: { backgroundColor: "#388e3c" },
  roleText: { fontWeight: "bold", color: "#388e3c" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: "#388e3c", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
