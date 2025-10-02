import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { db, auth } from "../../utils/firebase";
import { useRouter } from "expo-router";

export default function DonorForm() {
  const router = useRouter();
  const uid = auth.currentUser?.uid;

  const [businessType, setBusinessType] = useState(""); // e.g., Restaurant, Cafe, Catering
  const [abn, setAbn] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [openingHours, setOpeningHours] = useState("");

  const handleSave = async () => {
    if (!businessType || !abn || !contact || !address || !openingHours) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    try {
      // Save donor profile info
      await setDoc(
        doc(db, "users", uid),
        {
          businessType,
          abn,
          contact,
          address,
          openingHours,
          profileCompleted: true,
        },
        { merge: true } // merge with existing user document
      );

      Alert.alert("Success", "Donor profile saved successfully!");
      router.replace("/(tabs)"); // redirect to home/tabs
    } catch (error) {
      console.log("DonorForm Error:", error.message);
      Alert.alert("Error", "Failed to save profile. " + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Donor Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Type of Food Business (Restaurant, Cafe, Catering)"
        value={businessType}
        onChangeText={setBusinessType}
      />
      <TextInput
        style={styles.input}
        placeholder="ABN Number"
        value={abn}
        onChangeText={setAbn}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Opening Hours"
        value={openingHours}
        onChangeText={setOpeningHours}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Donor Profile</Text>
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
