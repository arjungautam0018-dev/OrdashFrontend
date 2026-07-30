import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { authFetch } from "../../../Extras/authFetch";
import { API } from "../../../Extras/api";

export default function ProfileSettings() {
    const [seller, setSeller] = useState<{
        name: string; email: string; shopName: string; city: string; phone: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            // Try local session first for instant render
            const raw = await AsyncStorage.getItem("session");
            if (raw) {
                const s = JSON.parse(raw);
                setSeller({ name: s.sellerName, email: "", shopName: s.shopName, city: "", phone: "" });
            }
            // Then fetch full profile from server
            const res = await authFetch(API.sellerProfile);
            const data = await res.json();
            if (data.success) setSeller(data.seller);
        } catch {}
        setLoading(false);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color="#6C63FF" />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <View style={styles.avatarRow}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {seller?.name?.charAt(0).toUpperCase() ?? "?"}
                    </Text>
                </View>
                <View>
                    <Text style={styles.name}>{seller?.name ?? "—"}</Text>
                    <Text style={styles.sub}>{seller?.email ?? "—"}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Row label="Shop" value={seller?.shopName} />
                <Row label="City" value={seller?.city} />
                <Row label="Phone" value={seller?.phone} />
            </View>
        </SafeAreaView>
    );
}

function Row({ label, value }: { label: string; value?: string }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value || "—"}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:  { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
    centered:   { flex: 1, alignItems: "center", justifyContent: "center" },
    avatarRow:  { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 28 },
    avatar: {
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: "#6C63FF", alignItems: "center", justifyContent: "center",
    },
    avatarText: { color: "#fff", fontSize: 26, fontWeight: "700" },
    name:       { fontSize: 18, fontWeight: "700", color: "#111827" },
    sub:        { fontSize: 13, color: "#6B7280", marginTop: 2 },
    card: {
        backgroundColor: "#fff", borderRadius: 14,
        paddingHorizontal: 16, paddingVertical: 4,
        shadowColor: "#000", shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2,
    },
    row: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
    },
    rowLabel: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
    rowValue: { fontSize: 14, color: "#111827", fontWeight: "600" },
});
