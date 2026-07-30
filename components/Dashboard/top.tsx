import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { SettingsIcon } from '../../Extras/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LogoutIcon = ({ size = 20, color = "#fff" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);


export default function TopBar() {
  const navigation = useNavigation<any>();
  const [shopName, setShopName] = useState("Grand Palace Hotel");
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => { fetchShopName(); }, []);

  const fetchShopName = async () => {
    try {
      const session = await AsyncStorage.getItem('session');
      if (session) {
        const parsed = JSON.parse(session);
        setShopName(parsed.shopName);
        setIsAdmin(parsed.type !== 'sub');
      }
    } catch (e) {}
  };

  const handleSettings = () => {
    navigation.navigate("SellerSettings");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('session');
    navigation.reset({ index: 0, routes: [{ name: 'SellerLogin' }] });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>

        {/* Logo */}
        <View style={styles.side}>
          <View style={styles.logoBadge}>
            <Svg width={22} height={22} viewBox="0 0 32 32" fill="none">
              <Path d="M8 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#F4C430" strokeWidth={2.5} strokeLinecap="round" />
              <Circle cx={16} cy={21} r={3} fill="#F4C430" />
              <Path d="M13 12c0-1.1.4-2.5 3-3 2.6-.5 3 1 3 2" stroke="#F4C430" strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
          </View>
        </View>

        {/* Center title */}
        <Text style={styles.hotelName} numberOfLines={1}>{shopName}</Text>

        
        {/* Settings / Logout based on account type */}
        {isAdmin ? (
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <SettingsIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.settingsButton} onPress={handleLogout}>
            <LogoutIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#6C63FF',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  side: {
    width: 32,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotelName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});