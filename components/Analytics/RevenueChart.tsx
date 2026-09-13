import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
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

const WIDTH = Dimensions.get("window").width - s(64);

function LiveDot() {
    return (
        <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
        </View>
    );
}

export default function RevenueChart() {
    const [filter, setFilter]   = useState<Filter>("today");
    const [points, setPoints]   = useState<{ value: number; label?: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async (f: Filter) => {
        setLoading(true);
        const cacheKey = `analytics:revenue:${f}`;
        const tsKey    = `analytics:revenue:${f}:ts`;
        try {
            if (f !== "today") {
                // show stale instantly, skip network if fetched today
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) setPoints(JSON.parse(cached));

                const lastFetch = await AsyncStorage.getItem(tsKey);
                if (lastFetch === new Date().toDateString() && cached) {
                    setLoading(false);
                    return;
                }
            }

            const res  = await authFetch(`${API.analyticsRevenue}?range=${f}`);
            const json = await res.json();
            if (json?.data) {
                const mapped = json.data.map((d: any) => ({
                    value: d.revenue ?? 0,
                    label: d.label ?? d.date ?? "",
                }));
                setPoints(mapped);
                if (f !== "today") {
                    await AsyncStorage.setItem(cacheKey, JSON.stringify(mapped));
                    await AsyncStorage.setItem(tsKey, new Date().toDateString());
                }
            }
        } catch (e) {
            console.error("[RevenueChart] fetch error:", e);
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

    return (
        <View style={styles.card}>
            {/* Title */}
            <View style={styles.titleRow}>
                <Text style={styles.title}>Revenue over time</Text>
                {filter === "today" && <LiveDot />}
            </View>

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

            {/* Chart */}
            {loading && points.length === 0 ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator color="#6C63FF" />
                </View>
            ) : points.length === 0 ? (
                <View style={styles.loadingBox}>
                    <Text style={styles.emptyText}>No data for this period</Text>
                </View>
            ) : (
                <LineChart
                    data={points}
                    width={WIDTH}
                    height={s(160)}
                    color="#6C63FF"
                    thickness={2}
                    startFillColor="#6C63FF"
                    endFillColor="rgba(108,99,255,0.05)"
                    startOpacity={0.3}
                    endOpacity={0.01}
                    areaChart
                    hideDataPoints={points.length > 15}
                    dataPointsColor="#6C63FF"
                    dataPointsRadius={s(4)}
                    curved
                    yAxisTextStyle={{ color: "#9CA3AF", fontSize: sf(10) }}
                    xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: sf(9) }}
                    noOfSections={4}
                    rulesColor="#F3F4F6"
                    rulesType="solid"
                    hideRules={false}
                    yAxisColor="transparent"
                    xAxisColor="#E5E7EB"
                    formatYLabel={(v) => `₹${Number(v) >= 1000 ? `${(Number(v)/1000).toFixed(1)}k` : v}`}
                    showVerticalLines={false}
                    focusEnabled
                    showTextOnFocus
                />
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
    titleRow: { flexDirection: "row", alignItems: "center", gap: s(6), marginBottom: s(12) },
    title:   { fontSize: sf(14), fontWeight: "700", color: "#111827" },
    liveRow: { flexDirection: "row", alignItems: "center", gap: s(5) },
    liveDot: {
        width: s(7), height: s(7), borderRadius: s(4),
        backgroundColor: "#22C55E",
    },
    liveText: { fontSize: sf(10), fontWeight: "700", color: "#22C55E" },
    tabs:  { flexDirection: "row", gap: s(6), marginBottom: s(16) },
    tab: {
        paddingHorizontal: s(12), paddingVertical: s(5),
        borderRadius: s(20), backgroundColor: "#F3F4F6",
        borderWidth: 1, borderColor: "#E5E7EB",
    },
    tabActive:     { backgroundColor: "#6C63FF", borderColor: "#6C63FF" },
    tabText:       { fontSize: sf(12), fontWeight: "600", color: "#6B7280" },
    tabTextActive: { color: "#fff" },
    loadingBox: {
        height: s(160), alignItems: "center", justifyContent: "center",
    },
    emptyText: { fontSize: sf(13), color: "#9CA3AF" },
});
