import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
export default function LandingPage() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>FlyBridge</Text>
        <View style={styles.nav}>
          <Text style={styles.navItem}>Services</Text>
          <Text style={styles.navItem}>Partners</Text>
          <Text style={styles.navItem}>Technology</Text>
          <Text style={styles.navItem}>About</Text>
          <TouchableOpacity style={styles.getStartedBtn}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <LinearGradient
        colors={['rgba(10, 18, 45, 1)', 'rgba(10, 18, 45, 1)']}
        style={styles.heroSection}
      >
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
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(5, 12, 30, 1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    color: 'white',
    marginHorizontal: 10,
    fontSize: 16,
  },
  getStartedBtn: {
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginLeft: 10,
  },
  getStartedText: {
    color: '#0F1B3D',
    fontWeight: 'bold',
  },
  heroSection: {
    flexDirection: 'row',
    padding: 20,
    marginTop: 20,
    borderRadius: 20,
  },
  heroLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  heroSubtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  quoteBtn: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  quoteText: {
    color: '#0F1B3D',
    fontWeight: 'bold',
    fontSize: 16,
  },
  heroRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
  },
});
