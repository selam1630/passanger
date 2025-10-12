import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
export default function CarrierDashboard({ route }) {
  const navigation = useNavigation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableKg, setAvailableKg] = useState(5);
  const [flights, setFlights] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (route.params?.token) setToken(route.params.token);
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/flights/get');
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error('Error fetching flights:', err);
    }
  };

  const handleAddFlight = async () => {
    if (!from || !to || !departureDate || !availableKg) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/flights/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          from,
          to,
          departureDate: departureDate.toISOString(),
          availableKg: parseFloat(availableKg),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Flight added successfully!');
        setFrom('');
        setTo('');
        setAvailableKg(5);
        fetchFlights();
      } else {
        Alert.alert('Error', data.message || 'Failed to add flight');
      }
    } catch (err) {
      console.error('Error adding flight:', err);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  };

  const renderFlight = ({ item }) => (
    <View style={styles.flightCard}>
      <Text style={styles.flightText}>From: {item.from}</Text>
      <Text style={styles.flightText}>To: {item.to}</Text>
      <Text style={styles.flightText}>
        Departure: {new Date(item.departureDate).toLocaleString()}
      </Text>
      <Text style={styles.flightText}>Available Kg: {item.availableKg}</Text>
      <Text style={styles.flightText}>Status: {item.status}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#0A122D', '#0A122D']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <Text style={styles.logo}>FlyBridge</Text>
            <Text style={styles.title}>Carrier Dashboard</Text>

            <TextInput
              style={styles.input}
              placeholder="From"
              placeholderTextColor="#ccc"
              value={from}
              onChangeText={setFrom}
            />
            <TextInput
              style={styles.input}
              placeholder="To"
              placeholderTextColor="#ccc"
              value={to}
              onChangeText={setTo}
            />

            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                Departure: {departureDate.toLocaleString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={departureDate}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDepartureDate(selectedDate);
                }}
              />
            )}

            <Text style={styles.label}>Available Kg: {availableKg}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={50}
              step={1}
              minimumTrackTintColor="#FFA500"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#FFA500"
              value={availableKg}
              onValueChange={(value) => setAvailableKg(value)}
            />

            <TouchableOpacity style={styles.addBtn} onPress={handleAddFlight}>
              <Text style={styles.addText}>Add Flight</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>Your Flights</Text>
            <FlatList
              data={flights}
              keyExtractor={(item) => item.id}
              renderItem={renderFlight}
              style={{ width: '100%' }}
            />

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 40,
  },
  logo: { color: '#FFA500', fontSize: 28, fontWeight: 'bold', alignSelf: 'center', marginBottom: 15 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subtitle: { color: '#ccc', fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    marginBottom: 15,
    width: '100%',
  },
  dateBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  dateText: { color: 'white' },
  label: { color: '#ccc', marginBottom: 5 },
  addBtn: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addText: { color: '#0A122D', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  flightCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  flightText: { color: 'white', marginBottom: 5 },
  logoutBtn: {
    backgroundColor: '#FF4500',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 25,
  },
  logoutText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});
