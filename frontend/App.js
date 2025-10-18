import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './components/LandingPage';
import SignUpScreen from './components/auth pages/SignUpScreen';
import SignInScreen from './components/auth pages/SignInScreen';
import VerifyOtpScreen from './components/auth pages/VerifyOtpScreen';
import CarrierDashboard from './components/carrier/CarrierDashboard';
import senderDashboard from './components/sender/senderDashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export const AuthContext = React.createContext();

export default function App() {
  const [userToken, setUserToken] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) setUserToken(token);
      } catch {}
      setLoading(false);
    };
    loadToken();
  }, []);

  const authContext = {
    signIn: async (token) => {
      setUserToken(token);
      await AsyncStorage.setItem('userToken', token);
    },
    signOut: async () => {
      setUserToken(null);
      await AsyncStorage.removeItem('userToken');
    },
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!userToken ? (
            <>
              <Stack.Screen name="Landing" component={LandingPage} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="CarrierDashboard" component={CarrierDashboard} />
              <Stack.Screen name="senderDashboard" component={senderDashboard} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
