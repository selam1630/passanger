import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const logoImage = require('../assets/logo.png');
const backgroundVideo = require('../assets/background.mp4');

const COLORS = {
  BACKGROUND_LIGHT: '#F4F7FB', 
  BACKGROUND_DARK: '#2D4B46', 
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#2C3E50', 
  TEXT_LIGHT: '#FFFFFF',
  CARD_BG: '#FAFAFA', 
  SHADOW_COLOR: 'rgba(45, 75, 70, 0.15)', 
};

const VideoCard = ({ player }) => (
  <View style={styles.videoCard}>
    <VideoView
      style={styles.videoContent}
      player={player}
      contentFit="cover"
    />
  </View>
);

const ServiceItem = ({ title, description, index }) => {
  const isOdd = index % 2 !== 0;
  const iconText = index === 0 ? '✈️' : index === 1 ? '📦' : index === 2 ? 'GPS' : 'B2B';

  return (
    <View style={[
      styles.serviceCard,
      isWeb && { width: width > 768 ? '48%' : '100%' },
    ]}>
      <View style={styles.serviceIconContainer}>
        <Text style={styles.serviceIcon}>{iconText}</Text>
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </View>
  );
};
const FeatureItem = ({ title, description }) => (
    <View style={styles.featureItem}>
        <View style={styles.featureBullet} />
        <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
        </View>
    </View>
);

export default function LandingPage() {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);

  const player = useVideoPlayer(backgroundVideo, (player) => {
    player.loop = true;
    player.muted = true;
    player.controls = false;
    player.play();
  });

  useEffect(() => {
    if (player) player.play();
  }, [player]);

  const services = [
    { title: 'Courier Delivery', description: 'Fast, secure delivery for small packages across cities and towns.' },
    { title: 'Freight & Cargo', description: 'Reliable freight service for large shipments, with real-time tracking.' },
    { title: 'Package Tracking', description: 'Track your parcels anytime with live updates from sender to receiver.' },
    { title: 'Business Solutions', description: 'Custom logistics solutions for companies, from bulk shipping to supply chain management.' },
  ];

  const coreValues = [
    { title: 'Max Speed', description: 'Fastest delivery times in the region via smart routing.' },
    { title: 'Zero Worry', description: 'Fully secure, insured, and tracked packages.' },
    { title: 'Full Coverage', description: 'Connecting every town and city in Ethiopia.' },
    { title: 'Honest Rates', description: 'Clear, upfront, and transparent pricing.' },
  ];

  const scrollToSection = (ref) => {
    ref.current?.measureLayout(
      scrollViewRef.current.getInnerViewNode(),
      (x, y) => {
        scrollViewRef.current.scrollTo({ y: y - (isWeb ? 70 : 0), animated: true });
      }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />

          <View style={styles.nav}>
            <TouchableOpacity onPress={() => scrollToSection(servicesRef)}>
              <Text style={styles.navItemDark}>SERVICES</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => scrollToSection(aboutRef)}>
              <Text style={styles.navItemDark}>ABOUT</Text>
            </TouchableOpacity>

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
            <Text style={styles.heroTitle}>Deliver Smarter. Connect Faster.</Text>
            <Text style={styles.heroSubtitle}>
              SwiftLink bridges senders and carriers seamlessly — helping businesses
              and individuals move packages quickly, securely, and affordably across Ethiopia and beyond.
            </Text>
            <TouchableOpacity style={styles.quoteBtn} onPress={() => scrollToSection(servicesRef)}>
              <Text style={styles.quoteText}>Explore Services →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroRight}>
            <VideoCard player={player} />
          </View>
        </View>
        <View ref={servicesRef} style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <ServiceItem key={index} {...service} index={index} />
            ))}
          </View>
        </View>
<View ref={aboutRef} style={styles.aboutSection}>
  <Text style={[styles.sectionTitle, { color: COLORS.TEXT_LIGHT }]}>Why SwiftLink?</Text>
  
  <View style={styles.aboutContent}>
    <View style={styles.aboutMission}>
      <Text style={styles.aboutMissionTitle}>Logistics, Simplified</Text>
      <Text style={[styles.aboutText, { color: 'rgba(255,255,255,0.85)', marginBottom: 20 }]}>
        SwiftLink makes shipping fast, reliable, and affordable. We connect senders and carriers seamlessly across Ethiopia.
      </Text>
      <TouchableOpacity style={styles.aboutCtaBtn} onPress={() => navigation.navigate('Contact')}>
        <Text style={styles.aboutCtaText}>Connect With Us</Text>
      </TouchableOpacity>
    </View>

    {/* Core Values / Highlights */}
    <View style={styles.aboutFeatures}>
      {coreValues.slice(0, 2).map((feature, index) => (
        <FeatureItem key={index} {...feature} />
      ))}
    </View>
  </View>
