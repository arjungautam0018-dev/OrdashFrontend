import React, { useState, useCallback, useRef } from "react";
import {
    View, Text, StyleSheet, FlatList,
    ActivityIndicator, RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import TableCard, { TableItem } from "./tableCard";
import EditTablePopup from "./tablePopup";
import QRPopup from "./QRPopup";
import { API } from "../../Extras/api";
import { authFetch } from "../../Extras/authFetch";

export default function TablesSection() {
    const [tables, setTables] = useState<TableItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [qrTable, setQrTable] = useState<TableItem | null>(null);
    const [editTable, setEditTable] = useState<TableItem | null>(null);
    const hasFetched = useRef(false);

    const fetchData = async (showLoader = false) => {
        if (showLoader) setLoading(true);
        try {
            const res = await authFetch(API.getTables);
            const data = await res.json();
            if (data.success) setTables(data.tables);
        } catch (e) {
            console.error("TablesSection fetch error:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (!hasFetched.current) {
                hasFetched.current = true;
                fetchData(true);
            }
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <FlatList
                data={tables}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No tables yet</Text>
                        <Text style={styles.emptyHint}>Add a table using the button above</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TableCard
                        table={item}
                        onPress={() => setQrTable(item)}
                    />
                )}
            />

            {/* QR popup — opens on tap */}
            <QRPopup
                table={qrTable}
                onClose={() => setQrTable(null)}
                onEdit={(t) => setEditTable(t)}
                onQRGenerated={(tableId, imageUrl) =>
                    setTables(prev => prev.map(t =>
                        t._id === tableId ? { ...t, qrcode: imageUrl } : t
                    ))
                }
            />

            {/* Edit popup — opened from inside QR popup */}
            <EditTablePopup
                table={editTable}
                onClose={() => setEditTable(null)}
                onSaved={(updated) =>
                    setTables(prev => prev.map(t => t._id === updated._id ? updated : t))
                }
                onDeleted={(id) =>
                    setTables(prev => prev.filter(t => t._id !== id))
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    centered: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
    listContent: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 100 },
    empty: { alignItems: "center", marginTop: 60 },
    emptyText: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 6 },
    emptyHint: { fontSize: 13, color: "#9CA3AF" },
});
