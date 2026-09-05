import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { s, sf } from "../../Extras/responsive";

import OverviewScreen from "./analytics/overview";
import ItemsScreen    from "./analytics/items";
import DemandScreen   from "./analytics/demand";

// ── Icons ─────────────────────────────────────────────────────────────────────
const OverviewIcon = ({ color }: { color: string }) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const ItemsIcon = ({ color }: { color: string }) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const DemandIcon = ({ color }: { color: string }) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M22 12h-4l-3 9L9 3l-3 9H2"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// ── Header ────────────────────────────────────────────────────────────────────
function AnalyticsHeader() {
    const navigation = useNavigation<any>();
    return (
        <SafeAreaView edges={["top"]} style={header.safeArea}>
            <View style={header.container}>
                <TouchableOpacity style={header.backBtn} onPress={() => navigation.goBack()}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <Path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth={2.2}
                            strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
                <Text style={header.title}>Analytics</Text>
                <View style={{ width: s(36) }} />
            </View>
        </SafeAreaView>
    );
}

const header = StyleSheet.create({
    safeArea:  { backgroundColor: "#6C63FF" },
    container: {
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: s(16), paddingVertical: s(12),
        backgroundColor: "#6C63FF",
        shadowColor: "#6C63FF", shadowOffset: { width: 0, height: s(4) },
        shadowOpacity: 0.25, shadowRadius: s(8), elevation: 6,
    },
    backBtn: {
        width: s(36), height: s(36), borderRadius: s(10),
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center", justifyContent: "center",
    },
    title: {
        flex: 1, textAlign: "center",
        fontSize: sf(15), fontWeight: "600", color: "#fff",
    },
});

// ── Tab navigator ─────────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator();
const ACTIVE   = "#6C63FF";
const INACTIVE = "#9CA3AF";

export default function AnalyticsScreen() {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            <AnalyticsHeader />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: ACTIVE,
                    tabBarInactiveTintColor: INACTIVE,
                    tabBarStyle: {
                        backgroundColor: "#fff",
                        borderTopWidth: 1, borderTopColor: "#eee",
                        height: s(60) + insets.bottom,
                        paddingBottom: insets.bottom,
                    },
                    tabBarLabelStyle: { fontSize: sf(11), fontWeight: "600" },
                    tabBarIcon: ({ color }) => {
                        if (route.name === "Overview") return <OverviewIcon color={color} />;
                        if (route.name === "Items")    return <ItemsIcon    color={color} />;
                        if (route.name === "Demand")   return <DemandIcon   color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Overview" component={OverviewScreen} />
                <Tab.Screen name="Items"    component={ItemsScreen}    />
                <Tab.Screen name="Demand"   component={DemandScreen}   />
            </Tab.Navigator>
        </View>
    );
}
