import { doc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { db, auth } from "../../utils/firebase";
import { useRouter } from "expo-router";

export default function ProfileForm() {
  const router = useRouter();
  const uid = auth.currentUser?.uid;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [allergens, setAllergens] = useState("");

  const handleSave = async () => {
    if (!uid) return Alert.alert("Error", "User not logged in.");

    if (!firstName || !lastName || !username || !address || !phone) {
      return Alert.alert("Error", "Please fill out all required fields.");
    }

    try {
      // Check if username already exists
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return Alert.alert("Error", "Username already taken. Please choose another.");
      }

      // Save profile
      await setDoc(
        doc(db, "users", uid),
        {
          firstName,
          lastName,
          username,
          address,
          phone,
          allergens,
          profileCompleted: true,
        }
      );

      Alert.alert("Success", "Profile saved successfully!");
      router.replace("/ProfileScreen"); // redirect to profile
    } catch (err) {
      console.log("ProfileForm Error:", err.message);
      Alert.alert("Error", "Failed to save profile. " + err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Allergens (optional)" value={allergens} onChangeText={setAllergens} />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 24, color: "#2e7d32", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: "#388e3c", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16 },
});
