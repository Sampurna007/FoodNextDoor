import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../utils/firebase";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DonorForm({ uid }) {
  const [businessType, setBusinessType] = useState(""); // restaurant, cafe, etc.
  const [abn, setAbn] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [openingTime, setOpeningTime] = useState(new Date());
  const [closingTime, setClosingTime] = useState(new Date());
  const [showOpeningPicker, setShowOpeningPicker] = useState(false);
  const [showClosingPicker, setShowClosingPicker] = useState(false);

  const router = useRouter();

  const handleSave = async () => {
    if (!businessType || !abn || !contact || !address) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      await setDoc(doc(db, "users", uid), {
        businessType,
        abn,
        contact,
        address,
        openingHours: {
          openingTime: openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          closingTime: closingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        profileCompleted: true,
      }, { merge: true });

      Alert.alert("Success", "Profile saved successfully!");
      router.replace("/"); // Navigate to home or dashboard

    } catch (error) {
      console.log("Error saving donor info:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Donor Profile</Text>

      <Text style={styles.label}>Type of Food Business</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Restaurant, Cafe, Catering"
        value={businessType}
        onChangeText={setBusinessType}
      />

      <Text style={styles.label}>ABN Number</Text>
      <TextInput
        style={styles.input}
        placeholder="ABN"
        value={abn}
        onChangeText={setAbn}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      {/* Opening Time */}
      <Text style={styles.label}>Opening Time</Text>
      <TouchableOpacity onPress={() => setShowOpeningPicker(true)} style={styles.timeButton}>
        <Text style={styles.timeText}>
          {openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showOpeningPicker && (
        <DateTimePicker
          value={openingTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowOpeningPicker(false);
            if (selectedTime) setOpeningTime(selectedTime);
          }}
        />
      )}

      {/* Closing Time */}
      <Text style={styles.label}>Closing Time</Text>
      <TouchableOpacity onPress={() => setShowClosingPicker(true)} style={styles.timeButton}>
        <Text style={styles.timeText}>
          {closingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showClosingPicker && (
        <DateTimePicker
          value={closingTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowClosingPicker(false);
            if (selectedTime) setClosingTime(selectedTime);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 16, color: "#2e7d32" },
  label: { fontSize: 16, marginBottom: 8, color: "#555" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 },
  timeButton: {
    borderWidth: 1,
    borderColor: "#388e3c",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  timeText: { color: "#388e3c", fontWeight: "bold" },
  button: { backgroundColor: "#388e3c", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
});
