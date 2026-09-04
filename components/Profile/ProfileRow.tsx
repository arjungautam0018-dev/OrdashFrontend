import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, sf } from "../../Extras/responsive";

interface Props {
    label: string;
    value?: string | null;
}

export default function ProfileRow({ label, value }: Props) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value || "—"}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", paddingVertical: s(14),
        borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
    },
    label: { fontSize: sf(14), color: "#6B7280", fontWeight: "500" },
    value: { fontSize: sf(14), color: "#111827", fontWeight: "600", maxWidth: "60%", textAlign: "right" },
});
