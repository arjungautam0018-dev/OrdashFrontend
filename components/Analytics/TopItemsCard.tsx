import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, sf } from "../../Extras/responsive";

// TODO: wire data from GET /api/analytics/top-items
// Data shape: [{ name: "Butter Chicken", count: 42, revenue: 5040 }, ...]

interface Props {
    items: { name: string; count: number; revenue: number }[];
}

export default function TopItemsCard({ items }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Top selling items</Text>
            {items.length === 0 ? (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>🍽️ Item data coming soon</Text>
                    <Text style={styles.placeholderSub}>Wire GET /api/analytics/top-items</Text>
                </View>
            ) : (
                items.map((item, i) => (
                    <View key={i} style={styles.row}>
                        <View style={styles.rank}>
                            <Text style={styles.rankText}>{i + 1}</Text>
                        </View>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.right}>
                            <Text style={styles.count}>{item.count}x</Text>
                            <Text style={styles.revenue}>₹{item.revenue}</Text>
                        </View>
                    </View>
                ))
            )}
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
        height: s(100), backgroundColor: "#F9FAFB", borderRadius: s(10),
        borderWidth: 1, borderColor: "#E5E7EB", borderStyle: "dashed",
        alignItems: "center", justifyContent: "center", gap: s(6),
    },
    placeholderText: { fontSize: sf(14) },
    placeholderSub:  { fontSize: sf(11), color: "#9CA3AF" },
    row: {
        flexDirection: "row", alignItems: "center",
        paddingVertical: s(10), borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
    },
    rank: {
        width: s(24), height: s(24), borderRadius: s(12),
        backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center",
        marginRight: s(10),
    },
    rankText: { fontSize: sf(11), fontWeight: "700", color: "#6C63FF" },
    name:    { flex: 1, fontSize: sf(14), fontWeight: "500", color: "#374151" },
    right:   { alignItems: "flex-end" },
    count:   { fontSize: sf(12), color: "#9CA3AF" },
    revenue: { fontSize: sf(13), fontWeight: "600", color: "#111827" },
});
