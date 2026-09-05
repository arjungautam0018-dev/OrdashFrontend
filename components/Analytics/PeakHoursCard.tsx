import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, sf } from "../../Extras/responsive";

// TODO: wire data from GET /api/analytics/peak-hours
// Data shape: [{ hour: 12, orders: 34 }, { hour: 13, orders: 41 }, ...]
// Visualize as a bar chart — react-native-gifted-charts BarChart recommended

interface Props {
    data: { hour: number; orders: number }[];
}

export default function PeakHoursCard({ data }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Peak hours</Text>
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>⏰ Peak hours coming soon</Text>
                <Text style={styles.placeholderSub}>Wire GET /api/analytics/peak-hours</Text>
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
    title: { fontSize: sf(14), fontWeight: "700", color: "#111827", marginBottom: s(14) },
    placeholder: {
        height: s(120), backgroundColor: "#F9FAFB", borderRadius: s(10),
        borderWidth: 1, borderColor: "#E5E7EB", borderStyle: "dashed",
        alignItems: "center", justifyContent: "center", gap: s(6),
    },
    placeholderText: { fontSize: sf(14) },
    placeholderSub:  { fontSize: sf(11), color: "#9CA3AF" },
});
