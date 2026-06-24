import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl,
} from "react-native";
import SellerOrderCard, { SellerOrder, OrderStatus } from "./SellerOrderCard";
import { API } from "../../Extras/api";

const POLL_MS = 15000;

type FilterTab = "active" | "done" | "all";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "done",   label: "Done"   },
    { key: "all",    label: "All"    },
];

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready"];

export default function SellerOrdersSection() {
    const [orders, setOrders] = useState<SellerOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<FilterTab>("active");
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchOrders = useCallback(async (silent = false) => {
        console.log(`[SellerOrders] fetchOrders called — silent=${silent}`);
        console.log(`[SellerOrders] hitting URL: ${API.sellerOrders}`);
        if (!silent) setRefreshing(true);
        try {
            console.log("[SellerOrders] sending fetch...");
            const res = await fetch(API.sellerOrders, { credentials: "include" });
            console.log(`[SellerOrders] response status: ${res.status}`);
            const data = await res.json();
            console.log("[SellerOrders] response body:", JSON.stringify(data).slice(0, 300));
            if (data.success) {
                console.log(`[SellerOrders] got ${data.orders.length} orders`);
                setOrders(data.orders);
            } else {
                console.warn("[SellerOrders] success=false:", data.message);
            }
        } catch (e) {
            console.error("[SellerOrders] FETCH ERROR:", e);
            console.error("[SellerOrders] URL was:", API.sellerOrders);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        console.log("[SellerOrders] component mounted, starting initial fetch + poll");
        fetchOrders(false);
        pollRef.current = setInterval(() => fetchOrders(true), POLL_MS);
        return () => {
            console.log("[SellerOrders] component unmounted, clearing poll");
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [fetchOrders]);

    const handleStatusChange = useCallback(async (orderId: string, newStatus: OrderStatus) => {
        const url = API.updateOrderStatus(orderId);
        console.log(`[SellerOrders] updating order ${orderId} → ${newStatus}`);
        console.log(`[SellerOrders] PATCH URL: ${url}`);
        try {
            const res = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });
            console.log(`[SellerOrders] status update response: ${res.status}`);
            const data = await res.json();
            console.log("[SellerOrders] status update body:", JSON.stringify(data));
            if (data.success) {
                setOrders(prev =>
                    prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
                );
            } else {
                console.warn("[SellerOrders] status update failed:", data.message);
            }
        } catch (e) {
            console.error("[SellerOrders] STATUS UPDATE ERROR:", e);
        }
    }, []);

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
                            {filter === "active" ? "New orders will appear here" : "No completed orders yet"}
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

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    centered: { flex: 1, alignItems: "center", justifyContent: "center" },

    tabRow: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 4,
        gap: 8,
    },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        gap: 5,
    },
    tabActive: {
        backgroundColor: "#6C63FF",
        borderColor: "#6C63FF",
    },
    tabText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6B7280",
    },
    tabTextActive: {
        color: "#fff",
    },
    countBadge: {
        backgroundColor: "#EF4444",
        borderRadius: 8,
        minWidth: 18,
        height: 18,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
    },
    countText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },

    listContent: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 100 },

    empty: { alignItems: "center", marginTop: 60, gap: 8 },
    emptyTitle: { fontSize: 16, fontWeight: "600", color: "#374151" },
    emptyHint: { fontSize: 13, color: "#9CA3AF" },
});
