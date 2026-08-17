import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View, Text, FlatList, StyleSheet,
    ActivityIndicator, TouchableOpacity, Alert,
} from "react-native";
import { s, sf } from "../../Extras/responsive";
import { io, Socket } from "socket.io-client";
import OrderCard, { OrderItem } from "../../components/Customer/Orders/OrderCard";
import { API, BASE_URL } from "../../Extras/api";
import { notifyOrderReady, notifyOrderDone, notifyOrderConfirmed, notifyOrderPreparing } from "../../features/notification";

const SERVER_URL = BASE_URL.replace("/api", "");

interface Props {
    sellerId: string;
    tableId: string;
}

export default function OrdersScreen({ sellerId, tableId }: Props) {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API.tableOrders}?sellerId=${sellerId}&tableId=${tableId}`);
            const data = await res.json();
            if (data.success) setOrders(data.orders);
        } catch (e) {
            if (__DEV__) console.error("[CustomerOrders] fetch error:", e);
        } finally {
            setLoading(false);
        }
    }, [sellerId, tableId]);

    // Socket: join table room + listen for status changes
    useEffect(() => {
        fetchOrders();

        const socket = io(SERVER_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("join:table", { sellerId, tableId });
        });

        socket.on("order:status", ({ orderId, status }: { orderId: string; status: OrderItem["status"] }) => {
            setOrders(prev => prev.map(o => {
                if (o._id !== orderId) return o;
                if (status === "confirmed") notifyOrderConfirmed();
                if (status === "preparing") notifyOrderPreparing();
                if (status === "ready")     notifyOrderReady();
                if (status === "done")      notifyOrderDone();
                return { ...o, status };
            }));
        });

        socket.on("disconnect", () => {
            if (__DEV__) console.log("[CustomerOrders] socket disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, [sellerId, tableId, fetchOrders]);

    // Request bill — uses the most recent non-done order
    const handleRequestBill = useCallback(async () => {
        const activeOrder = orders.find(o => o.status !== "done");
        if (!activeOrder) {
            Alert.alert("No active order", "There are no active orders to request a bill for.");
            return;
        }
        setRequesting(true);
        try {
            const res = await fetch(API.requestBill(activeOrder._id), { method: "POST" });
            const data = await res.json();
            if (data.success) {
                Alert.alert("Bill Requested", "The staff has been notified. They'll bring your bill shortly.");
            } else {
                Alert.alert("Error", data.message ?? "Could not request bill.");
            }
        } catch (e) {
            Alert.alert("Error", "Network error. Please try again.");
        } finally {
            setRequesting(false);
        }
    }, [orders]);

    const hasActiveOrders = orders.some(o => o.status !== "done");

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

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.refreshBtn} onPress={fetchOrders}>
                    <Text style={styles.refreshText}>Refresh</Text>
                </TouchableOpacity>
                {hasActiveOrders && (
                    <TouchableOpacity
                        style={[styles.billBtn, requesting && styles.btnDisabled]}
                        onPress={handleRequestBill}
                        disabled={requesting}
                    >
                        {requesting
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <Text style={styles.billText}>🧾 Request Bill</Text>
                        }
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    centered:  { flex: 1, alignItems: "center", justifyContent: "center" },
    listContent: { padding: s(12), paddingBottom: s(120) },
    empty: { alignItems: "center", justifyContent: "center", marginTop: s(80), gap: s(8) },
    emptyTitle: { fontSize: sf(18), fontWeight: "600", color: "#374151" },
    emptyHint:  { fontSize: sf(13), color: "#9CA3AF" },
    bottomBar: {
        position: "absolute", bottom: s(24), left: s(16), right: s(16),
        flexDirection: "row", gap: s(10),
    },
    refreshBtn: {
        flex: 1, backgroundColor: "#6B7280",
        paddingVertical: s(13), borderRadius: s(10), alignItems: "center",
    },
    refreshText: { color: "#fff", fontSize: sf(14), fontWeight: "600" },
    billBtn: {
        flex: 2, backgroundColor: "#0D6E4F",
        paddingVertical: s(13), borderRadius: s(10), alignItems: "center",
    },
    billText: { color: "#fff", fontSize: sf(14), fontWeight: "700" },
    btnDisabled: { opacity: 0.6 },
});
