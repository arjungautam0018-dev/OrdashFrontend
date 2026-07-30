import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubscriptionSettings() {
    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <Text style={styles.title}>Subscription</Text>
            <Text style={styles.sub}>Manage your plan and billing — coming soon.</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
    title:     { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 8 },
    sub:       { fontSize: 14, color: "#6B7280" },
});
