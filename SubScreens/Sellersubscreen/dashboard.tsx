import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/Dashboard/top";
import SellerOrdersSection from "../../components/Dashboard/SellerOrdersSection";
import { API } from "../../Extras/api";
import { authFetch } from "../../Extras/authFetch";
import { registerForPushNotificationsAsync } from "../../features/notification";

export default function DashboardSeller() {
    // Register this device's Expo push token against the logged-in seller/staff
    // account so the backend can deliver push notifications (new orders, status
    // changes, bill requests) to the right roles even when the app is closed.
    useEffect(() => {
        const registerPush = async () => {
            try {
                const token = await registerForPushNotificationsAsync();
                if (!token) return;
                await authFetch(API.pushRegisterSeller, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });
            } catch (e) {
                if (__DEV__) console.warn("[DashboardSeller] push register failed:", e);
            }
        };
        registerPush();
    }, []);
    return (
        <View style={styles.container}>
            <TopBar />
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Orders</Text>
            </View>
            <SellerOrdersSection />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },
});
