import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s, sf } from "../../../Extras/responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { authFetch } from "../../../Extras/authFetch";
import { API } from "../../../Extras/api";

export default function LogoutSettings() {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = React.useState(false);

    const handleLogout = () => {
        Alert.alert("Log out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Log out", style: "destructive", onPress: async () => {
                    setLoading(true);
                    try { await authFetch(API.sellerLogout, { method: "POST" }); } catch {}
                    await AsyncStorage.removeItem("session");
                    // Walk to root and reset
                    let root: any = navigation;
                    while (root.getParent()) root = root.getParent();
                    root.reset({ index: 0, routes: [{ name: "ChooseRole" }] });
                },
            },
        ]);
    };

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Log out</Text>
                <Text style={styles.sub}>You will be returned to the home screen and will need to log in again.</Text>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={handleLogout}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.btnText}>Log out</Text>
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB", padding: s(20), justifyContent: "center" },
    card: {
        backgroundColor: "#fff", borderRadius: s(16), padding: s(24),
        alignItems: "center", gap: s(12),
        shadowColor: "#000", shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: s(8), elevation: 3,
    },
    title: { fontSize: sf(20), fontWeight: "700", color: "#111827" },
    sub:   { fontSize: sf(14), color: "#6B7280", textAlign: "center", lineHeight: s(20) },
    btn: {
        marginTop: s(8), backgroundColor: "#EF4444",
        paddingVertical: s(13), paddingHorizontal: s(40),
        borderRadius: s(10), minWidth: s(160), alignItems: "center",
    },
    btnText: { color: "#fff", fontSize: sf(15), fontWeight: "700" },
});
