import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, sf } from "../../Extras/responsive";

interface Props {
    revenue: string;
    orders: string;
}

export default function TodayCard({ revenue, orders }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>LIVE TODAY</Text>
            </View>
            <View style={styles.row}>
                <View style={styles.item}>
                    <Text style={styles.value}>{revenue}</Text>
                    <Text style={styles.label}>Revenue</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.value}>{orders}</Text>
                    <Text style={styles.label}>Orders</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#6C63FF", borderRadius: s(14),
        padding: s(18), marginBottom: s(14),
    },
    badge: {
        backgroundColor: "rgba(255,255,255,0.2)", alignSelf: "flex-start",
        paddingHorizontal: s(8), paddingVertical: s(3),
        borderRadius: s(6), marginBottom: s(12),
    },
    badgeText: { color: "#fff", fontSize: sf(10), fontWeight: "700", letterSpacing: 1 },
    row:   { flexDirection: "row" },
    item:  { flex: 1 },
    value: { color: "#fff", fontSize: sf(28), fontWeight: "700" },
    label: { color: "rgba(255,255,255,0.7)", fontSize: sf(12), marginTop: s(4) },
});
