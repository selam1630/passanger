import React, { useState, useContext } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../App';

const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',      
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  INPUT_BG: 'rgba(45, 75, 70, 0.05)',
  CARD_BG: '#FFFFFF',              
  STATUS_GREEN: '#4CAF50',
};

export default function SignInScreen() {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setMessage('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage('Login successful!');
        await AsyncStorage.setItem('userToken', data.token);
        signIn(data.token);

        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
        });

        const userData = await userRes.json();

        if (userData.role === 'carrier') {
          navigation.navigate('CarrierDashboard', { token: data.token, user: userData });
        } else if (userData.role === 'sender') {
          navigation.navigate('senderDashboard', { token: data.token, user: userData });
        } else if (userData.role === 'receiver') {
          navigation.navigate('ReceiverDashboard', { token: data.token, user: userData });
        } else {
          Alert.alert('Error', 'Unknown role. Cannot navigate.');
        }

      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      setMessage('An error occurred. Please try again.');
    }
  };
  
  return (
    <LinearGradient colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]} style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
            {message ? (
              <Text
                style={{
                  color: message.includes('successful') ? COLORS.STATUS_GREEN : 'red',
                  textAlign: 'center',
                  marginBottom: 15,
                  fontSize: 14,
                }}
              >
                {message}
              </Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999" 
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={[styles.signInBtn, loading && { opacity: 0.7 }]} onPress={handleSignIn} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.BACKGROUND_DARK} />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </TouchableOpacity>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don’t have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.link}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_LIGHT },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  card: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    color: COLORS.ACCENT_GOLD,
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: COLORS.TEXT_DARK,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 10,
    padding: 15,
    color: COLORS.TEXT_DARK, 
    marginBottom: 15,
    width: '100%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(45, 75, 70, 0.1)',
  },
  signInBtn: {
    backgroundColor: COLORS.ACCENT_GOLD, 
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: COLORS.ACCENT_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signInText: {
    color: COLORS.BACKGROUND_DARK,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: { color: COLORS.TEXT_DARK, fontSize: 14 },
  link: { color: COLORS.ACCENT_GOLD, fontWeight: 'bold', fontSize: 14 },
});
