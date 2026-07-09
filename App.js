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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    initializeNotification();
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await AsyncStorage.getItem('session');
      setIsLoggedIn(!!session);
    } catch (e) {}
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
