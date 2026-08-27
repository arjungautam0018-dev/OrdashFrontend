import React, { useState } from "react";
import {
    View, Text, StyleSheet, TextInput,
    TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { s, sf } from "../../Extras/responsive";
import { API } from "../../Extras/api";
import { TableItem } from "../Tables/tableCard";

const KeyIcon = ({ size = 28, color = "#6C63FF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M15.5 8.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke={color} strokeWidth={1.6} />
        <Path d="M9.5 12.5l-6 6M3.5 16.5l2 2M6.5 18.5l1.5 1.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

interface Props {
    onTableResolved: (table: TableItem, sellerId: string) => void;
}

export default function WaiterCodeEntry({ onTableResolved }: Props) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const trimmed = code.trim();
        if (!trimmed) return;
        setLoading(true);
        try {
            // POST to scanQR with a "code" field — backend resolves table from QR code string
            const res = await fetch(API.tableByCode, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: trimmed }),
            });
            const data = await res.json();
            if (data.success) {
                onTableResolved(
                    { _id: data.tableId, name: data.tableName, capacity: 0 },
                    data.sellerId
                );
            } else {
                Alert.alert("Invalid Code", data.message || "Could not find a table with that code.");
            }
        } catch (e) {
            Alert.alert("Network Error", "Could not reach server. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.wrapper} edges={["bottom"]}>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.inner}>
                <View style={styles.iconWrap}>
                    <KeyIcon size={36} color="#6C63FF" />
                </View>
                <Text style={styles.heading}>Enter Table Code</Text>
                <Text style={styles.sub}>Type the code printed on the table or given by the manager</Text>

                <TextInput
                    style={styles.input}
                    placeholder="12345"
                    placeholderTextColor="#9CA3AF"
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit}
                />

                <TouchableOpacity
                    style={[styles.btn, !code.trim() && styles.btnDisabled]}
                    onPress={handleSubmit}
                    disabled={loading || !code.trim()}
                    activeOpacity={0.85}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.btnText}>Select Table</Text>
                    }
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: "#F9FAFB" },
    inner: {
        flex: 1, alignItems: "center", justifyContent: "center",
        paddingHorizontal: s(28),
    },
    iconWrap: {
        width: s(72), height: s(72), borderRadius: s(36),
        backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center",
        marginBottom: s(20),
    },
    heading: { fontSize: sf(22), fontWeight: "700", color: "#111827", marginBottom: s(8), textAlign: "center" },
    sub: { fontSize: sf(13), color: "#6B7280", textAlign: "center", marginBottom: s(28), lineHeight: s(20) },
    input: {
        width: "100%", backgroundColor: "#fff",
        borderRadius: s(12), borderWidth: 1, borderColor: "#E5E7EB",
        paddingHorizontal: s(16), paddingVertical: s(14),
        fontSize: sf(16), fontWeight: "600", color: "#111827",
        letterSpacing: 1.2, textAlign: "center", marginBottom: s(16),
    },
    btn: {
        width: "100%", backgroundColor: "#6C63FF",
        paddingVertical: s(15), borderRadius: s(12), alignItems: "center",
        shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35, shadowRadius: s(6), elevation: 3,
    },
    btnDisabled: { backgroundColor: "#C4B5FD", shadowOpacity: 0 },
    btnText: { fontSize: sf(16), fontWeight: "700", color: "#fff" },
});
