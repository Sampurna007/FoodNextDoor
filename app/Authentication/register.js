// Import necessary Firebase functions and React Native components
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase function to create a new user
import { doc, setDoc } from "firebase/firestore"; // Firestore functions to save user data
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../utils/firebase";

// main Register component
export default function Register() {
  // variables to store user input
  const [email, setEmail] = useState(""); // stores the email entered by the user
  const [password, setPassword] = useState(""); // stores the password entered
  const [confirmPassword, setConfirmPassword] = useState(""); // stores the confirmation password
  const [role, setRole] = useState("Food Receiver"); // new registered role selected
  const router = useRouter(); // Used to navigate between screens

  // Function that handles registration when user presses the button
  const handleRegister = async () => {
    // Step 1: Check if all fields are filled
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    // Step 2: Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // Step 3: Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Step 4: Save user info in Firestore database
      await setDoc(doc(db, "users", uid), {
        email,
        role,     // Save selected role (Food Sharer or Food Donor)
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created successfully!");

      // Step 3: Redirect based on role
      if (role === "Food Receiver") {
        router.replace("/Authentication/ProfileForm"); // redirect Food Sharer extra details
      } else if (role === "Food Donor") {
        router.replace("/Authentication/DonorForm");   // redirect Food Donor extra details ie Type Address etc
      }

    } catch (error) {
      console.log("Registration Error:", error.message);
      Alert.alert("Registration Failed", error.message);
    }
  };

  // UI layout for the registration screen
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
            Food Sharer
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

// Styling for the Register screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2e7d32"
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555"
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555"
  },

  roleContainer: {
    flexDirection: "row",
    marginBottom: 20
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
    marginBottom: 16
  },

  button: {
    backgroundColor: "#388e3c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontSize: 16
  },

});
