import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
export default function SignUpScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [role, setRole] = useState('');

 const handleSignUp = async () => {
  if (!fullName || !email || !password || !phone || !nationalID || !role) {
    Alert.alert('Missing Information', 'Please fill in all fields before signing up.');
    return; 
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        phone,
        nationalID,
        role,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registration successful:', data);
      navigation.navigate('VerifyOtp', { phone });
    } else {
      console.error('Registration failed:', data.message || data);
      Alert.alert('Error', data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error registering:', error);
    Alert.alert('Error', 'An error occurred. Please try again.');
  }
};
  return (
    <LinearGradient colors={['#0A122D', '#0A122D']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.logo}>FlyBridge</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the FlyBridge network</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#ccc"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#ccc"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="National ID"
              placeholderTextColor="#ccc"
              value={nationalID}
              onChangeText={setNationalID}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.pickerContainer}>
  <Picker
    selectedValue={role}
    onValueChange={(itemValue) => setRole(itemValue)}
    style={styles.input}
    dropdownIconColor="#FFA500"
  >
    <Picker.Item label="Select Role" value="" color="#ccc" />
    <Picker.Item label="Carrier" value="carrier" color="#fff" />
    <Picker.Item label="Sender" value="sender" color="#fff" />
    <Picker.Item label="Receiver" value="receiver" color="#fff" />
  </Picker>
</View>
            <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.link}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
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
  },
  logo: { color: '#FFA500', fontSize: 30, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: '#ccc', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 15, color: 'white', marginBottom: 15, width: '100%' },
  signUpBtn: { backgroundColor: '#FFA500', paddingVertical: 15, borderRadius: 10, marginTop: 10 },
  signUpText: { color: '#0A122D', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: 'white' },
  link: { color: '#FFA500', fontWeight: 'bold' },
});
