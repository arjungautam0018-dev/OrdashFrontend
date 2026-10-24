import React, { useState } from "react";
import {
    View, Text, StyleSheet, TextInput,
    TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { s, sf } from "../Extras/responsive";
import { API } from "../Extras/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Customer app theme
const ACCENT = "#0D6E4F";
const ACCENT_SOFT = "#D2F4D5";

const KeyIcon = ({ size = 28, color = ACCENT }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M15.5 8.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke={color} strokeWidth={1.6} />
        <Path d="M9.5 12.5l-6 6M3.5 16.5l2 2M6.5 18.5l1.5 1.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

// Matches the sessionId generation used by the QR scan flow (features/camera.tsx)
function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

/**
 * Customer-only table identification screen.
 * The customer types the code printed on the table (the `code` stored on the
 * table in the DB); the public /table/code endpoint resolves it to a table and
 * seller, then we drop the customer into the ordering dashboard.
 *
 * Note: per the product decision, customers use ONLY this code method — no QR
 * scan and no table list. Sellers/waiters keep all three options.
 */
export default function CustomerCodeEntry({ navigation }: { navigation: any }) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const trimmed = code.trim();
        if (!trimmed) return;
        setLoading(true);
        try {
            // Public endpoint — resolves a table from the code stored in the DB.
            // The backend normalizes case (toUpperCase) so the input case is flexible.
            const res = await fetch(API.tableByCode, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: trimmed }),
            });
            const data = await res.json();
            if (data.success) {
                // Persist a session id for this table so the Orders tab can fetch
                // this device's orders later (mirrors the QR scan flow).
                const sessionId = generateUUID();
                await AsyncStorage.setItem(`session_${data.tableId}`, sessionId);

                navigation.replace("DashboardCustomer", {
                    sellerId: data.sellerId,
                    tableId: data.tableId,
                    tableName: data.tableName,
                    shopName: data.shopName,
                });
            } else {
                Alert.alert("Invalid Code", data.message || "Could not find a table with that code.");
            }
        } catch (e) {
            Alert.alert("Network Error", "Could not reach the server. Try again.");
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
                    {/* Back to role picker */}
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.75}
                    >
                        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                            <Path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>

                    <View style={styles.iconWrap}>
                        <KeyIcon size={36} color={ACCENT} />
                    </View>
                    <Text style={styles.heading}>Enter Table Code</Text>
                    <Text style={styles.sub}>Type the code printed on your table to view the menu</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="ABC123"
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
                            : <Text style={styles.btnText}>Continue</Text>
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
    backBtn: {
        position: "absolute", top: s(10), left: s(14),
        width: s(36), height: s(36), borderRadius: s(18),
        backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center",
    },
    iconWrap: {
        width: s(72), height: s(72), borderRadius: s(36),
        backgroundColor: ACCENT_SOFT, alignItems: "center", justifyContent: "center",
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
        width: "100%", backgroundColor: ACCENT,
        paddingVertical: s(15), borderRadius: s(12), alignItems: "center",
        shadowColor: ACCENT, shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35, shadowRadius: s(6), elevation: 3,
    },
    btnDisabled: { backgroundColor: "#A7F3D0", shadowOpacity: 0 },
    btnText: { fontSize: sf(16), fontWeight: "700", color: "#fff" },
});
