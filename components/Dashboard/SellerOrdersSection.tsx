import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl,
} from "react-native";
import { s, sf } from "../../Extras/responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SellerOrderCard, { SellerOrder, OrderStatus } from "./SellerOrderCard";
import { API } from "../../Extras/api";
import { notifyNewOrder, notifyBillRequested } from "../../features/notification";

type FilterTab = "active" | "done" | "all";
const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "done",   label: "Done"   },
    { key: "all",    label: "All"    },
];
const ACTIVE_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready"];

export default function SellerOrdersSection() {
    const [orders, setOrders]       = useState<SellerOrder[]>([]);
    const [loading, setLoading]     = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter]       = useState<FilterTab>("active");
    const xhrRef = useRef<XMLHttpRequest | null>(null);


    // ── Initial REST fetch ─────────────────────────────────────────────────────
    const fetchOrders = useCallback(async (silent = false) => {
        if (__DEV__) console.log(`[SellerOrders] REST fetch — silent=${silent}`);
        if (!silent) setRefreshing(true);
        try {
            const raw = await AsyncStorage.getItem("session");
            const token = raw ? JSON.parse(raw)?.token : null;
            const res = await fetch(API.sellerOrders, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            } else {
                if (__DEV__) console.warn("[SellerOrders] REST failed:", data.message);
            }
        } catch (e) {
            if (__DEV__) console.error("[SellerOrders] REST error:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(false);
    }, [fetchOrders]);

    useEffect(() => {
        AsyncStorage.getItem("session").then(raw => {
            const sellerId = raw ? JSON.parse(raw)?.sellerId : null;
            if (!sellerId) {
                if (__DEV__) console.warn("[SellerOrders] No sellerId found in session");
                return;
            }
            const url = API.sellerEvents(sellerId);
            const xhr = new XMLHttpRequest();
            (xhr as any).seenBytes = 0;
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Accept", "text/event-stream");

            xhr.onreadystatechange = () => {
                if (xhr.readyState >= 3 && xhr.status === 200) {
                    const newData = xhr.responseText.slice((xhr as any).seenBytes);
                    (xhr as any).seenBytes = xhr.responseText.length;
                    for (const line of newData.split("\n")) {
                        if (!line.startsWith("data: ")) continue;
                        try {
                            const payload = JSON.parse(line.slice(6));
                            if (payload.event === "order:new") {
                                notifyNewOrder(payload.order.tableName, payload.order.total);
                                setOrders(prev => [payload.order, ...prev]);
                            } else if (payload.event === "order:status") {
                                setOrders(prev =>
                                    prev.map(o =>
                                        o._id === payload.orderId ? { ...o, status: payload.status } : o
                                    )
                                );
                            } else if (payload.event === "order:bill") {
                                notifyBillRequested(payload.tableName);
                            }
                        } catch { /* ignore malformed */ }
                    }
                }
            };

            xhr.send();
            xhrRef.current = xhr;
        });
        return () => {
            xhrRef.current?.abort();
            xhrRef.current = null;
        };
    }, []);

    // ── Status update ──────────────────────────────────────────────────────────
    const handleStatusChange = useCallback(async (orderId: string, newStatus: OrderStatus) => {
        try {
            const raw = await AsyncStorage.getItem("session");
            const token = raw ? JSON.parse(raw)?.token : null;
            const res = await fetch(API.updateOrderStatus(orderId), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            } else {
                if (__DEV__) console.warn("[SellerOrders] status update failed:", data.message);
            }
        } catch (e) {
            if (__DEV__) console.error("[SellerOrders] status update error:", e);
        }
    }, []);

    // ── Filter ─────────────────────────────────────────────────────────────────
    const filtered = orders.filter(o => {
        if (filter === "active") return ACTIVE_STATUSES.includes(o.status);
        if (filter === "done")   return o.status === "done";
        return true;
    });
    const activeCount = orders.filter(o => ACTIVE_STATUSES.includes(o.status)).length;

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            {/* Filter tabs */}
            <View style={styles.tabRow}>
                {FILTER_TABS.map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, filter === tab.key && styles.tabActive]}
                        onPress={() => setFilter(tab.key)}
                        activeOpacity={0.75}
                    >
                        <Text style={[styles.tabText, filter === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                        {tab.key === "active" && activeCount > 0 && (
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{activeCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filtered}
                keyExtractor={o => o._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchOrders(false)}
                        colors={["#6C63FF"]}
                        tintColor="#6C63FF"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>No orders here</Text>
                        <Text style={styles.emptyHint}>
                            {filter === "active" ? "New orders will appear instantly" : "No completed orders yet"}
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <SellerOrderCard order={item} onStatusChange={handleStatusChange} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    centered: { flex: 1, alignItems: "center", justifyContent: "center" },

    tabRow: {
        flexDirection: "row",
        paddingHorizontal: s(12), paddingTop: s(8), paddingBottom: s(4),
        gap: s(8),
    },
    tab: {
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: s(14), paddingVertical: s(7),
        borderRadius: s(20), backgroundColor: "#F3F4F6",
        borderWidth: 1, borderColor: "#E5E7EB", gap: s(5),
    },
    tabActive: { backgroundColor: "#6C63FF", borderColor: "#6C63FF" },
    tabText: { fontSize: sf(13), fontWeight: "600", color: "#6B7280" },
    tabTextActive: { color: "#fff" },
    countBadge: {
        backgroundColor: "#EF4444", borderRadius: s(8),
        minWidth: s(18), height: s(18),
        alignItems: "center", justifyContent: "center", paddingHorizontal: s(4),
    },
    countText: { color: "#fff", fontSize: sf(10), fontWeight: "700" },

    listContent: { paddingHorizontal: s(12), paddingTop: s(8), paddingBottom: s(100) },
    empty: { alignItems: "center", marginTop: s(60), gap: s(8) },
    emptyTitle: { fontSize: sf(16), fontWeight: "600", color: "#374151" },
    emptyHint: { fontSize: sf(13), color: "#9CA3AF" },
});
