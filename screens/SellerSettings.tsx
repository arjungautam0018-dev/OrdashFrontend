import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, Circle } from "react-native-svg";

import ProfileSettings       from "../SubScreens/Sellersubscreen/settings/profile";
import SubscriptionSettings from "../SubScreens/Sellersubscreen/settings/subscriptions";
import ManageAccounts       from "../SubScreens/Sellersubscreen/settings/accounts";
import LogoutSettings       from "../SubScreens/Sellersubscreen/settings/logout";

// ── Icons ─────────────────────────────────────────────────────────────────────
const ProfileIcon = ({ color }: { color: string }) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.8} />
        <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);

// Subscriptions — card with a recurring/renew arrow
const SubscriptionIcon = ({ color }: { color: string }) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 10h18" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M8 15c1.2-1 2.8-1 4 0M8 15a2.8 2.8 0 004 0"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Manage Accounts — multiple people
const ManageAccountsIcon = ({ color }: { color: string }) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Circle cx={9} cy={8} r={3.2} stroke={color} strokeWidth={1.8} />
        <Path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M16 4.5a3 3 0 010 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M15.5 14c2.5.3 4.5 2.5 4.5 5"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);



const LogoutIcon = ({ color }: { color: string }) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// ── Header ────────────────────────────────────────────────────────────────────
function SettingsHeader() {
    const navigation = useNavigation<any>();
    return (
        <SafeAreaView edges={["top"]} style={header.safeArea}>
            <View style={header.container}>
                <TouchableOpacity style={header.backBtn} onPress={() => navigation.goBack()}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <Path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
                <Text style={header.title}>Settings</Text>
                <View style={{ width: 36 }} />
            </View>
        </SafeAreaView>
    );
}

const header = StyleSheet.create({
    safeArea:  { backgroundColor: "#6C63FF" },
    container: {
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: "#6C63FF",
        shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center", justifyContent: "center",
    },
    title: {
        flex: 1, textAlign: "center",
        fontSize: 15, fontWeight: "600", color: "#fff",
    },
});

// ── Tab navigator ─────────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator();

const ACTIVE   = "#6C63FF";
const INACTIVE = "#9CA3AF";

export default function SellerSettings() {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            <SettingsHeader />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: ACTIVE,
                    tabBarInactiveTintColor: INACTIVE,
                    tabBarStyle: {
                        backgroundColor: "#fff",
                        borderTopWidth: 1,
                        borderTopColor: "#eee",
                        height: 60 + insets.bottom,
                        paddingBottom: insets.bottom,
                    },
                    tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
                    tabBarIcon: ({ color }) => {
                        if (route.name === "Profile")       return <ProfileIcon color={color} />;
                        if(route.name === "Accounts") return <ManageAccountsIcon    color={color} />;
                        if(route.name === "Subscriptions")    return <SubscriptionIcon    color={color} />;
                        if (route.name === "Logout")        return <LogoutIcon  color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Profile"       component={ProfileSettings} />
                <Tab.Screen name="Subscriptions" component={SubscriptionSettings} />
                <Tab.Screen name="Accounts" component={ManageAccounts} />
                <Tab.Screen name="Logout"        component={LogoutSettings} />
            </Tab.Navigator>
        </View>
    );
}
