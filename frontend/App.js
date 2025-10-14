import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './components/LandingPage';
import SignUpScreen from './components/auth pages/SignUpScreen';
import SignInScreen from './components/auth pages/SignInScreen';
import VerifyOtpScreen from './components/auth pages/VerifyOtpScreen';
import CarrierDashboard from './components/carrier/CarrierDashboard';
import senderDashboard from './components/sender/senderDashboard';
import RecieverDashboard from './components/receiver/ReceiverDashboard';
import SupportChat from './components/ChatScreen';
import AgentDashboard from './components/agent/AgentChat';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="CarrierDashboard" component={CarrierDashboard} />
        <Stack.Screen name="senderDashboard" component={senderDashboard} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="ReceiverDashboard" component={RecieverDashboard} />
        <Stack.Screen name="SupportChat" component={SupportChat} />
        <Stack.Screen name="AgentDashboard" component={AgentDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
