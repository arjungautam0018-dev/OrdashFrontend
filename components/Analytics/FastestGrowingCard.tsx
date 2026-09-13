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

interface Row { name: string; growth: number; currentCount: number; prevCount: number; category: string }

export default function FastestGrowingCard() {
    const [filter, setFilter]     = useState<Filter>("week");
    const [rows, setRows]         = useState<Row[]>([]);
    const [loading, setLoading]   = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const load = useCallback(async (f: Filter) => {
        setLoading(true);
        setSelected(null);
        const cacheKey = `analytics:fastest-growing:${f}`;
        const tsKey    = `analytics:fastest-growing:${f}:ts`;
        try {
            const cached = await AsyncStorage.getItem(cacheKey);
            if (cached) setRows(JSON.parse(cached));

            const lastFetch = await AsyncStorage.getItem(tsKey);
            if (lastFetch === new Date().toDateString() && cached) {
                setLoading(false);
                return;
            }

            const res  = await authFetch(`${API.analyticsFastestGrowing}?range=${f}`);
            const json = await res.json();
            if (json?.data) {
                setRows(json.data);
                await AsyncStorage.setItem(cacheKey, JSON.stringify(json.data));
                await AsyncStorage.setItem(tsKey, new Date().toDateString());
            }
        } catch (e) {
            console.error("[FastestGrowingCard]", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { setSelected(null); load(filter); }, [filter, load]);

    const hasSelection = selected !== null;

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Fastest Growing Products</Text>
                <Text style={styles.subtitle}>vs previous period</Text>
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
                <View style={styles.empty}><ActivityIndicator color="#22C55E" /></View>
            ) : rows.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyEmoji}>📊</Text>
                    <Text style={styles.emptyText}>Not enough data to compare yet</Text>
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
                                <View style={[styles.growthBadge, isSelected && styles.growthBadgeSelected]}>
                                    <Text style={[styles.growthText, isSelected && styles.growthTextSelected]}>
                                        +{row.growth}%
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
                                        <View style={styles.detailChip}>
                                            <Text style={styles.detailLabel}>Previous</Text>
                                            <Text style={styles.detailValue}>{row.prevCount}x</Text>
                                        </View>
                                        <View style={styles.arrow}>
                                            <Text style={styles.arrowText}>→</Text>
                                        </View>
                                        <View style={[styles.detailChip, styles.detailChipGreen]}>
                                            <Text style={styles.detailLabel}>Now</Text>
                                            <Text style={[styles.detailValue, styles.detailValueGreen]}>{row.currentCount}x</Text>
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
    headerRow:            { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: s(12) },
    title:                { fontSize: sf(14), fontWeight: "700", color: "#111827" },
    subtitle:             { fontSize: sf(11), color: "#9CA3AF" },
    tabs:                 { flexDirection: "row", gap: s(6), marginBottom: s(16) },
    tab:                  { paddingHorizontal: s(12), paddingVertical: s(5), borderRadius: s(20), backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB" },
    tabActive:            { backgroundColor: "#22C55E", borderColor: "#22C55E" },
    tabText:              { fontSize: sf(12), fontWeight: "600", color: "#6B7280" },
    tabTextActive:        { color: "#fff" },
    empty:                { height: s(100), alignItems: "center", justifyContent: "center", gap: s(6) },
    emptyEmoji:           { fontSize: sf(28) },
    emptyText:            { fontSize: sf(13), color: "#9CA3AF" },
    list:                 { gap: s(10) },
    row:                  { flexDirection: "row", alignItems: "center", gap: s(12), flexWrap: "wrap" },
    rowDimmed:            { opacity: 0.3 },
    growthBadge:          { backgroundColor: "#DCFCE7", borderRadius: s(8), paddingHorizontal: s(10), paddingVertical: s(6), minWidth: s(62), alignItems: "center" },
    growthBadgeSelected:  { backgroundColor: "#16A34A" },
    growthText:           { fontSize: sf(13), fontWeight: "800", color: "#16A34A" },
    growthTextSelected:   { color: "#fff" },
    mid:                  { flex: 1 },
    name:                 { fontSize: sf(13), fontWeight: "600", color: "#374151" },
    nameDimmed:           { color: "#9CA3AF" },
    sub:                  { fontSize: sf(11), color: "#9CA3AF", marginTop: s(2) },
    detail:               { flexDirection: "row", alignItems: "center", width: "100%", gap: s(6), marginTop: s(4) },
    detailChip:           { flex: 1, backgroundColor: "#F3F4F6", borderRadius: s(8), padding: s(8), alignItems: "center" },
    detailChipGreen:      { backgroundColor: "#DCFCE7" },
    detailLabel:          { fontSize: sf(10), color: "#6B7280" },
    detailValue:          { fontSize: sf(14), fontWeight: "700", color: "#374151", marginTop: s(2) },
    detailValueGreen:     { color: "#16A34A" },
    arrow:                { alignItems: "center", justifyContent: "center" },
    arrowText:            { fontSize: sf(16), color: "#22C55E", fontWeight: "700" },
});
