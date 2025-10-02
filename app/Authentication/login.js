// importing necessary hooks and components from React Native and Firebase
import { useRouter } from "expo-router"; // used for navigation between screens
import { signInWithEmailAndPassword } from "firebase/auth"; // firebase method to login 
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../utils/firebase";

///the main Login component
export default function Login() {
  // variables to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    // Check if both email and password fields are filled
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      // trying to log in using Firebase with the email and password
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      router.replace("/Authentication/ProfileScreen"); // redirect to profile screen upon sucessfull login
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };
  //the UI part of the Login screen
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styling for the Login screen
const styles = StyleSheet.create({

  container: {
    flex: 1, padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16, color: "#2e7d32"
  },


  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8, padding: 12,
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
