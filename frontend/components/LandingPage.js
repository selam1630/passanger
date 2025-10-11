import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function LandingPage() {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#0A122D', '#0A122D']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>FlyBridge</Text>
          <View style={styles.nav}>
            <Text style={styles.navItem}>Services</Text>
            <Text style={styles.navItem}>Partners</Text>
            <Text style={styles.navItem}>Technology</Text>
            <Text style={styles.navItem}>About</Text>
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroTitle}>The Hardest Working Team in Transport</Text>
            <Text style={styles.heroSubtitle}>
              We offer end-to-end logistics excellence, through elevated customer care globally.
            </Text>
            <TouchableOpacity style={styles.quoteBtn}>
              <Text style={styles.quoteText}>Request a Quote →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroRight}>
            <Image
              source={require('../assets/favicon.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Platform.OS === 'web' ? 100 : 20,
    paddingVertical: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  logo: {
    color: '#FFA500',
    fontSize: 28,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: Platform.OS === 'web' ? 0 : 10,
  },
  navItem: {
    color: 'white',
    marginHorizontal: 10,
    fontSize: 16,
    marginVertical: 5,
  },
  getStartedBtn: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  getStartedText: {
    color: '#0A122D',
    fontWeight: 'bold',
    fontSize: 16,
  },
  heroSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A122D',
    borderRadius: 20,
    padding: 20,
  },
  heroLeft: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: Platform.OS === 'web' ? 0 : 20,
  },
  heroTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  heroSubtitle: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
  quoteBtn: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  quoteText: {
    color: '#0A122D',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  heroRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: Platform.OS === 'web' ? 400 : '100%',
    height: 300,
    borderRadius: 20,
  },
});
