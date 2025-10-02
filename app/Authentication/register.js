// app/Authentication/Register.js

// Import necessary hooks and Firebase functions
import { useRouter } from "expo-router"; // Navigation
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Auth
import { doc, setDoc } from "firebase/firestore"; // Firestore
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../utils/firebase"; // Firebase config

// Main Register component
export default function Register() {
  const router = useRouter();

  // --- State variables ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Food Receiver"); // default role

  // --- Handle registration ---
  const handleRegister = async () => {
    // Step 1: Validate inputs
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // Step 2: Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

       await sendEmailVerification(user);  // 
         Alert.alert(
        "Verify Your Email",
        "We sent a verification link to your email. Please verify before logging in."
      );

      // Step 3: Save basic user info in Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        role, // Food Receiver or Food Donor
        profileCompleted: false, // will complete profile later
        createdAt: new Date(),
      });
      console.log("Firestore user doc created");

      Alert.alert("Success", "Account created successfully!");

      // Step 4: Redirect based on role
      if (role === "Food Receiver") {
        router.replace("/Authentication/ProfileForm");
      } else if (role === "Food Donor") {
        router.replace("/Authentication/DonorForm");
      }
    } catch (error) {
      console.log("Registration Error:", error.code, error.message);
      Alert.alert("Registration Failed", error.message);
    }
  };

  // --- UI for Register screen ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the FoodNextDoor community</Text>

      {/* Role Selector */}
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

      {/* Email / Password Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2e7d32",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  roleContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#388e3c",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  roleButtonSelected: {
    backgroundColor: "#388e3c",
  },
  roleText: {
    fontWeight: "bold",
    color: "#388e3c",
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});