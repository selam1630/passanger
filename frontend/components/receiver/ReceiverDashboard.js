import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  CARD_BG: '#FFFFFF',
  SECONDARY_TEXT: '#888',
  SUCCESS: '#4CAF50',
  WARNING: '#FFC107',
  INFO: '#17A2B8',
  DANGER: '#DC3545',
};
const SidebarLink = ({ text, isActive, onPress }) => (
  <TouchableOpacity
    style={[
      styles.sidebarLink,
      isActive && styles.activeSidebarLink,
    ]}
    onPress={onPress}
  >
    <Text style={[styles.sidebarText, isActive && styles.activeSidebarText]}>
      {text}
    </Text>
  </TouchableOpacity>
);
const getStatusStyle = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
    case 'REQUESTED':
      return { color: COLORS.WARNING };
    case 'ACCEPTED':
    case 'IN_TRANSIT':
      return { color: COLORS.INFO };
    case 'DELIVERED':
      return { color: COLORS.SUCCESS };
    case 'CANCELLED':
      return { color: COLORS.DANGER };
    default:
      return { color: COLORS.SECONDARY_TEXT };
  }
};

export default function ReceiverDashboard() {
  const navigation = useNavigation();
  const [activeMenu, setActiveMenu] = useState('TRACK'); 
  const [trackingCode, setTrackingCode] = useState('');
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackShipment = useCallback(async () => {
    if (!trackingCode.trim()) {
      return Alert.alert('Missing Code', 'Please enter a tracking code.');
    }
    setIsLoading(true);
    setShipmentDetails(null);
    try {
      const res = await fetch(`http://localhost:5000/api/receiver/track/${trackingCode.trim()}`);
      const data = await res.json();
      if (res.ok) {
        setShipmentDetails(data);
      } else {
        Alert.alert('Tracking Failed', data.message || 'Could not find shipment. Please check the code.');
        setShipmentDetails(null);
      }
    } catch (err) {
      console.error('Tracking network error:', err);
      Alert.alert('Network Error', 'Something went wrong. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [trackingCode]);
  const TrackingResultCard = ({ shipment }) => {
    const flightDate = new Date(shipment.flight.departureDate).toLocaleString();
    const statusStyle = getStatusStyle(shipment.status);

    return (
      <View style={styles.resultCard}>
        <Text style={styles.cardHeader}>Shipment Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tracking Code:</Text>
          <Text style={styles.detailValue}>{shipment.trackingCode}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Item Weight:</Text>
          <Text style={styles.detailValue}>{shipment.itemWeight} kg</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shipment Status:</Text>
          <Text style={[styles.detailValue, { fontWeight: 'bold' }, statusStyle]}>
            {shipment.status?.toUpperCase().replace('_', ' ')}
          </Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.cardSubHeader}>Flight Information</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Route:</Text>
          <Text style={styles.detailValue}>{shipment.flight.from} → {shipment.flight.to}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Departure:</Text>
          <Text style={styles.detailValue}>{flightDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Flight Status:</Text>
          <Text style={[styles.detailValue, getStatusStyle(shipment.flight.status)]}>
            {shipment.flight.status?.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.separator} />

        <Text style={styles.cardSubHeader}>Sender & Carrier</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Sender:</Text>
          <Text style={styles.detailValue}>{shipment.sender.fullName} ({shipment.sender.phone})</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Carrier:</Text>
          <Text style={styles.detailValue}>{shipment.carrier.fullName} ({shipment.carrier.phone})</Text>
        </View>
        
      </View>
    );
  };

  return (
    <LinearGradient colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.mainWrapper}>
        <View style={styles.sidebar}>
          {Platform.OS === 'web' ? (
            <View style={styles.profileContainer}>
              <View style={styles.profileImagePlaceholder} />
              <Text style={styles.profileName}>SHIPMENT RECEIVER</Text>
              <Text style={styles.profileEmail}>track@shipment.com</Text>
            </View>
          ) : null}
          <SidebarLink text="TRACK DELIVERY" isActive={activeMenu === 'TRACK'} onPress={() => setActiveMenu('TRACK')} />
          <SidebarLink text="HELP" isActive={activeMenu === 'HELP'} onPress={() => setActiveMenu('HELP')} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.pageTitle}>Track Your Shipment</Text>
          <View style={styles.trackingArea}>
            <TextInput
              style={styles.trackingInput}
              placeholder="Enter Shipment Tracking Code"
              placeholderTextColor={COLORS.SECONDARY_TEXT}
              value={trackingCode}
              onChangeText={setTrackingCode}
              autoCapitalize="none"
              keyboardType="default"
            />
            <TouchableOpacity
              onPress={handleTrackShipment}
              style={styles.trackBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.BACKGROUND_DARK} />
              ) : (
                <Text style={styles.trackText}>Track Now</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            {shipmentDetails ? (
              <TrackingResultCard shipment={shipmentDetails} />
            ) : (
              !isLoading && (
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>
                    Enter a valid tracking code above to check the status of your item.
                  </Text>
                </View>
              )
            )}
          </View>
          
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_LIGHT },
  mainWrapper: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flex: 1
  },
  sidebar: {
    width: Platform.OS === 'web' ? 180 : '100%',
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingTop: Platform.OS === 'web' ? 50 : 20,
    paddingHorizontal: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    ...(Platform.OS !== 'web' && { height: 60, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, borderBottomRightRadius: 0, borderTopRightRadius: 0 }),
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    ...(Platform.OS !== 'web' && { display: 'none' }),
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.ACCENT_GOLD,
  },
  profileName: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
  },
  sidebarLink: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  activeSidebarLink: {
    backgroundColor: COLORS.ACCENT_GOLD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sidebarText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
    fontSize: 13,
    ...(Platform.OS !== 'web' && { fontSize: 10, textAlign: 'center' }),
  },
  activeSidebarText: {
    color: COLORS.BACKGROUND_DARK,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    marginVertical: 15,
  },
  content: {
    flexGrow: 1,
    padding: Platform.OS === 'web' ? 30 : 20, 
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 20,
  },
  trackingArea: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    marginBottom: 30,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  trackingInput: {
    flex: Platform.OS === 'web' ? 1 : 0,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginRight: Platform.OS === 'web' ? 15 : 0,
    marginBottom: Platform.OS !== 'web' ? 10 : 0,
    borderWidth: 1,
    borderColor: '#eee',
    color: COLORS.TEXT_DARK,
  },
  trackBtn: {
    backgroundColor: COLORS.ACCENT_GOLD,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackText: {
    color: COLORS.BACKGROUND_DARK,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.BACKGROUND_DARK,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 15,
  },
  cardSubHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 10,
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.SECONDARY_TEXT,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    textAlign: 'right',
    flexShrink: 1,
  },
  infoContainer: {
    backgroundColor: '#E6EAEB',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    color: COLORS.SECONDARY_TEXT,
    fontSize: 16,
    textAlign: 'center',
  }
});