import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { s, sf } from "../../Extras/responsive";
import { authFetch } from "../../Extras/authFetch";
import { API } from "../../Extras/api";

type Filter = "week" | "month" | "year";
const FILTERS: { key: Filter; label: string }[] = [
    { key: "week",  label: "Week"  },
    { key: "month", label: "Month" },
    { key: "year",  label: "Year"  },
];

interface Row { name: string; decline: number; currentCount: number; prevCount: number; category: string }

export default function DecliningCard() {
    const [filter, setFilter]     = useState<Filter>("week");
    const [rows, setRows]         = useState<Row[]>([]);
    const [loading, setLoading]   = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const load = useCallback(async (f: Filter) => {
        setLoading(true);
        setSelected(null);
        const cacheKey = `analytics:declining:${f}`;
        const tsKey    = `analytics:declining:${f}:ts`;
        try {
            const cached = await AsyncStorage.getItem(cacheKey);
            if (cached) setRows(JSON.parse(cached));

            const lastFetch = await AsyncStorage.getItem(tsKey);
            if (lastFetch === new Date().toDateString() && cached) {
                setLoading(false);
                return;
            }

            const res  = await authFetch(`${API.analyticsDeclining}?range=${f}`);
            const json = await res.json();
            if (json?.data) {
                setRows(json.data);
                await AsyncStorage.setItem(cacheKey, JSON.stringify(json.data));
                await AsyncStorage.setItem(tsKey, new Date().toDateString());
            }
        } catch (e) {
            console.error("[DecliningCard]", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { setSelected(null); load(filter); }, [filter, load]);

    const hasSelection = selected !== null;

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Declining Products</Text>
                <View style={styles.alertPill}>
                    <Text style={styles.alertText}>⚠ Needs attention</Text>
                </View>
            </View>
            <Text style={styles.subtitle}>vs previous period</Text>

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
                <View style={styles.empty}><ActivityIndicator color="#EF4444" /></View>
            ) : rows.length === 0 ? (
                <View style={styles.emptyGood}>
                    <Text style={styles.emptyGoodEmoji}>🎉</Text>
                    <Text style={styles.emptyGoodText}>No declining products</Text>
                    <Text style={styles.emptyGoodSub}>Everything is holding steady or growing</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {rows.map((row) => {
                        const isSelected = selected === row.name;
                        const isDimmed   = hasSelection && !isSelected;
                        return (
                            <TouchableOpacity
                                key={row.name}
                                style={[styles.row, isDimmed && styles.rowDimmed]}
                                onPress={() => setSelected(p => p === row.name ? null : row.name)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.declineBadge, isSelected && styles.declineBadgeSelected]}>
                                    <Text style={[styles.declineText, isSelected && styles.declineTextSelected]}>
                                        {row.decline}%
                                    </Text>
                                </View>
                                <View style={styles.mid}>
                                    <Text style={[styles.name, isDimmed && styles.nameDimmed]} numberOfLines={1}>
                                        {row.name}
                                    </Text>
                                    <Text style={styles.sub}>{row.category}</Text>
                                </View>

                                {isSelected && (
                                    <View style={styles.detail}>
                                        <View style={[styles.detailChip, styles.detailChipRed]}>
                                            <Text style={styles.detailLabel}>Previous</Text>
                                            <Text style={[styles.detailValue, styles.detailValueRed]}>{row.prevCount}x</Text>
                                        </View>
                                        <View style={styles.arrow}>
                                            <Text style={styles.arrowText}>→</Text>
                                        </View>
                                        <View style={styles.detailChip}>
                                            <Text style={styles.detailLabel}>Now</Text>
                                            <Text style={styles.detailValue}>{row.currentCount}x</Text>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff", borderRadius: s(14), padding: s(18), marginBottom: s(14),
        shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: s(6), elevation: 2,
    },
    headerRow:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: s(2) },
    title:               { fontSize: sf(14), fontWeight: "700", color: "#111827" },
    alertPill:           { backgroundColor: "#FEF2F2", borderRadius: s(12), paddingHorizontal: s(8), paddingVertical: s(4) },
    alertText:           { fontSize: sf(11), color: "#EF4444", fontWeight: "600" },
    subtitle:            { fontSize: sf(11), color: "#9CA3AF", marginBottom: s(12) },
    tabs:                { flexDirection: "row", gap: s(6), marginBottom: s(16) },
    tab:                 { paddingHorizontal: s(12), paddingVertical: s(5), borderRadius: s(20), backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB" },
    tabActive:           { backgroundColor: "#EF4444", borderColor: "#EF4444" },
    tabText:             { fontSize: sf(12), fontWeight: "600", color: "#6B7280" },
    tabTextActive:       { color: "#fff" },
    empty:               { height: s(100), alignItems: "center", justifyContent: "center" },
    emptyGood:           { alignItems: "center", paddingVertical: s(24), gap: s(4) },
    emptyGoodEmoji:      { fontSize: sf(32) },
    emptyGoodText:       { fontSize: sf(14), fontWeight: "700", color: "#22C55E" },
    emptyGoodSub:        { fontSize: sf(12), color: "#9CA3AF" },
    list:                { gap: s(10) },
    row:                 { flexDirection: "row", alignItems: "center", gap: s(12), flexWrap: "wrap" },
    rowDimmed:           { opacity: 0.3 },
    declineBadge:        { backgroundColor: "#FEE2E2", borderRadius: s(8), paddingHorizontal: s(10), paddingVertical: s(6), minWidth: s(62), alignItems: "center" },
    declineBadgeSelected:{ backgroundColor: "#DC2626" },
    declineText:         { fontSize: sf(13), fontWeight: "800", color: "#DC2626" },
    declineTextSelected: { color: "#fff" },
    mid:                 { flex: 1 },
    name:                { fontSize: sf(13), fontWeight: "600", color: "#374151" },
    nameDimmed:          { color: "#9CA3AF" },
    sub:                 { fontSize: sf(11), color: "#9CA3AF", marginTop: s(2) },
    detail:              { flexDirection: "row", alignItems: "center", width: "100%", gap: s(6), marginTop: s(4) },
    detailChip:          { flex: 1, backgroundColor: "#F3F4F6", borderRadius: s(8), padding: s(8), alignItems: "center" },
    detailChipRed:       { backgroundColor: "#FEE2E2" },
    detailLabel:         { fontSize: sf(10), color: "#6B7280" },
    detailValue:         { fontSize: sf(14), fontWeight: "700", color: "#374151", marginTop: s(2) },
    detailValueRed:      { color: "#DC2626" },
    arrow:               { alignItems: "center", justifyContent: "center" },
    arrowText:           { fontSize: sf(16), color: "#EF4444", fontWeight: "700" },
});