</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_LIGHT },
  scroll: { flexGrow: 1, paddingHorizontal: isWeb ? 60 : 20, paddingTop: 10 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: isWeb ? 0 : 30, 
    flexWrap: 'wrap', 
    zIndex: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderBottomWidth: isWeb ? 1 : 0, 
    borderBottomColor: isWeb ? '#E0E0E0' : 'transparent',
  },
  logoImage: { width: isWeb ? 100 : 80, height: isWeb ? 100 : 80, borderRadius: 128 },
  nav: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginLeft: 'auto' },
  navItemDark: { color: COLORS.TEXT_DARK, marginHorizontal: isWeb ? 15 : 8, fontSize: isWeb ? 15 : 14, fontWeight: '500', marginVertical: 5 },
  getStartedBtn: { 
    backgroundColor: COLORS.ACCENT_GOLD, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    marginLeft: 20, 
    shadowColor: COLORS.ACCENT_GOLD, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 5, 
    elevation: 5 
  },
  getStartedText: { color: COLORS.BACKGROUND_DARK, fontWeight: 'bold', fontSize: 16 },
  heroSection: { 
    backgroundColor: COLORS.BACKGROUND_DARK, 
    paddingHorizontal: isWeb ? 60 : 20, 
    marginHorizontal: isWeb ? -60 : -20, 
    flexDirection: isWeb ? 'row' : 'column', 
    alignItems: 'flex-start', 
    justifyContent: 'space-between', 
    minHeight: 500, 
    paddingTop: isWeb ? 80 : 30, 
    paddingBottom: 50 
  },
  heroLeft: { flex: isWeb ? 0.6 : 1, justifyContent: 'flex-start', paddingRight: isWeb ? 40 : 0, marginBottom: isWeb ? 0 : 40 },
  heroTitle: { color: COLORS.TEXT_LIGHT, fontSize: isWeb ? 54 : 38, fontWeight: '800', marginBottom: 20, lineHeight: isWeb ? 60 : 45, maxWidth: 600 },
  heroSubtitle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, marginBottom: 30, lineHeight: 24 },
  quoteBtn: { 
    backgroundColor: COLORS.ACCENT_GOLD, 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 8, 
    width: 250, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    shadowColor: COLORS.ACCENT_GOLD, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 6, 
    elevation: 6 
  },
  quoteText: { color: COLORS.BACKGROUND_DARK, fontWeight: 'bold', fontSize: 17 },
  heroRight: { flex: isWeb ? 0.4 : 1, alignItems: 'flex-end', justifyContent: 'flex-start', paddingLeft: isWeb ? 20 : 0, minHeight: isWeb ? 400 : undefined },
  videoCard: { width: '100%', height: 380, backgroundColor: 'black', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  videoContent: { width: '100%', height: '100%' },
  servicesSection: { paddingVertical: 80, backgroundColor: COLORS.BACKGROUND_LIGHT, paddingHorizontal: isWeb ? 60 : 20 },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isWeb ? 'space-between' : 'center',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  sectionTitle: { fontSize: isWeb ? 42 : 32, fontWeight: '800', color: COLORS.TEXT_DARK, marginBottom: 50, textAlign: 'center' },
  serviceCard: {
    backgroundColor: COLORS.CARD_BG,
    padding: 30,
    marginBottom: isWeb ? 30 : 20,
    borderRadius: 12,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 180,
    width: isWeb ? width > 768 ? '48%' : '100%' : '100%', 
    borderTopWidth: 4, 
    borderTopColor: COLORS.ACCENT_GOLD + '80',
  },
  serviceIconContainer: {
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: COLORS.ACCENT_GOLD + '15', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.ACCENT_GOLD + '50',
  },
  serviceIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.BACKGROUND_DARK,
  },
  serviceTitle: { fontSize: 22, fontWeight: '700', marginBottom: 10, color: COLORS.TEXT_DARK },
  serviceDescription: { fontSize: 15, color: COLORS.TEXT_DARK, lineHeight: 22 },
  aboutSection: { 
  paddingVertical: 40, 
  backgroundColor: COLORS.BACKGROUND_DARK, 
  marginHorizontal: isWeb ? -60 : -20, 
  paddingHorizontal: isWeb ? 60 : 20,
  alignItems: 'center',
  position: 'relative',
},
aboutContent: {
  flexDirection: isWeb ? 'row' : 'column',
  maxWidth: 1200,
  width: '100%',
  justifyContent: 'space-between',
  alignItems: isWeb ? 'flex-start' : 'center',
},
aboutMission: {
  flex: isWeb ? 1 : undefined,
  paddingRight: isWeb ? 30 : 0,
  marginBottom: isWeb ? 0 : 20,
},
aboutFeatures: {
  flex: isWeb ? 1 : undefined,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  padding: 20,
  borderRadius: 12,
  borderLeftWidth: 3,
  borderLeftColor: COLORS.ACCENT_GOLD,
},
aboutMissionTitle: {
    fontSize: isWeb ? 28 : 20,  
    fontWeight: '700', 
    color: COLORS.ACCENT_GOLD, 
    marginBottom: 15, 
    textAlign: isWeb ? 'left' : 'center',
},
aboutText: { 
  fontSize: isWeb ? 16 : 14, 
  lineHeight: isWeb ? 24 : 20, 
  maxWidth: 600,
  marginBottom: 15, 
},
aboutCtaBtn: {
  backgroundColor: COLORS.ACCENT_GOLD, 
  paddingVertical: 12, 
  paddingHorizontal: 30,
  borderRadius: 8, 
  shadowColor: '#000', 
  shadowOffset: { width: 0, height: 3 }, 
  shadowOpacity: 0.3, 
  shadowRadius: 4, 
  elevation: 6,
  alignSelf: isWeb ? 'flex-start' : 'center',
},
aboutCtaText: {
  color: COLORS.BACKGROUND_DARK, 
  fontWeight: 'bold', 
  fontSize: 16, 
},
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    maxWidth: 500,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ACCENT_GOLD,
    marginTop: 8,
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
  },
});