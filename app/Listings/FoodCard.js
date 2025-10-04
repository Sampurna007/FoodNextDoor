import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const FoodCard = ({ food }) => {
  return (
    <TouchableOpacity style={styles.card}>
      {food.imageUrl ? (
        <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <MaterialCommunityIcons name="pot-steam-outline" size={60} color="#FFC107" />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.foodTitle}>{food.title}</Text>
          {food.isFree && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeText}>Free</Text>
            </View>
          )}
        </View>
        <Text style={styles.foodDescription}>{food.description}</Text>
        <View style={styles.detailsRow}>
          {food.distance && <><Ionicons name="location-outline" size={16} color="#888" /><Text style={styles.detailText}>{food.distance}</Text></>}
          {food.expiresIn && <><Ionicons name="time-outline" size={16} color="#888" style={styles.detailIcon} /><Text style={styles.detailText}>Expires in {food.expiresIn}</Text></>}
        </View>
        {food.provider && <Text style={styles.providerText}>by {food.provider}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 15, marginVertical: 10, padding: 15, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  foodImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15, resizeMode: 'cover' },
  content: { flex: 1 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  foodTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flexShrink: 1 },
  freeBadge: { backgroundColor: '#E0FFE0', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 10 },
  freeText: { color: '#00C853', fontSize: 12, fontWeight: 'bold' },
  foodDescription: { fontSize: 14, color: '#666', marginVertical: 5 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  detailText: { fontSize: 13, color: '#888', marginLeft: 5, marginRight: 15 },
  detailIcon: { marginLeft: 0 },
  providerText: { fontSize: 13, color: '#00C853', fontWeight: '500', marginTop: 5 },
});

export default FoodCard;
