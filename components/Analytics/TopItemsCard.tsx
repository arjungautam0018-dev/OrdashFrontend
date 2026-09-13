import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { s, sf } from "../../Extras/responsive";
import { authFetch } from "../../Extras/authFetch";
import { API } from "../../Extras/api";

type Filter = "today" | "week" | "month" | "year";

const FILTERS: { key: Filter; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week",  label: "Week"  },
    { key: "month", label: "Month" },
    { key: "year",  label: "Year"  },
];

const MEDALS = ["🥇", "🥈", "🥉"];

interface Item { name: string; count: number; revenue: number }

export default function TopItemsCard() {
    const [filter, setFilter]   = useState<Filter>("today");
    const [items, setItems]     = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async (f: Filter) => {
        setLoading(true);
        const cacheKey = `analytics:top-items:${f}`;
        const tsKey    = `analytics:top-items:${f}:ts`;
        try {
            if (f !== "today") {
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) setItems(JSON.parse(cached));

                const lastFetch = await AsyncStorage.getItem(tsKey);
                if (lastFetch === new Date().toDateString() && cached) {
                    setLoading(false);
                    return;
                }
            }

            const res  = await authFetch(`${API.analyticsTopItems}?range=${f}`);
            const json = await res.json();
            if (json?.data) {
                setItems(json.data);
                if (f !== "today") {
                    await AsyncStorage.setItem(cacheKey, JSON.stringify(json.data));
                    await AsyncStorage.setItem(tsKey, new Date().toDateString());
                }
            }
        } catch (e) {
            console.error("[TopItemsCard] fetch error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(filter); }, [filter, load]);

    const maxCount = items.length > 0 ? items[0].count : 1;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Top Selling Items</Text>

            <View style={styles.tabs}>
                {FILTERS.map(f => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.tab, filter === f.key && styles.tabActive]}
                        onPress={() => setFilter(f.key)}
                        activeOpacity={0.75}
                    >
                        <Text style={[styles.tabText, filter === f.key && styles.tabTextActive]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading && items.length === 0 ? (
                <View style={styles.empty}>
                    <ActivityIndicator color="#6C63FF" />
                </View>
            ) : items.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No orders in this period</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {items.map((item, i) => {
                        const barPct = (item.count / maxCount) * 100;
                        return (
                            <View key={i} style={styles.row}>
                                {/* rank */}
                                <Text style={styles.medal}>
                                    {i < 3 ? MEDALS[i] : `${i + 1}`}
                                </Text>

                                {/* name + bar */}
                                <View style={styles.mid}>
                                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                                    <View style={styles.barBg}>
                                        <View style={[styles.barFill, { width: `${barPct}%` as any }]} />
                                    </View>
                                </View>

                                {/* stats */}
                                <View style={styles.stats}>
                                    <Text style={styles.count}>{item.count}x</Text>
                                    <Text style={styles.revenue}>₹{item.revenue}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
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
    title: { fontSize: sf(14), fontWeight: "700", color: "#111827", marginBottom: s(12) },
    tabs:  { flexDirection: "row", gap: s(6), marginBottom: s(16) },
    tab: {
        paddingHorizontal: s(12), paddingVertical: s(5),
        borderRadius: s(20), backgroundColor: "#F3F4F6",
        borderWidth: 1, borderColor: "#E5E7EB",
    },
    tabActive:     { backgroundColor: "#6C63FF", borderColor: "#6C63FF" },
    tabText:       { fontSize: sf(12), fontWeight: "600", color: "#6B7280" },
    tabTextActive: { color: "#fff" },
    empty: { height: s(100), alignItems: "center", justifyContent: "center" },
    emptyText: { fontSize: sf(13), color: "#9CA3AF" },
    list:  { gap: s(12) },
    row:   { flexDirection: "row", alignItems: "center", gap: s(10) },
    medal: { fontSize: sf(16), width: s(28), textAlign: "center" },
    mid:   { flex: 1, gap: s(4) },
    name:  { fontSize: sf(13), fontWeight: "600", color: "#374151" },
    barBg: {
        height: s(5), backgroundColor: "#F3F4F6",
        borderRadius: s(4), overflow: "hidden",
    },
    barFill: {
        height: "100%", backgroundColor: "#6C63FF",
        borderRadius: s(4),
    },
    stats:   { alignItems: "flex-end", gap: s(2) },
    count:   { fontSize: sf(11), color: "#9CA3AF", fontWeight: "500" },
    revenue: { fontSize: sf(13), fontWeight: "700", color: "#111827" },
});
