import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Rect } from "react-native-svg";

const TableIcon = ({ size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="6" width="20" height="3" rx="1.5" stroke="#fff" strokeWidth={1.6} />
        <Path d="M5 9v9M19 9v9M12 9v9" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

interface Props {
    tableName: string;
    shopName?: string;
}

export default function CustomerTopBar({ tableName, shopName }: Props) {
    return (
        <SafeAreaView edges={["top"]} style={styles.safe}>
            <View style={styles.container}>
                <View style={styles.badge}>
                    <TableIcon size={20} />
                </View>
                <View style={styles.center}>
                    <Text style={styles.shopName} numberOfLines={1}>{shopName ?? "Restaurant"}</Text>
                    <Text style={styles.tableName}>{tableName}</Text>
                </View>
                <View style={{ width: 36 }} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { backgroundColor: "#0D6E4F" },
    container: {
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: "#0D6E4F",
        shadowColor: "#0D6E4F",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    },
    badge: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center", justifyContent: "center",
    },
    center: { flex: 1, alignItems: "center" },
    shopName: { fontSize: 15, fontWeight: "600", color: "#fff" },
    tableName: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 1 },
});
