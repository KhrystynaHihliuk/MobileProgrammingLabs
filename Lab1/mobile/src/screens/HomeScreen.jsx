import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CityItem  from '../components/CityItem';
import { api } from '../services/api';

 const HomeScreen = () => {
  const [cities, setCities] = useState([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCities = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/cities');

      if (!response.data?.success || !Array.isArray(response.data.data)) {
        throw new Error('Помилковий формат відповіді сервера');
      }

      setCities(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Не вдалося завантажити список міст'
      );
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCity = async () => {
    if (!name.trim() || !country.trim()) {
      Alert.alert('Помилка', 'Введіть назву міста і країну');
      setError('Введіть назву міста і країну');
      return;
    }
   

    try {
      await api.post('/cities', {
        name: name.trim(),
        country: country.trim(),
      });

      setName('');
      setCountry('');
      await loadCities();
    } catch (err) {
      Alert.alert(
        'Помилка',
        err.response?.data?.message || 'Не вдалося додати місто'
      );
    }
  };

  const deleteCity = async (id) => {
    try {
      await api.delete(`/cities/${id}`);
      await loadCities();
    } catch (err) {
      Alert.alert(
        'Помилка',
        err.response?.data?.message || 'Не вдалося видалити місто'
      );
    }
  };

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Лабораторна 1 Прогноз Погоди</Text>
    
        <TextInput
          style={styles.input}
          placeholder="Назва міста"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Країна"
          value={country}
          onChangeText={setCountry}
        />

        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton} onPress={addCity}>
            <Text style={styles.primaryButtonText}>Додати місто</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={loadCities}>
            <Text style={styles.secondaryButtonText}>Оновити список</Text>
          </Pressable>
        </View>

        {loading ? <Text style={styles.infoText}>Завантаження...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading && !error && cities.length === 0 ? (
          <Text style={styles.infoText}>Список міст порожній</Text>
        ) : null}

        <FlatList
          data={cities}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CityItem item={item} onDelete={deleteCity} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 15,
    color: '#64748b',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe3ea',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  infoText: {
    marginBottom: 12,
    color: '#475569',
    fontSize: 15,
  },
  errorText: {
    marginBottom: 12,
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
});

export default HomeScreen;