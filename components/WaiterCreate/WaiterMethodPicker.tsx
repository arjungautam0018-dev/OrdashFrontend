import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Rect } from "react-native-svg";
import { s, sf } from "../../Extras/responsive";

export type WaiterMethod = "qr" | "code" | "select";

const QRIcon = ({ size = 32, color = "#6C63FF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={1.6} />
        <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={1.6} />
        <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth={1.6} />
        <Path d="M14 14h2M20 14v2M14 20h3M20 18v3" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

const KeyIcon = ({ size = 32, color = "#6C63FF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M15.5 8.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke={color} strokeWidth={1.6} />
        <Path d="M9.5 12.5l-6 6M3.5 16.5l2 2M6.5 18.5l1.5 1.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

const TableIcon = ({ size = 32, color = "#6C63FF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="6" width="20" height="3" rx="1.5" stroke={color} strokeWidth={1.6} />
        <Path d="M5 9v9M19 9v9M12 9v9" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

const METHODS: { id: WaiterMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    {
        id: "qr",
        label: "Scan QR Code",
        desc: "Use the camera to scan the table QR",
        icon: <QRIcon size={30} color="#6C63FF" />,
    },
    {
        id: "code",
        label: "Enter Code",
        desc: "Type in the code printed on the table",
        icon: <KeyIcon size={30} color="#6C63FF" />,
    },
    {
        id: "select",
        label: "Select Table",
        desc: "Pick a table from the list",
        icon: <TableIcon size={30} color="#6C63FF" />,
    },
];

interface Props {
    onSelect: (method: WaiterMethod) => void;
}

export default function WaiterMethodPicker({ onSelect }: Props) {
    return (
        <SafeAreaView style={styles.wrapper}>
            <Text style={styles.heading}>Take Order for Table</Text>
            <Text style={styles.sub}>How do you want to identify the table?</Text>

            {METHODS.map(m => (
                <TouchableOpacity
                    key={m.id}
                    style={styles.card}
                    onPress={() => onSelect(m.id)}
                    activeOpacity={0.75}
                >
                    <View style={styles.iconBox}>{m.icon}</View>
                    <View style={styles.info}>
                        <Text style={styles.label}>{m.label}</Text>
                        <Text style={styles.desc}>{m.desc}</Text>
                    </View>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
            ))}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: s(16), paddingTop: s(24) },
    heading: { fontSize: sf(22), fontWeight: "700", color: "#111827", marginBottom: s(6) },
    sub: { fontSize: sf(14), color: "#6B7280", marginBottom: s(24) },
    card: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#fff", borderRadius: s(14),
        padding: s(16), marginBottom: s(12),
        borderWidth: 1, borderColor: "#E5E7EB",
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: s(3), elevation: 1,
    },
    iconBox: {
        width: s(56), height: s(56), borderRadius: s(28),
        backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center",
        marginRight: s(14),
    },
    info: { flex: 1 },
    label: { fontSize: sf(15), fontWeight: "700", color: "#111827", marginBottom: s(3) },
    desc: { fontSize: sf(12), color: "#6B7280" },
});
