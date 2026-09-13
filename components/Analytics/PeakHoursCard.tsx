import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet,
    ActivityIndicator, ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { s, sf } from "../../Extras/responsive";
import { authFetch } from "../../Extras/authFetch";
import { API } from "../../Extras/api";

interface HourSlot { hour: number; orders: number }

// Build a full 24-slot array, filling missing hours with 0
function buildSlots(raw: { _id: number; orders: number }[]): HourSlot[] {
    const map: Record<number, number> = {};
    raw.forEach(r => { map[r._id] = r.orders; });
    return Array.from({ length: 24 }, (_, h) => ({ hour: h, orders: map[h] ?? 0 }));
}

function fmtHour(h: number): string {
    if (h === 0)  return "12a";
    if (h < 12)   return `${h}a`;
    if (h === 12) return "12p";
    return `${h - 12}p`;
}

function intensity(orders: number, max: number): string {
    if (max === 0 || orders === 0) return "#F3F4F6";
    const pct = orders / max;
    if (pct >= 0.85) return "#6C63FF";
    if (pct >= 0.6)  return "#8B85FF";
    if (pct >= 0.35) return "#B5B0FF";
    return "#DDD9FF";
}

export default function PeakHoursCard() {
    const [slots, setSlots]     = useState<HourSlot[]>([]);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const cacheKey = "analytics:peak-hours";
        const tsKey    = "analytics:peak-hours:ts";
        try {
            const cached = await AsyncStorage.getItem(cacheKey);
            if (cached) setSlots(JSON.parse(cached));

            const lastFetch = await AsyncStorage.getItem(tsKey);
            if (lastFetch === new Date().toDateString() && cached) {
                setLoading(false);
                return;
            }

            const res  = await authFetch(API.analyticsPeakHours);
            const json = await res.json();
            if (json?.data) {
                const built = buildSlots(json.data);
                setSlots(built);
                await AsyncStorage.setItem(cacheKey, JSON.stringify(built));
                await AsyncStorage.setItem(tsKey, new Date().toDateString());
            }
        } catch (e) {
            console.error("[PeakHoursCard] fetch error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const max      = slots.reduce((m, s) => Math.max(m, s.orders), 0);
    const peak     = slots.find(s => s.orders === max);
    const total    = slots.reduce((s, h) => s + h.orders, 0);
    const busySlots = slots.filter(s => s.orders > 0).length;

    // split into AM (0-11) and PM (12-23)
    const am = slots.slice(0, 12);
    const pm = slots.slice(12, 24);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Peak Hours</Text>
            <Text style={styles.subtitle}>Order distribution across the day (all-time)</Text>

            {loading && slots.length === 0 ? (
                <View style={styles.empty}><ActivityIndicator color="#6C63FF" /></View>
            ) : total === 0 ? (
                <View style={styles.empty}><Text style={styles.emptyText}>No order data yet</Text></View>
            ) : (
                <>
                    {/* Summary pills */}
                    <View style={styles.pills}>
                        <View style={styles.pill}>
                            <Text style={styles.pillValue}>{fmtHour(peak?.hour ?? 0)}</Text>
                            <Text style={styles.pillLabel}>Peak hour</Text>
                        </View>
                        <View style={[styles.pill, styles.pillGreen]}>
                            <Text style={[styles.pillValue, styles.pillValueGreen]}>{peak?.orders ?? 0}</Text>
                            <Text style={styles.pillLabel}>Orders at peak</Text>
                        </View>
                        <View style={[styles.pill, styles.pillAmber]}>
                            <Text style={[styles.pillValue, styles.pillValueAmber]}>{busySlots}</Text>
                            <Text style={styles.pillLabel}>Active hours</Text>
                        </View>
                    </View>

                    {/* Heatmap grid */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>AM</Text>
                        <View style={styles.grid}>
                            {am.map(slot => (
                                <View key={slot.hour} style={styles.cell}>
                                    <View style={[styles.block, { backgroundColor: intensity(slot.orders, max) }]}>
                                        {slot.orders > 0 && slot.orders === max && (
                                            <Text style={styles.peakDot}>●</Text>
                                        )}
                                    </View>
                                    <Text style={styles.hourLabel}>{fmtHour(slot.hour)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>PM</Text>
                        <View style={styles.grid}>
                            {pm.map(slot => (
                                <View key={slot.hour} style={styles.cell}>
                                    <View style={[styles.block, { backgroundColor: intensity(slot.orders, max) }]}>
                                        {slot.orders > 0 && slot.orders === max && (
                                            <Text style={styles.peakDot}>●</Text>
                                        )}
                                    </View>
                                    <Text style={styles.hourLabel}>{fmtHour(slot.hour)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Legend */}
                    <View style={styles.legend}>
                        <Text style={styles.legendLabel}>Less</Text>
                        {["#F3F4F6", "#DDD9FF", "#B5B0FF", "#8B85FF", "#6C63FF"].map((c, i) => (
                            <View key={i} style={[styles.legendBlock, { backgroundColor: c }]} />
                        ))}
                        <Text style={styles.legendLabel}>More</Text>
                    </View>

                    {/* Top 3 hours list */}
                    <View style={styles.topList}>
                        <Text style={styles.topTitle}>Busiest hours</Text>
                        {[...slots]
                            .sort((a, b) => b.orders - a.orders)
                            .slice(0, 3)
                            .map((slot, i) => (
                                <View key={i} style={styles.topRow}>
                                    <Text style={styles.topRank}>{["🥇", "🥈", "🥉"][i]}</Text>
                                    <Text style={styles.topHour}>{fmtHour(slot.hour)} — {slot.hour < 12 ? "Morning" : slot.hour < 17 ? "Afternoon" : "Evening"}</Text>
                                    <View style={styles.topRight}>
                                        <Text style={styles.topOrders}>{slot.orders} orders</Text>
                                        <Text style={styles.topPct}>{total > 0 ? `${((slot.orders / total) * 100).toFixed(0)}%` : "0%"}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </>
            )}
        </View>
    );
}

const BLOCK = s(22);

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff", borderRadius: s(14), padding: s(18), marginBottom: s(14),
        shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: s(6), elevation: 2,
    },
    title:    { fontSize: sf(14), fontWeight: "700", color: "#111827" },
    subtitle: { fontSize: sf(11), color: "#9CA3AF", marginBottom: s(14), marginTop: s(2) },
    empty:    { height: s(100), alignItems: "center", justifyContent: "center" },
    emptyText:{ fontSize: sf(13), color: "#9CA3AF" },

    // pills
    pills:          { flexDirection: "row", gap: s(8), marginBottom: s(16) },
    pill:           { flex: 1, backgroundColor: "#EDE9FE", borderRadius: s(10), padding: s(10), alignItems: "center" },
    pillGreen:      { backgroundColor: "#DCFCE7" },
    pillAmber:      { backgroundColor: "#FEF3C7" },
    pillValue:      { fontSize: sf(16), fontWeight: "800", color: "#6C63FF" },
    pillValueGreen: { color: "#16A34A" },
    pillValueAmber: { color: "#D97706" },
    pillLabel:      { fontSize: sf(10), color: "#6B7280", marginTop: s(2), textAlign: "center" },

    // heatmap
    section:      { marginBottom: s(8) },
    sectionLabel: { fontSize: sf(11), fontWeight: "700", color: "#6B7280", marginBottom: s(6) },
    grid:         { flexDirection: "row", gap: s(4) },
    cell:         { alignItems: "center", gap: s(3) },
    block: {
        width: BLOCK, height: BLOCK, borderRadius: s(5),
        alignItems: "center", justifyContent: "center",
    },
    peakDot:  { fontSize: sf(6), color: "#fff" },
    hourLabel:{ fontSize: sf(8), color: "#9CA3AF" },

    // legend
    legend:       { flexDirection: "row", alignItems: "center", gap: s(4), marginBottom: s(16), marginTop: s(4) },
    legendLabel:  { fontSize: sf(10), color: "#9CA3AF" },
    legendBlock:  { width: s(14), height: s(14), borderRadius: s(3) },

    // top list
    topList:   { borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: s(14), gap: s(10) },
    topTitle:  { fontSize: sf(12), fontWeight: "700", color: "#6B7280", marginBottom: s(4) },
    topRow:    { flexDirection: "row", alignItems: "center", gap: s(10) },
    topRank:   { fontSize: sf(16), width: s(24) },
    topHour:   { flex: 1, fontSize: sf(13), fontWeight: "600", color: "#374151" },
    topRight:  { alignItems: "flex-end" },
    topOrders: { fontSize: sf(13), fontWeight: "700", color: "#111827" },
    topPct:    { fontSize: sf(11), color: "#9CA3AF" },
});
