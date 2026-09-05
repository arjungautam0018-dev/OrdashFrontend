import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, sf } from "../../Extras/responsive";

// TODO: replace placeholder with a real chart
// Recommended: react-native-gifted-charts or victory-native
// Install: npx expo install react-native-gifted-charts
// Data shape expected: [{ date: "2024-01-01", revenue: 1200 }, ...]

interface Props {
    data: { date: string; revenue: number }[];
}

export default function RevenueChart({ data }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Revenue over time</Text>
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>📊 Chart coming soon</Text>
                <Text style={styles.placeholderSub}>
                    Install react-native-gifted-charts and wire up data from{"\n"}
                    GET /api/analytics/revenue
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff", borderRadius: s(14),
        padding: s(18), marginBottom: s(14),
        shadowColor: "#000", shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: s(6), elevation: 2,
    },
    title: { fontSize: sf(14), fontWeight: "700", color: "#111827", marginBottom: s(16) },
    placeholder: {
        height: s(160), backgroundColor: "#F9FAFB",
        borderRadius: s(10), borderWidth: 1, borderColor: "#E5E7EB",
        borderStyle: "dashed", alignItems: "center", justifyContent: "center",
        gap: s(8),
    },
    placeholderText: { fontSize: sf(16) },
    placeholderSub:  { fontSize: sf(11), color: "#9CA3AF", textAlign: "center", lineHeight: sf(16) },
});
