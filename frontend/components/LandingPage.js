import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  CARD_BG: '#FFFFFF',
};
const placeholderImageUrl = "https://placehold.co/800x600/2D4B46/F7F8FC?text=Global+Logistics";
export default function LandingPage() {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="dark-content" />

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
              source={{ uri: placeholderImageUrl }}
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
    backgroundColor: COLORS.BACKGROUND_LIGHT,
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
    color: COLORS.ACCENT_GOLD,
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
    color: COLORS.TEXT_DARK, 
    marginHorizontal: 10,
    fontSize: 16,
    marginVertical: 5,
  },
  getStartedBtn: {
    backgroundColor: COLORS.ACCENT_GOLD,
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
    color: COLORS.BACKGROUND_DARK,
    fontWeight: 'bold',
    fontSize: 16,
  },
  heroSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.BACKGROUND_DARK,
    borderRadius: 20,
    padding: 40, 
    minHeight: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  heroLeft: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: Platform.OS === 'web' ? 0 : 20,
  },
  heroTitle: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  quoteBtn: {
    backgroundColor: COLORS.ACCENT_GOLD,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: COLORS.ACCENT_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  quoteText: {
    color: COLORS.BACKGROUND_DARK,
    fontWeight: 'bold',
    fontSize: 17,
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
    borderRadius: 15, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});
