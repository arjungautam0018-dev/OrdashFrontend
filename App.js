import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './Extras/navigationRef';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeNotification } from './features/notification';
import * as Updates from 'expo-updates';

import CheckUser        from './screens/checkuser';
import ScanQr           from './screens/scanner';
import SignupSeller      from './components/SignupSeller/SignupSeller';
import LoginSeller       from './components/SignupSeller/LoginSeller';
import DashboardSellere from './screens/Dashboardseller';
import DashboardCustomer from './screens/Dashboardcustomer';
import SellerSettings    from './screens/SellerSettings';
import AddTableScreen   from './SubScreens/Sellersubscreen/addtable';
import AddStockScreen   from './SubScreens/Sellersubscreen/addstock';

const Stack = createNativeStackNavigator();


export default function App() {
  // null = still checking, false = not logged in, true = logged in
  const [sessionChecked, setSessionChecked] = useState(false);
  const [initialRoute, setInitialRoute] = useState('ChooseRole');

  useEffect(() => {
    initializeNotification();
    checkSession();
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    if (__DEV__) return; // expo-updates not supported in Expo Go / dev builds
    try {
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (e) {
      console.log('[Updates] error:', e);
    }
  };

  const checkSession = async () => {
    try {
      const raw = await AsyncStorage.getItem('session');
      if (raw) {
        const session = JSON.parse(raw);
        const token = session?.token;
        if (token && session.sellerId) {
          // Decode JWT payload (no crypto verify needed — server will reject if tampered)
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiredAt = payload.exp * 1000; // JWT exp is in seconds
          if (Date.now() < expiredAt) {
            setInitialRoute('DashboardSeller');
          } else {
            // Token expired — clear storage
            await AsyncStorage.removeItem('session');
          }
        } else {
          await AsyncStorage.removeItem('session');
        }
      }
    } catch (e) {
      await AsyncStorage.removeItem('session');
    }
    setSessionChecked(true);
  };

  // Don't render navigation until session check is done to avoid flicker
  if (!sessionChecked) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ChooseRole"       component={CheckUser} />
          <Stack.Screen name="QRScanner"        component={ScanQr} />
          <Stack.Screen name="SellerSignup"     component={SignupSeller} />
          <Stack.Screen name="SellerLogin"      component={LoginSeller} />
          <Stack.Screen name="DashboardSeller"  component={DashboardSellere} />
          <Stack.Screen name="SellerSettings"   component={SellerSettings} />
          <Stack.Screen name="DashboardCustomer" component={DashboardCustomer} />
          <Stack.Screen name="AddTable"         component={AddTableScreen} />
          <Stack.Screen name="AddStock"         component={AddStockScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
