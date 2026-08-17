import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, sf } from "../../../Extras/responsive";

export interface OrderItem {
    _id: string;
    items: { name: string; price: number; quantity: number }[];
    total: number;
    status: "pending" | "confirmed" | "preparing" | "ready" | "done";
    createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    pending:   { bg: "#FEF9E7", border: "#F7D060",  text: "#92400E" },
    confirmed: { bg: "#EFF6FF", border: "#BFDBFE",  text: "#1E3A8A" },
    preparing: { bg: "#EDE9FE", border: "#C4B5FD",  text: "#5B21B6" },
    ready:     { bg: "#F0FDF4", border: "#BBF7D0",  text: "#16A34A" },
    done:      { bg: "#F3F4F6", border: "#E5E7EB",  text: "#6B7280" },
};

interface Props { order: OrderItem }

export default function OrderCard({ order }: Props) {
    const s = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
    const time = new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <View style={[styles.card, { borderColor: s.border, borderLeftWidth: 4, borderLeftColor: s.border }]}>
            <View style={styles.header}>
                <Text style={styles.time}>{time}</Text>
                <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.border }]}>
                    <Text style={[styles.badgeText, { color: s.text }]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                </View>
            </View>
            {order.items.map((item, i) => (
                <View key={i} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>×{item.quantity}</Text>
                    <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{order.total}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff", borderRadius: s(12),
        padding: s(14), marginBottom: s(12),
        borderWidth: 1, borderColor: "#E5E7EB",
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: s(3), elevation: 1,
    },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: s(12) },
    time: { fontSize: sf(13), color: "#6B7280", fontWeight: "500" },
    badge: {
        borderRadius: s(6), paddingHorizontal: s(10), paddingVertical: s(3),
        borderWidth: 1,
    },
    badgeText: { fontSize: sf(12), fontWeight: "600" },
    itemRow: { flexDirection: "row", alignItems: "center", marginBottom: s(6) },
    itemName: { flex: 1, fontSize: sf(14), fontWeight: "500", color: "#374151" },
    itemQty: { fontSize: sf(13), color: "#6B7280", marginHorizontal: s(8) },
    itemPrice: { fontSize: sf(14), fontWeight: "600", color: "#111827" },
    divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: s(10) },
    totalRow: { flexDirection: "row", justifyContent: "space-between" },
    totalLabel: { fontSize: sf(14), fontWeight: "600", color: "#374151" },
    totalValue: { fontSize: sf(15), fontWeight: "700", color: "#0D6E4F" },
});
