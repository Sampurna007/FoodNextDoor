// app/Authentication/FoodReceiverProfile.js

import { MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../../utils/firebase';

const FoodReceiverProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setError('User data not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log('User signed out!');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar
          rounded
          size="large"
          title={userData?.firstName ? userData.firstName.charAt(0).toUpperCase() : 'S'}
          containerStyle={{ backgroundColor: '#00C853' }}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.userName}>
            {userData.firstName} {userData.lastName}
          </Text>
          <Text style={styles.userRole}>
            <MaterialIcons name="fastfood" size={16} color="#888" /> Food Receiver
          </Text>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Info</Text>

        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={24} color="#888" />
          <Text style={styles.infoText}>{userData.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={24} color="#888" />
          <Text style={styles.infoText}>{userData.firstName} {userData.lastName}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={24} color="#888" />
          <Text style={styles.infoText}>{userData.phone || 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={24} color="#888" />
          <Text style={styles.infoText}>{userData.address || 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="warning" size={24} color="#888" />
          <Text style={styles.infoText}>{userData.allergen || 'N/A'}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userData.itemsReceived || 0}</Text>
            <Text style={styles.statLabel}>Items Received</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userData.rating || 0}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userData.peopleHelped || 0}</Text>
            <Text style={styles.statLabel}>People Helped</Text>
          </View>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={20} color="red" />
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8'
 },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
 },

  header: { 
    flexDirection: 'row',
     alignItems: 'center', 
     padding: 20, 
     backgroundColor: '#fff', 
     borderBottomWidth: 1, 
     borderBottomColor: '#eee' },

  headerTextContainer: { 
    marginLeft: 15,
     flex: 1 },

  userName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333' }
    ,
  userRole: {
     fontSize: 14, 
     color: '#888', 
     marginTop: 3 },

  section: { 
    backgroundColor: '#fff',
     marginTop: 10, 
     paddingVertical: 15, 
     paddingHorizontal: 20, 
     borderBottomWidth: 1, 
     borderBottomColor: '#eee' },

  sectionTitle: {
     fontSize: 18, 
     fontWeight: 'bold', 
     marginBottom: 15, 
     color: '#333' },

  infoRow: {
     flexDirection: 'row',
      alignItems: 'center',
       marginBottom: 10 },

  infoText: { 
    marginLeft: 15, 
    fontSize: 16, 
    color: '#555' },

  statsContainer: {
     flexDirection: 'row',
      justifyContent: 'space-around',
       marginTop: 10 },

  statBox: {
     alignItems: 'center', 
     backgroundColor: '#f9f9f9', 
     padding: 15,
      borderRadius: 10,
      width: '30%' },

  statNumber: { 
    fontSize: 20, 
    fontWeight: 'bold',
     color: '#00C853' },

  statLabel: { 
    fontSize: 14, 
    color: '#777',
     marginTop: 5, 
     textAlign: 'center' },

  signOutButton: { 
    flexDirection: 'row',
     alignItems: 'center', 
     justifyContent: 'center',
      backgroundColor: '#fff',
       marginTop: 20, 
       paddingVertical: 15, 
       marginHorizontal: 20,
        borderRadius: 10, 
        borderColor: '#ffdddd',
         borderWidth: 1 },

  signOutButtonText: {
     marginLeft: 10, 
     fontSize: 16,
      color: 'red', 
      fontWeight: 'bold' },
});

export default FoodReceiverProfile;
