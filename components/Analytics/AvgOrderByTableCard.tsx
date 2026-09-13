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

interface Row { tableId: string; tableName: string; avgOrderValue: number; orders: number }

const PREVIEW = 5;

export default function AvgOrderByTableCard() {
    const [filter, setFilter]   = useState<Filter>("today");
    const [rows, setRows]       = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const load = useCallback(async (f: Filter) => {
        setLoading(true);
        const cacheKey = `analytics:avg-order-by-table:${f}`;
        const tsKey    = `analytics:avg-order-by-table:${f}:ts`;
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

            const res  = await authFetch(`${API.analyticsAvgOrderByTable}?range=${f}`);
            const json = await res.json();
            if (json?.data) {
                setRows(json.data);
                if (f !== "today") {
                    await AsyncStorage.setItem(cacheKey, JSON.stringify(json.data));
                    await AsyncStorage.setItem(tsKey, new Date().toDateString());
                }
            }
        } catch (e) {
            console.error("[AvgOrderByTableCard]", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { setShowAll(false); load(filter); }, [filter, load]);

    const max        = rows.length > 0 ? rows[0].avgOrderValue : 1;
    const overallAvg = rows.length > 0
        ? rows.reduce((s, r) => s + r.avgOrderValue, 0) / rows.length
        : 0;
    const visible    = showAll ? rows : rows.slice(0, PREVIEW);

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Avg Order Value by Table</Text>
                {overallAvg > 0 && (
                    <View style={styles.avgBadge}>
                        <Text style={styles.avgLabel}>overall avg</Text>
                        <Text style={styles.avgValue}>₹{Math.round(overallAvg)}</Text>
                    </View>
                )}
            </View>

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
                <View style={styles.empty}><ActivityIndicator color="#3B82F6" /></View>
            ) : rows.length === 0 ? (
                <View style={styles.empty}><Text style={styles.emptyText}>No data for this period</Text></View>
            ) : (
                <>
                    <View style={styles.list}>
                        {visible.map((row) => {
                            const pct      = (row.avgOrderValue / max) * 100;
                            const aboveAvg = row.avgOrderValue >= overallAvg;
                            return (
                                <View key={row.tableId} style={styles.row}>
                                    <Text style={styles.label} numberOfLines={1}>{row.tableName}</Text>
                                    <View style={styles.barWrap}>
                                        <View style={styles.barBg}>
                                            <View style={[
                                                styles.barFill,
                                                { width: `${pct}%` as any },
                                                aboveAvg ? styles.barFillHigh : styles.barFillLow,
                                            ]} />
                                        </View>
                                        <Text style={styles.value}>₹{Math.round(row.avgOrderValue)}</Text>
                                        <View style={[styles.badge, aboveAvg ? styles.badgeGreen : styles.badgeRed]}>
                                            <Text style={[styles.badgeText, aboveAvg ? styles.badgeTextGreen : styles.badgeTextRed]}>
                                                {aboveAvg ? "↑" : "↓"}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.sub}>{row.orders} orders</Text>
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
    headerRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: s(12) },
    title:          { fontSize: sf(14), fontWeight: "700", color: "#111827", flex: 1 },
    avgBadge:       { alignItems: "flex-end" },
    avgLabel:       { fontSize: sf(9), color: "#9CA3AF" },
    avgValue:       { fontSize: sf(13), fontWeight: "700", color: "#3B82F6" },
    tabs:           { flexDirection: "row", gap: s(6), marginBottom: s(16) },
    tab:            { paddingHorizontal: s(12), paddingVertical: s(5), borderRadius: s(20), backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB" },
    tabActive:      { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
    tabText:        { fontSize: sf(12), fontWeight: "600", color: "#6B7280" },
    tabTextActive:  { color: "#fff" },
    empty:          { height: s(100), alignItems: "center", justifyContent: "center" },
    emptyText:      { fontSize: sf(13), color: "#9CA3AF" },
    list:           { gap: s(12) },
    row:            { gap: s(4) },
    label:          { fontSize: sf(13), fontWeight: "600", color: "#374151" },
    barWrap:        { flexDirection: "row", alignItems: "center", gap: s(6) },
    barBg:          { flex: 1, height: s(10), backgroundColor: "#F3F4F6", borderRadius: s(5), overflow: "hidden" },
    barFill:        { height: "100%", borderRadius: s(5) },
    barFillHigh:    { backgroundColor: "#3B82F6" },
    barFillLow:     { backgroundColor: "#93C5FD" },
    value:          { fontSize: sf(13), fontWeight: "700", color: "#111827", minWidth: s(52), textAlign: "right" },
    badge:          { width: s(20), height: s(20), borderRadius: s(10), alignItems: "center", justifyContent: "center" },
    badgeGreen:     { backgroundColor: "#DCFCE7" },
    badgeRed:       { backgroundColor: "#FEE2E2" },
    badgeText:      { fontSize: sf(11), fontWeight: "800" },
    badgeTextGreen: { color: "#16A34A" },
    badgeTextRed:   { color: "#DC2626" },
    sub:            { fontSize: sf(11), color: "#9CA3AF" },
    viewAll:        { marginTop: s(12), alignItems: "center", paddingVertical: s(8) },
    viewAllText:    { fontSize: sf(13), color: "#3B82F6", fontWeight: "600" },
});
