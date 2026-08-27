import React, { useState, useCallback } from "react";
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Rect } from "react-native-svg";
import { s, sf } from "../../Extras/responsive";
import { API } from "../../Extras/api";
import { authFetch } from "../../Extras/authFetch";
import { TableItem } from "../Tables/tableCard";

// ── Icons ─────────────────────────────────────────────────────────────────────
const TableIcon = ({ size = 22, color = "#1E3A8A" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="6" width="20" height="3" rx="1.5" stroke={color} strokeWidth={1.5} />
        <Path d="M5 9v9M19 9v9M12 9v9" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
);

const SearchIcon = ({ size = 18, color = "#9CA3AF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);

interface Props {
    onTableSelected: (table: TableItem) => void;
}

export default function WaiterTableSelect({ onTableSelected }: Props) {
    const [tables, setTables] = useState<TableItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useFocusEffect(
        useCallback(() => {
            fetchTables();
        }, [])
    );

    const fetchTables = async () => {
        setLoading(true);
        try {
            const res = await authFetch(API.getTables);
            const data = await res.json();
            if (data.success) setTables(data.tables);
        } catch (e) {
            console.error("[WaiterTableSelect] fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    const filtered = tables.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.wrapper} edges={["bottom"]}>
            <Text style={styles.heading}>Select a Table</Text>
            <Text style={styles.sub}>Choose the table you are serving</Text>

            {/* Search */}
            <View style={styles.searchBox}>
                <SearchIcon size={18} color="#9CA3AF" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search table..."
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No tables found</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => onTableSelected(item)}
                        activeOpacity={0.75}
                    >
                        <View style={styles.iconBox}>
                            <TableIcon size={22} color="#1E3A8A" />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardName}>{item.name}</Text>
                            <Text style={styles.cardCap}>{item.capacity} guests</Text>
                        </View>
                        <View style={styles.selectBadge}>
                            <Text style={styles.selectText}>Select</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: "#F9FAFB" },
    centered: { flex: 1, alignItems: "center", justifyContent: "center" },
    heading: { fontSize: sf(20), fontWeight: "700", color: "#111827", paddingHorizontal: s(16), paddingTop: s(16) },
    sub: { fontSize: sf(13), color: "#6B7280", paddingHorizontal: s(16), marginTop: s(4), marginBottom: s(14) },
    searchBox: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#fff", borderRadius: s(10),
        borderWidth: 1, borderColor: "#E5E7EB",
        paddingHorizontal: s(12), marginHorizontal: s(16), marginBottom: s(12),
        gap: s(8),
    },
    searchInput: { flex: 1, fontSize: sf(14), color: "#111827", paddingVertical: s(10) },
    list: { paddingHorizontal: s(16), paddingBottom: s(120) },
    card: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#fff", borderRadius: s(12),
        padding: s(14), marginBottom: s(10),
        borderWidth: 1, borderColor: "#E5E7EB",
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: s(3), elevation: 1,
    },
    iconBox: {
        width: s(44), height: s(44), borderRadius: s(22),
        backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center",
        marginRight: s(12),
    },
    cardInfo: { flex: 1 },
    cardName: { fontSize: sf(15), fontWeight: "600", color: "#111827" },
    cardCap: { fontSize: sf(12), color: "#6B7280", marginTop: s(2) },
    selectBadge: {
        backgroundColor: "#EDE9FE", borderRadius: s(8),
        paddingHorizontal: s(10), paddingVertical: s(4),
        borderWidth: 1, borderColor: "#C4B5FD",
    },
    selectText: { fontSize: sf(12), fontWeight: "600", color: "#6C63FF" },
    empty: { alignItems: "center", marginTop: s(60) },
    emptyText: { fontSize: sf(15), color: "#9CA3AF" },
});
