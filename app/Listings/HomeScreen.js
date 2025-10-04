import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FoodCard from '../components/FoodCard';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('list');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Uncomment this to fetch from Firestore later
        // const listingsRef = collection(db, 'listings');
        // const q = query(listingsRef, orderBy('createdAt', 'desc'));
        // const snapshot = await getDocs(q);
        // const listingData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // setListings(listingData);

        // Temporary dummy card
        setListings([
          {
            id: 'dummy1',
            title: 'Test Food Item',
            description: 'This is a dummy food description.',
            distance: '0.5 miles',
            expiresIn: '2 hours',
            provider: 'Demo Provider',
            isFree: true,
            imageUrl: 'https://via.placeholder.com/150/FFC107/000000?text=🍲'
          }
        ]);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00C853" />
        <Text>Loading listings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Discover Food</Text>
          <Text style={styles.subtitle}>Find fresh food in your area</Text>

          {/* Search */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={24} color="#A0A0A0" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for food..."
                placeholderTextColor="#A0A0A0"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={24} color="#00C853" />
            </TouchableOpacity>
          </View>
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity
            style={[styles.viewToggleButton, activeView === 'list' && styles.activeViewButton]}
            onPress={() => setActiveView('list')}
          >
            <Text style={[styles.viewButtonText, activeView === 'list' && styles.activeViewText]}>
              List View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggleButton, activeView === 'map' && styles.activeViewButton]}
            onPress={() => setActiveView('map')}
          >
            <Text style={[styles.viewButtonText, activeView === 'map' && styles.activeViewText]}>
              Map View
            </Text>
          </TouchableOpacity>
        </View>

        {/* Food Listings */}
        {activeView === 'list' ? (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FoodCard food={item} />}
            scrollEnabled={false}
            contentContainerStyle={styles.foodList}
          />
        ) : (
          <View style={styles.mapViewPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Map View coming soon!</Text>
            <MaterialCommunityIcons name="map" size={50} color="#ccc" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scrollContent: { paddingBottom: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  filterButton: { backgroundColor: '#e0ffe0', borderRadius: 10, padding: 12, height: 50, justifyContent: 'center', alignItems: 'center' },
  viewToggleContainer: { flexDirection: 'row', backgroundColor: '#e0e0e0', borderRadius: 10, marginHorizontal: 20, marginTop: 20, marginBottom: 10, overflow: 'hidden' },
  viewToggleButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeViewButton: { backgroundColor: '#fff', borderRadius: 8, margin: 2 },
  viewButtonText: { fontSize: 16, fontWeight: '500', color: '#666' },
  activeViewText: { color: '#00C853', fontWeight: 'bold' },
  foodList: { paddingHorizontal: 20, paddingTop: 10 },
  mapViewPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50, height: 300, backgroundColor: '#e9e9e9', marginHorizontal: 20, borderRadius: 10 },
  mapPlaceholderText: { fontSize: 20, color: '#888', marginBottom: 10 },
});

export default HomeScreen;
