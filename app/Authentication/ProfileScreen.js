import { MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../../utils/firebase';

// Main ProfileScreen component
const ProfileScreen = () => {
   const [userData, setUserData] = useState(null); // Stores user data from Firestore
  const [loading, setLoading] = useState(true); // Controls loading spinner
  const [error, setError] = useState(''); // Stores error message if any

    // Fetch user data when the screen loads
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;   // Get currently logged-in user
            if (!user) {
                setError('No user logged in');
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'users', user.uid); // Reference to user's document
                const docSnap = await getDoc(docRef); // Fetch document
                if (docSnap.exists()) {
                    setUserData(docSnap.data()); // Save user data to state
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
  // Function to sign out the user
    const handleSignOut = async () => {
        try {
            await auth.signOut(); // Firebase sign out
            console.log('User signed out!');
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };
   // Show loading spinner while fetching data
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#00C853" />
                <Text>Loading profile...</Text>
            </View>
        );
    }
  // Show error message if something went wrong
    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }
  // Main profile layout
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
                        {userData.role === 'Food Sharer'
                            ? `${userData.firstName} ${userData.lastName}`
                            : userData.businessName}
                    </Text>
                    <Text style={styles.userRole}>
                        <MaterialIcons name="fastfood" size={16} color="#888" /> {userData.role}
                    </Text>
                </View>
            </View>

            {/* Info Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Info</Text>

                {/* Common */}
                <View style={styles.infoRow}>
                    <MaterialIcons name="email" size={24} color="#888" />
                    <Text style={styles.infoText}>{userData.email}</Text>
                </View>

                {userData.role === 'Food Sharer' ? (
                    <>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="person" size={24} color="#888" />
                            <Text style={styles.infoText}>{userData.username}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="phone" size={24} color="#888" />
                            <Text style={styles.infoText}>{userData.phone}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="location-on" size={24} color="#888" />
                            <Text style={styles.infoText}>{userData.address}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="warning" size={24} color="#888" />
                            <Text style={styles.infoText}>{userData.allergen}</Text>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="business" size={24} color="#888" />
                            <Text style={styles.infoText}>{userData.businessType}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="confirmation-number" size={24} color="#888" />
                            <Text style={styles.infoText}>{userData.abn}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="phone" size={24} color="#888" />
                            <Text style={styles.infoText}>{userData.contactNo}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="location-on" size={24} color="#888" />
                            <Text style={styles.infoText}>{userData.address}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="schedule" size={24} color="#888" />
                            <Text style={styles.infoText}>{userData.openingHours}</Text>
                        </View>
                    </>
                )}
            </View>

            {/* Stats Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stats</Text>
                <View style={styles.statsContainer}>
                    {userData.role === 'Food Sharer' ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{userData.itemsDonated || 0}</Text>
                                <Text style={styles.statLabel}>Items Donated</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{userData.ordersReceived || 0}</Text>
                                <Text style={styles.statLabel}>Orders Received</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{userData.rating || 0}</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>
                        </>
                    )}
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
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTextContainer: { marginLeft: 15, flex: 1 },
    userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    userRole: { fontSize: 14, color: '#888', marginTop: 3 },
    section: { backgroundColor: '#fff', marginTop: 10, paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoText: { marginLeft: 15, fontSize: 16, color: '#555' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    statBox: { alignItems: 'center', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, width: '30%' },
    statNumber: { fontSize: 20, fontWeight: 'bold', color: '#00C853' },
    statLabel: { fontSize: 14, color: '#777', marginTop: 5, textAlign: 'center' },
    signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginTop: 20, paddingVertical: 15, marginHorizontal: 20, borderRadius: 10, borderColor: '#ffdddd', borderWidth: 1 },
    signOutButtonText: { marginLeft: 10, fontSize: 16, color: 'red', fontWeight: 'bold' },
});

export default ProfileScreen;
