// Import necessary hooks and components
import { useState } from "react"; // React hook to manage state
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"; // UI components
import { db, auth } from "../../utils/firebase"; // Firebase configuration (auth and Firestore)
import { useRouter } from "expo-router"; // Navigation hook from Expo Router
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Time picker modal component
import dayjs from "dayjs"; // Library to format dates and times

// Main component for the Donor registration form
export default function DonorForm({ uid }) {
    // state variables to store the input by users
  const [businessType, setBusinessType] = useState(""); // restaurant, cafe, etc.
  const [abn, setAbn] = useState(""); // asutralian business number
  const [contactNo, setContactNo] = useState(""); // contact of the business
  const [address, setAddress] = useState(""); // address of the vendor
  const [openTime, setOpenTime] = useState(null); // opening time of the store
  const [closeTime, setCloseTime] = useState(null); //closing time of the store 
  const [isOpenPickerVisible, setOpenPickerVisible] = useState(false); // controls 
  const [isClosePickerVisible, setClosePickerVisible] = useState(false); //controls 

  const router = useRouter();

    // Function to handle form submission
  const handleSubmit = async () => {
        // Step 1: Validate that all fields are filled
    if (!businessType || !abn || !contactNo || !address || !openTime || !closeTime) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
      // Step 2: Save donor info to Firestore
    try {
      await db.collection("donors").doc(uid).set({
        businessType,
        abn,
        contactNo,
        address,
        openingHours: `${dayjs(openTime).format("HH:mm")} - ${dayjs(closeTime).format("HH:mm")}`,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Donor profile saved!");
      router.replace("/Authentication/ProfileScreen"); // redirect to home or dashboard
    } catch (error) {
      console.log("DonorForm Error:", error);
      Alert.alert("Error", error.message);
    }
  };
  // UI layout for the donor form
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donor Information</Text>

      <TextInput
        style={styles.input}
        placeholder="Type of Business (Restaurant, Cafe, etc.)"
        value={businessType}
        onChangeText={setBusinessType}
      />
      <TextInput
        style={styles.input}
        placeholder="ABN Number"
        value={abn}
        onChangeText={setAbn}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNo}
        onChangeText={setContactNo}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setOpenPickerVisible(true)}
      >
        <Text style={styles.timeText}>
          {openTime ? `Open: ${dayjs(openTime).format("HH:mm")}` : "Select Opening Time"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setClosePickerVisible(true)}
      >
        <Text style={styles.timeText}>
          {closeTime ? `Close: ${dayjs(closeTime).format("HH:mm")}` : "Select Closing Time"}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isOpenPickerVisible}
        mode="time"
        onConfirm={(time) => {
          setOpenTime(time);
          setOpenPickerVisible(false);
        }}
        onCancel={() => setOpenPickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={isClosePickerVisible}
        mode="time"
        onConfirm={(time) => {
          setCloseTime(time);
          setClosePickerVisible(false);
        }}
        onCancel={() => setClosePickerVisible(false)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Donor Info</Text>
      </TouchableOpacity>
    </View>
  );
}
// Styling for the donor form screen
const styles = StyleSheet.create({

  container: {
     flex: 1, 
     padding: 24, 
     backgroundColor: "#fff" 
    },

  title: {
     fontSize: 24, 
     fontWeight: "bold", 
     marginBottom: 20, 
     color: "#2e7d32" 
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

  timeButton: {
    borderWidth: 1,
    borderColor: "#388e3c",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },

  timeText: { 
    color: "#388e3c",
     fontWeight: "bold"
     },
});
