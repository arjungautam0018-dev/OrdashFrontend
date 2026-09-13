import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet,
    ActivityIndicator, LayoutAnimation, Platform, UIManager,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { s, sf } from "../../Extras/responsive";
import { authFetch } from "../../Extras/authFetch";
import { API } from "../../Extras/api";

if (Platform.OS === "android") UIManager.setLayoutAnimationEnabledExperimental?.(true);

type Filter = "today" | "week" | "month" | "year";
const FILTERS: { key: Filter; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week",  label: "Week"  },
    { key: "month", label: "Month" },
    { key: "year",  label: "Year"  },
];

interface Row { tableId: string; tableName: string; orders: number; sessions: number }

const PREVIEW = 5;

export default function TableOrdersCard() {
    const [filter, setFilter]   = useState<Filter>("today");
    const [rows, setRows]       = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const load = useCallback(async (f: Filter) => {
        setLoading(true);
        const cacheKey = `analytics:table-orders:${f}`;
        const tsKey    = `analytics:table-orders:${f}:ts`;
        try {
            if (f !== "today") {
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) setRows(JSON.parse(cached));

                const lastFetch = await AsyncStorage.getItem(tsKey);
                if (lastFetch === new Date().toDateString() && cached) {
                    setLoading(false);
                    return;
                }
            }

            const res  = await authFetch(`${API.analyticsTableOrders}?range=${f}`);
            const json = await res.json();
            if (json?.data) {
                setRows(json.data);
                if (f !== "today") {
                    await AsyncStorage.setItem(cacheKey, JSON.stringify(json.data));
                    await AsyncStorage.setItem(tsKey, new Date().toDateString());
                }
            }
        } catch (e) {
            console.error("[TableOrdersCard]", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { setShowAll(false); load(filter); }, [filter, load]);

    const max     = rows.length > 0 ? rows[0].orders : 1;
    const visible = showAll ? rows : rows.slice(0, PREVIEW);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Orders by Table</Text>

            <View style={styles.tabs}>
                {FILTERS.map(f => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.tab, filter === f.key && styles.tabActive]}
                        onPress={() => setFilter(f.key)}
                        activeOpacity={0.75}
                    >
                        <Text style={[styles.tabText, filter === f.key && styles.tabTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading && rows.length === 0 ? (
                <View style={styles.empty}><ActivityIndicator color="#22C55E" /></View>
            ) : rows.length === 0 ? (
                <View style={styles.empty}><Text style={styles.emptyText}>No data for this period</Text></View>
            ) : (
                <>
                    <View style={styles.list}>
                        {visible.map((row) => {
                            const pct = (row.orders / max) * 100;
                            return (
                                <View key={row.tableId} style={styles.row}>
                                    <Text style={styles.label} numberOfLines={1}>{row.tableName}</Text>
                                    <View style={styles.barWrap}>
                                        <View style={styles.barBg}>
                                            <View style={[styles.barFill, { width: `${pct}%` as any }]} />
                                        </View>
                                        <Text style={styles.value}>{row.orders}</Text>
                                    </View>
                                    <Text style={styles.sub}>{row.sessions} {row.sessions === 1 ? "visit" : "visits"}</Text>
                                </View>
                            );
                        })}
                    </View>

                    {rows.length > PREVIEW && (
                        <TouchableOpacity
                            style={styles.viewAll}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                setShowAll(v => !v);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.viewAllText}>
                                {showAll ? "Show less ▲" : `View all ${rows.length} tables ▼`}
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff", borderRadius: s(14), padding: s(18), marginBottom: s(14),
        shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: s(6), elevation: 2,
    },
    title:         { fontSize: sf(14), fontWeight: "700", color: "#111827", marginBottom: s(12) },
    tabs:          { flexDirection: "row", gap: s(6), marginBottom: s(16) },
    tab:           { paddingHorizontal: s(12), paddingVertical: s(5), borderRadius: s(20), backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB" },
    tabActive:     { backgroundColor: "#22C55E", borderColor: "#22C55E" },
    tabText:       { fontSize: sf(12), fontWeight: "600", color: "#6B7280" },
    tabTextActive: { color: "#fff" },
    empty:         { height: s(100), alignItems: "center", justifyContent: "center" },
    emptyText:     { fontSize: sf(13), color: "#9CA3AF" },
    list:          { gap: s(12) },
    row:           { gap: s(4) },
    label:         { fontSize: sf(13), fontWeight: "600", color: "#374151" },
    barWrap:       { flexDirection: "row", alignItems: "center", gap: s(8) },
    barBg:         { flex: 1, height: s(10), backgroundColor: "#F3F4F6", borderRadius: s(5), overflow: "hidden" },
    barFill:       { height: "100%", backgroundColor: "#22C55E", borderRadius: s(5) },
    value:         { fontSize: sf(13), fontWeight: "700", color: "#111827", minWidth: s(36), textAlign: "right" },
    sub:           { fontSize: sf(11), color: "#9CA3AF" },
    viewAll:       { marginTop: s(12), alignItems: "center", paddingVertical: s(8) },
    viewAllText:   { fontSize: sf(13), color: "#22C55E", fontWeight: "600" },
});
