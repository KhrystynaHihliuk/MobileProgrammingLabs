import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

 const CityItem = ({ item, onDelete }) => {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.country}>{item.country}</Text>
      </View>

      <Pressable style={styles.deleteButton} onPress={() => onDelete(item._id)}>
        <Text style={styles.deleteButtonText}>Видалити</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbe3ea',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  country: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748b',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default CityItem;