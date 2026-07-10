import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeNotification } from './features/notification';

import CheckUser        from './screens/checkuser';
import ScanQr           from './screens/scanner';
import SignupSeller      from './components/SignupSeller/SignupSeller';
import LoginSeller       from './components/SignupSeller/LoginSeller';
import DashboardSellere from './screens/Dashboardseller';
import DashboardCustomer from './screens/Dashboardcustomer';
import AddTableScreen   from './SubScreens/Sellersubscreen/addtable';
import AddStockScreen   from './SubScreens/Sellersubscreen/addstock';

const Stack = createNativeStackNavigator();

// Session is valid for 7 days
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export default function App() {
  // null = still checking, false = not logged in, true = logged in
  const [sessionChecked, setSessionChecked] = useState(false);
  const [initialRoute, setInitialRoute] = useState('ChooseRole');

  useEffect(() => {
    initializeNotification();
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const raw = await AsyncStorage.getItem('session');
      if (raw) {
        const session = JSON.parse(raw);
        const savedAt = session.savedAt ?? 0;
        const expired = Date.now() - savedAt > SESSION_TTL_MS;
        if (!expired && session.sellerId) {
          setInitialRoute('DashboardSeller');
        } else if (expired) {
          // Clear expired session
          await AsyncStorage.removeItem('session');
        }
      }
    } catch (e) {}
    setSessionChecked(true);
  };

  // Don't render navigation until session check is done to avoid flicker
  if (!sessionChecked) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ChooseRole"       component={CheckUser} />
          <Stack.Screen name="QRScanner"        component={ScanQr} />
          <Stack.Screen name="SellerSignup"     component={SignupSeller} />
          <Stack.Screen name="SellerLogin"      component={LoginSeller} />
          <Stack.Screen name="DashboardSeller"  component={DashboardSellere} />
          <Stack.Screen name="DashboardCustomer" component={DashboardCustomer} />
          <Stack.Screen name="AddTable"         component={AddTableScreen} />
          <Stack.Screen name="AddStock"         component={AddStockScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
