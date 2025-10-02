import { doc, getDoc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { db, auth } from "../../utils/firebase";
import { useRouter } from "expo-router";

export default function ProfileForm() {
  const router = useRouter();
  const [uid, setUid] = useState(null); // store current user UID
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [allergens, setAllergens] = useState("");

  // --- Ensure auth.currentUser is loaded ---
  useEffect(() => {
    if (auth.currentUser) {
      setUid(auth.currentUser.uid);
      // Optionally pre-fill existing profile info
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
            setUsername(data.username || "");
            setAddress(data.address || "");
            setPhone(data.phone || "");
            setAllergens(data.allergens || "");
          }
        } catch (error) {
          console.log("Fetch Profile Error:", error.message);
        }
      };
      fetchProfile();
    } else {
      // if no user, redirect to login
      router.replace("/Authentication/Login");
    }
  }, []);

  // --- Save profile ---
  const handleSave = async () => {
    if (!firstName || !lastName || !username || !address || !phone) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    try {
      // Check if username already exists for other users
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const existsForOther = querySnapshot.docs.some(doc => doc.id !== uid);
        if (existsForOther) {
          Alert.alert("Error", "Username already taken. Please choose another.");
          return;
        }
      }

      // Save profile data
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
        },
        { merge: true }
      );

      Alert.alert("Success", "Profile saved successfully!");
      router.replace("/Authentication/ProfileScreen"); // redirect to home/tabs
    } catch (error) {
      console.log("ProfileForm Error:", error.message);
      Alert.alert("Error", "Failed to save profile. " + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Allergens (optional)"
        value={allergens}
        onChangeText={setAllergens}
      />

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
