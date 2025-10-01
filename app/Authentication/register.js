import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { auth, db } from "../../utils/firebase";

export default function Register() {
  const [role, setRole] = useState("Find Food");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email: email,
        role: role,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the FoodNextDoor community</Text>

      {/* role buttons, inputs, etc. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 8, color: "#2e7d32" },
  subtitle: { fontSize: 16, marginBottom: 24, color: "#555" },
});
