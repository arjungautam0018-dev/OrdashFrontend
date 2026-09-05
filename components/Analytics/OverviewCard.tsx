import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, sf } from "../../Extras/responsive";

interface StatProps {
    label: string;
    value: string;
    sub?: string;
    color?: string;
}

function Stat({ label, value, sub, color = "#111827" }: StatProps) {
    return (
        <View style={styles.stat}>
            <Text style={[styles.value, { color }]}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
            {sub && <Text style={styles.sub}>{sub}</Text>}
        </View>
    );
}

interface Props {
    totalRevenue: string;
    totalOrders: string;
    avgOrder: string;
}

export default function OverviewCard({ totalRevenue, totalOrders, avgOrder }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Overview</Text>
            <View style={styles.row}>
                <Stat label="Revenue"   value={totalRevenue} color="#6C63FF" />
                <View style={styles.divider} />
                <Stat label="Orders"    value={totalOrders}  color="#0D6E4F" />
                <View style={styles.divider} />
                <Stat label="Avg Order" value={avgOrder}     color="#F59E0B" />
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
    title: { fontSize: sf(13), fontWeight: "600", color: "#6B7280", marginBottom: s(14) },
    row:   { flexDirection: "row", alignItems: "center" },
    stat:  { flex: 1, alignItems: "center" },
    value: { fontSize: sf(22), fontWeight: "700" },
    label: { fontSize: sf(11), color: "#9CA3AF", marginTop: s(4), fontWeight: "500" },
    sub:   { fontSize: sf(10), color: "#D1D5DB", marginTop: s(2) },
    divider: { width: 1, height: s(40), backgroundColor: "#F3F4F6" },
});
