import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, sf } from "../../Extras/responsive";

interface Props {
    revenue: string;
    orders: string;
    revenueGrowth?: number;
    ordersGrowth?: number;
}

function GrowthBadge({ value }: { value: number }) {
    const up    = value >= 0;
    const color = up ? "rgba(134,239,172,0.25)" : "rgba(252,165,165,0.25)";
    const text  = up ? `▲ ${value}%` : `▼ ${Math.abs(value)}%`;
    return (
        <View style={[styles.growthBadge, { backgroundColor: color }]}>
            <Text style={[styles.growthText, { color: up ? "#86efac" : "#fca5a5" }]}>{text}</Text>
        </View>
    );
}

export default function TodayCard({ revenue, orders, revenueGrowth, ordersGrowth }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>LIVE TODAY</Text>
            </View>
            <View style={styles.row}>
                <View style={styles.item}>
                    <Text style={styles.value}>{revenue}</Text>
                    <Text style={styles.label}>Revenue</Text>
                    {revenueGrowth !== undefined && <GrowthBadge value={revenueGrowth} />}
                </View>
                <View style={styles.item}>
                    <Text style={styles.value}>{orders}</Text>
                    <Text style={styles.label}>Orders</Text>
                    {ordersGrowth !== undefined && <GrowthBadge value={ordersGrowth} />}
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
    badgeText:   { color: "#fff", fontSize: sf(10), fontWeight: "700", letterSpacing: 1 },
    row:         { flexDirection: "row" },
    item:        { flex: 1, gap: s(4) },
    value:       { color: "#fff", fontSize: sf(28), fontWeight: "700" },
    label:       { color: "rgba(255,255,255,0.7)", fontSize: sf(12) },
    growthBadge: {
        alignSelf: "flex-start", paddingHorizontal: s(6),
        paddingVertical: s(2), borderRadius: s(4), marginTop: s(2),
    },
    growthText:  { fontSize: sf(11), fontWeight: "700" },
});
