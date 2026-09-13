import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet,
    ActivityIndicator, LayoutAnimation, Platform, UIManager,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
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

interface Row { name: string; revenue: number; count: number; category: string }

const PREVIEW = 5;

export default function HighestRevenueCard() {
    const [filter, setFilter]     = useState<Filter>("today");
    const [rows, setRows]         = useState<Row[]>([]);
    const [loading, setLoading]   = useState(false);
    const [showAll, setShowAll]   = useState(false);
    const [selected, setSelected] = useState<string | null>(null); // selected product name

    const load = useCallback(async (f: Filter) => {
        setLoading(true);
        setSelected(null);
        const cacheKey = `analytics:highest-revenue:${f}`;
        const tsKey    = `analytics:highest-revenue:${f}:ts`;
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

            const res  = await authFetch(`${API.analyticsHighestRevenue}?range=${f}`);
            const json = await res.json();
            if (json?.data) {
                setRows(json.data);
                if (f !== "today") {
                    await AsyncStorage.setItem(cacheKey, JSON.stringify(json.data));
                    await AsyncStorage.setItem(tsKey, new Date().toDateString());
                }
            }
        } catch (e) {
            console.error("[HighestRevenueCard]", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { setShowAll(false); setSelected(null); load(filter); }, [filter, load]);

    useFocusEffect(
        useCallback(() => {
            if (filter === "today") load("today");
        }, [filter, load])
    );

    const max     = rows.length > 0 ? rows[0].revenue : 1;
    const visible = showAll ? rows : rows.slice(0, PREVIEW);
    const hasSelection = selected !== null;

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Top Products by Revenue</Text>

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
                <View style={styles.empty}><ActivityIndicator color="#F59E0B" /></View>
            ) : rows.length === 0 ? (
                <View style={styles.empty}><Text style={styles.emptyText}>No data for this period</Text></View>
            ) : (
                <>
                    {/* Y-axis scale labels */}
                    <View style={styles.scaleRow}>
                        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                            <Text key={i} style={styles.scaleLabel}>
                                {max * pct >= 1000
                                    ? `₹${((max * pct) / 1000).toFixed(0)}K`
                                    : `₹${Math.round(max * pct)}`}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.list}>
                        {visible.map((row) => {
                            const pct        = (row.revenue / max) * 100;
                            const isSelected = selected === row.name;
                            const isDimmed   = hasSelection && !isSelected;

                            return (
                                <TouchableOpacity
                                    key={row.name}
                                    style={[styles.row, isDimmed && styles.rowDimmed]}
                                    onPress={() => setSelected(prev => prev === row.name ? null : row.name)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.label, isDimmed && styles.labelDimmed]} numberOfLines={1}>
                                        {row.name}
                                    </Text>

                                    <View style={styles.barWrap}>
                                        <View style={styles.barBg}>
                                            <View style={[
                                                styles.barFill,
                                                { width: `${pct}%` as any },
                                                isSelected && styles.barFillSelected,
                                                isDimmed   && styles.barFillDimmed,
                                            ]} />
                                        </View>
                                        <Text style={[styles.value, isDimmed && styles.valueDimmed]}>
                                            ₹{row.revenue >= 1000
                                                ? `${(row.revenue / 1000).toFixed(1)}K`
                                                : row.revenue.toLocaleString()}
                                        </Text>
                                    </View>

                                    {/* expanded detail on selection */}
                                    {isSelected && (
                                        <View style={styles.detail}>
                                            <View style={styles.detailChip}>
                                                <Text style={styles.detailLabel}>Qty sold</Text>
                                                <Text style={styles.detailValue}>{row.count}</Text>
                                            </View>
                                            <View style={styles.detailChip}>
                                                <Text style={styles.detailLabel}>Category</Text>
                                                <Text style={styles.detailValue}>{row.category}</Text>
                                            </View>
                                            <View style={styles.detailChip}>
                                                <Text style={styles.detailLabel}>Avg price</Text>
                                                <Text style={styles.detailValue}>
                                                    ₹{row.count > 0 ? Math.round(row.revenue / row.count) : 0}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
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
                                {showAll ? "Show less ▲" : `View all ${rows.length} products ▼`}
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
    tabs:          { flexDirection: "row", gap: s(6), marginBottom: s(12) },
    tab:           { paddingHorizontal: s(12), paddingVertical: s(5), borderRadius: s(20), backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB" },
    tabActive:     { backgroundColor: "#F59E0B", borderColor: "#F59E0B" },
    tabText:       { fontSize: sf(12), fontWeight: "600", color: "#6B7280" },
    tabTextActive: { color: "#fff" },
    empty:         { height: s(100), alignItems: "center", justifyContent: "center" },
    emptyText:     { fontSize: sf(13), color: "#9CA3AF" },

    // scale
    scaleRow:   { flexDirection: "row", justifyContent: "space-between", marginBottom: s(8), paddingLeft: s(90) },
    scaleLabel: { fontSize: sf(9), color: "#9CA3AF" },

    // rows
    list:          { gap: s(10) },
    row:           { gap: s(4) },
    rowDimmed:     { opacity: 0.35 },
    label:         { fontSize: sf(13), fontWeight: "600", color: "#374151" },
    labelDimmed:   { color: "#9CA3AF" },
    barWrap:       { flexDirection: "row", alignItems: "center", gap: s(8) },
    barBg:         { flex: 1, height: s(12), backgroundColor: "#F3F4F6", borderRadius: s(6), overflow: "hidden" },
    barFill:       { height: "100%", backgroundColor: "#F59E0B", borderRadius: s(6) },
    barFillSelected: { backgroundColor: "#D97706" },
    barFillDimmed:   { backgroundColor: "#D1D5DB" },
    value:         { fontSize: sf(12), fontWeight: "700", color: "#111827", minWidth: s(52), textAlign: "right" },
    valueDimmed:   { color: "#9CA3AF" },

    // expanded detail
    detail:      { flexDirection: "row", gap: s(8), marginTop: s(4) },
    detailChip:  { flex: 1, backgroundColor: "#FFFBEB", borderRadius: s(8), padding: s(8), alignItems: "center", borderWidth: 1, borderColor: "#FDE68A" },
    detailLabel: { fontSize: sf(10), color: "#92400E", fontWeight: "500" },
    detailValue: { fontSize: sf(13), fontWeight: "700", color: "#D97706", marginTop: s(2) },

    viewAll:     { marginTop: s(12), alignItems: "center", paddingVertical: s(8) },
    viewAllText: { fontSize: sf(13), color: "#F59E0B", fontWeight: "600" },
});
