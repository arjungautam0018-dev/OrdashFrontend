import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

const TableIcon = ({ size = 26, color = "#9CA3AF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="6" width="20" height="3" rx="1.5" stroke={color} strokeWidth={1.5} />
        <Path d="M5 9v9M19 9v9M12 9v9" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
);

const PeopleIcon = ({ size = 13, color = "#6B7280" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M9 11a4 4 0 100-8 4 4 0 000 8z" stroke={color} strokeWidth={1.5} />
        <Path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
);

export interface TableItem {
    _id: string;
    name: string;
    capacity: number;
    qrcode?: string | null;
}

interface Props {
    table: TableItem;
    onPress?: () => void;
}

export default function TableCard({ table, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>

            {/* Left icon */}
            <View style={styles.iconBox}>
                <TableIcon size={26} color="#1E3A8A" />
            </View>

            {/* Center — name */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{table.name}</Text>
                <View style={styles.capRow}>
                    <PeopleIcon size={13} color="#6B7280" />
                    <Text style={styles.capText}>{table.capacity} guests</Text>
                </View>
            </View>

            {/* Right — QR badge */}
            <View style={styles.right}>
                <View style={[styles.qrBadge, table.qrcode ? styles.qrBadgeActive : styles.qrBadgeInactive]}>
                    <Text style={[styles.qrText, table.qrcode ? styles.qrTextActive : styles.qrTextInactive]}>
                        {table.qrcode ? "QR Ready" : "No QR"}
                    </Text>
                </View>
            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    iconBox: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: "#EFF6FF",
        alignItems: "center", justifyContent: "center",
        marginRight: 12,
    },
    info: { flex: 1, justifyContent: "center", gap: 5 },
    name: { fontSize: 15, fontWeight: "600", color: "#111827" },
    capRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    capText: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
    right: { alignItems: "flex-end", marginLeft: 8 },
    qrBadge: {
        borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
        borderWidth: 1,
    },
    qrBadgeActive: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
    qrBadgeInactive: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
    qrText: { fontSize: 11, fontWeight: "600" },
    qrTextActive: { color: "#16A34A" },
    qrTextInactive: { color: "#9CA3AF" },
});
