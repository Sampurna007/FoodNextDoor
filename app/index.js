import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GetStarted() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Welcome to FoodNextDoor</Text>
      <Text style={styles.subtitle}>
        Connect with your community to share food and reduce waste.
      </Text>

      <TouchableOpacity
        style={styles.buttonPrimary}
onPress={() => router.push("/Authentication/login")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => router.push("/Authentication/register")}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: { 
    flex: 1, 
    backgroundColor: "#e6f2e6",
     alignItems: "center", 
     justifyContent: "center", 
     padding: 20 },

  logo: { 
    width: 120,
     height: 120,
      marginBottom: 20 
    },

  title: { 
    fontSize: 22, 
    fontWeight: "bold",
     color: "#2e7d32", 
     marginBottom: 10 },

  subtitle: { 
    fontSize: 16, 
    textAlign: "center",
     marginBottom: 30, 
     color: "#4caf50" },

  buttonPrimary: {
     backgroundColor: "#388e3c",
      paddingVertical: 12, 
      paddingHorizontal: 40,
       borderRadius: 8, 
       marginBottom: 10 },

  buttonSecondary: { 
    backgroundColor: "#66bb6a", 
    paddingVertical: 12,
     paddingHorizontal: 40,
     borderRadius: 8, 
     marginBottom: 30 },

  buttonText: { 
    color: "#fff", 
    fontSize: 16 },
    
});
