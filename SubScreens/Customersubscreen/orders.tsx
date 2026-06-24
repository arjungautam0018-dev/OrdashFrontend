import React, { useEffect, useState, useCallback } from "react";
import {
    View, Text, FlatList, StyleSheet,
    ActivityIndicator, TouchableOpacity,
} from "react-native";
import OrderCard, { OrderItem } from "../../components/Customer/Orders/OrderCard";

const BASE_URL = "http://10.120.18.143:3000/api";

interface Props {
    sellerId: string;
    tableId: string;
}

export default function OrdersScreen({ sellerId, tableId }: Props) {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        console.log(`[CustomerOrders] fetching orders — sellerId=${sellerId}, tableId=${tableId}`);
        console.log(`[CustomerOrders] URL: ${BASE_URL}/order/table?sellerId=${sellerId}&tableId=${tableId}`);
        try {
            const res = await fetch(`${BASE_URL}/order/table?sellerId=${sellerId}&tableId=${tableId}`);
            console.log(`[CustomerOrders] response status: ${res.status}`);
            const data = await res.json();
            console.log("[CustomerOrders] response body:", JSON.stringify(data).slice(0, 300));
            if (data.success) setOrders(data.orders);
        } catch (e) {
            console.error("[CustomerOrders] FETCH ERROR:", e);
        } finally {
            setLoading(false);
        }
    }, [sellerId, tableId]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0D6E4F" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={i => i._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>No orders yet</Text>
                        <Text style={styles.emptyHint}>Place an order from the Menu tab</Text>
                    </View>
                }
                renderItem={({ item }) => <OrderCard order={item} />}
            />
            <TouchableOpacity style={styles.refreshBtn} onPress={fetchOrders}>
                <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    centered: { flex: 1, alignItems: "center", justifyContent: "center" },
    listContent: { padding: 12, paddingBottom: 100 },
    empty: { alignItems: "center", justifyContent: "center", marginTop: 80, gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: "600", color: "#374151" },
    emptyHint: { fontSize: 13, color: "#9CA3AF" },
    refreshBtn: {
        position: "absolute", bottom: 24, alignSelf: "center",
        backgroundColor: "#0D6E4F", paddingVertical: 12, paddingHorizontal: 32,
        borderRadius: 10,
    },
    refreshText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
