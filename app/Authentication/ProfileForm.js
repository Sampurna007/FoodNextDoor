// Import necessary hooks and components from React Native and Firebase
import { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { db, auth } from "../../utils/firebase"; // Firebase configuration
import { doc, getDoc, setDoc, query, collection, where, getDocs } from "firebase/firestore"; 
import { useRouter } from "expo-router";

// Main component for completing or editing user profile
export default function ProfileForm() {
  const router = useRouter();
  const uid = auth.currentUser?.uid; // Current logged-in user's UID

  // State variables to store user input
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [allergens, setAllergens] = useState("");

  // Fetch existing user data to pre-fill form if available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) return; // Exit if no user is logged in
      try {
        const docRef = doc(db, "users", uid);
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
        console.log("Error fetching user data:", error.message);
      }
    };
    fetchUserData();
  }, [uid]);

  // Function to save profile data to Firestore
  const handleSave = async () => {
    if (!uid) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    // Validate required fields
    if (!firstName || !lastName || !username || !address || !phone) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    try {
      // Check if the username is already taken by another user
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // If there's a username match that isn't the current user
        const usernameTakenByOther = querySnapshot.docs.some(docSnap => docSnap.id !== uid);
        if (usernameTakenByOther) {
          Alert.alert("Error", "Username already taken. Please choose another.");
          return;
        }
      }

      // Save profile information to Firestore, merge with existing document
      await setDoc(
        doc(db, "users", uid),
        {
          firstName,
          lastName,
          username,
          address,
          phone,
          allergens,
          profileCompleted: true, // mark profile as complete
        },
        { merge: true }
      );

      Alert.alert("Success", "Profile saved successfully!");

      // Redirect depending on role
      const userDoc = await getDoc(doc(db, "users", uid));
      const role = userDoc.data()?.role;
      if (role === "Food Donor") {
        router.replace("/Authentication/DonorForm"); // Donor completes business info
      } else if (role === "Food Receiver") {
        router.replace("/(tabs)"); // Receiver redirected to main tabs/home
      } else {
        router.replace("/(tabs)");
      }

    } catch (error) {
      console.log("ProfileForm Error:", error.message);
      Alert.alert("Error", "Failed to save profile. " + error.message);
    }
  };

  // UI for the profile form
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

// Styling for the profile form screen
const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 24, 
    backgroundColor: "#fff" 
  },

  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 24, 
    color: "#2e7d32",
    textAlign: "center"
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16,
    color: "#000" // ensure text is visible
  },

  button: {
    backgroundColor: "#388e3c",
    padding: 14, 
    borderRadius: 8, 
    alignItems: "center",
    marginTop: 10 
  },

  buttonText: { 
    color: "#fff",
    fontSize: 16 
  },
});
