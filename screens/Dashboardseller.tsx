import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavHomeIcon, NavOrdersIcon, NavStockIcon, NavTablesIcon, NavAnalyticsIcon } from '../Extras/icons';

import HomeScreen from '../SubScreens/Sellersubscreen/dashboard';
import Analytics  from '../SubScreens/Sellersubscreen/analytics';
import PlaceOrder from '../SubScreens/Sellersubscreen/placeorder';
import Stock      from '../SubScreens/Sellersubscreen/stock';
import Tables     from '../SubScreens/Sellersubscreen/tables';

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR   = '#6C63FF';
const INACTIVE_COLOR = '#2D2D2D';

const tabIcon = (name: string, focused: boolean) => {
  const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;
  const icon = (() => {
    switch (name) {
      case 'Home':      return <NavHomeIcon      size={24} color={color} />;
      case 'Stock':     return <NavStockIcon     size={24} color={color} />;
      case 'Orders':    return <NavOrdersIcon    size={24} color={color} />;
      case 'Tables':    return <NavTablesIcon    size={24} color={color} />;
      case 'Analytics': return <NavAnalyticsIcon size={24} color={color} />;
    }
  })();

  return (
    <View style={focused ? {
      shadowColor: ACTIVE_COLOR,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 6,
    } : undefined}>
      {icon}
    </View>
  );
};

export default function DashboardSellerE() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => tabIcon(route.name, focused),
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home"      component={HomeScreen} />
      <Tab.Screen name="Tables"    component={Tables}     />
      <Tab.Screen
        name="Orders"
        component={PlaceOrder}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as any)}
              style={{
                top: -18,
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#6C63FF',
                shadowColor: '#6C63FF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 8,
              }}
            />
          ),
          tabBarIcon: () => <NavOrdersIcon size={26} color="#fff" />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen name="Stock"     component={Stock}      />
      <Tab.Screen name="Analytics" component={Analytics}  />
    </Tab.Navigator>
  );
}
