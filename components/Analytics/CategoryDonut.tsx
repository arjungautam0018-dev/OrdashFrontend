import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useFocusEffect } from "@react-navigation/native";
import { s, sf } from "../../Extras/responsive";
import { authFetch } from "../../Extras/authFetch";
import { API } from "../../Extras/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Filter = "today" | "week" | "month" | "year";

const FILTERS: { key: Filter; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week",  label: "Week"  },
    { key: "month", label: "Month" },
    { key: "year",  label: "Year"  },
];

const COLORS = ["#6C63FF", "#22C55E", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#14B8A6", "#F97316"];

interface Segment { value: number; label: string; color: string; text?: string }

export default function CategoryDonut() {
    const [filter, setFilter]     = useState<Filter>("today");
    const [segments, setSegments] = useState<Segment[]>([]);
    const [selected, setSelected] = useState<Segment | null>(null);
    const [loading, setLoading]   = useState(false);

    const load = useCallback(async (f: Filter) => {
        setLoading(true);
        setSelected(null);
        const cacheKey = `analytics:categories:${f}`;
        const tsKey    = `analytics:categories:${f}:ts`;
        try {
            if (f !== "today") {
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) setSegments(JSON.parse(cached));

                const lastFetch = await AsyncStorage.getItem(tsKey);
                if (lastFetch === new Date().toDateString() && cached) {
                    setLoading(false);
                    return;
                }
            }

            const res  = await authFetch(`${API.analyticsCategories}?range=${f}`);
            const json = await res.json();
            if (json?.data) {
                const mapped: Segment[] = json.data.map((d: any, i: number) => ({
                    value: d.revenue ?? d.orders ?? 0,
                    label: d.category ?? d._id ?? "Other",
                    color: COLORS[i % COLORS.length],
                }));
                setSegments(mapped);
                if (f !== "today") {
                    await AsyncStorage.setItem(cacheKey, JSON.stringify(mapped));
                    await AsyncStorage.setItem(tsKey, new Date().toDateString());
                }
            }
        } catch (e) {
            console.error("[CategoryDonut] fetch error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(filter); }, [filter, load]);

    useFocusEffect(
        useCallback(() => {
            if (filter === "today") load("today");
        }, [filter, load])
    );

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    const centerLabel = selected
        ? `${selected.label}\n₹${selected.value}`
        : `Total\n₹${total}`;

    return (
        <View style={styles.card}>
            {/* Header */}
            <Text style={styles.title}>Revenue by Category</Text>

            {/* Filter tabs */}
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

            {loading && segments.length === 0 ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator color="#6C63FF" />
                </View>
            ) : segments.length === 0 ? (
                <View style={styles.loadingBox}>
                    <Text style={styles.emptyText}>No data for this period</Text>
                </View>
            ) : (
                <View style={styles.chartRow}>
                    {/* Donut */}
                    <PieChart
                        data={segments}
                        donut
                        radius={s(80)}
                        innerRadius={s(52)}
                        centerLabelComponent={() => (
                            <View style={styles.center}>
                                {centerLabel.split("\n").map((line, i) => (
                                    <Text key={i} style={i === 0 ? styles.centerLabel : styles.centerValue}>
                                        {line}
                                    </Text>
                                ))}
                            </View>
                        )}
                        onPress={(item: Segment) =>
                            setSelected(prev => prev?.label === item.label ? null : item)
                        }
                        focusOnPress
                        toggleFocusOnPress
                    />

                    {/* Legend */}
                    <View style={styles.legend}>
                        {segments.map((seg, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.legendItem}
                                onPress={() => setSelected(prev => prev?.label === seg.label ? null : seg)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.dot, { backgroundColor: seg.color }]} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.legendLabel} numberOfLines={1}>{seg.label}</Text>
                                    <Text style={styles.legendPct}>
                                        {total > 0 ? `${((seg.value / total) * 100).toFixed(1)}%` : "0%"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
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
    loadingBox:    { height: s(160), alignItems: "center", justifyContent: "center" },
    emptyText:     { fontSize: sf(13), color: "#9CA3AF" },
    chartRow:      { flexDirection: "row", alignItems: "center", gap: s(16) },
    center:        { alignItems: "center" },
    centerLabel:   { fontSize: sf(11), color: "#6B7280", fontWeight: "600" },
    centerValue:   { fontSize: sf(15), color: "#111827", fontWeight: "700" },
    legend:        { flex: 1, gap: s(8) },
    legendItem:    { flexDirection: "row", alignItems: "center", gap: s(8) },
    dot:           { width: s(10), height: s(10), borderRadius: s(5) },
    legendLabel:   { fontSize: sf(12), fontWeight: "600", color: "#374151" },
    legendPct:     { fontSize: sf(11), color: "#9CA3AF" },
});
