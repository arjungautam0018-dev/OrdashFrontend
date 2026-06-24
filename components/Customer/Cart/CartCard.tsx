import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { MenuItem } from "../Menu/MenuCard";

const MinusIcon = ({ size = 16, color = "#0D6E4F" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4.5 12h15" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
);

const PlusIcon = ({ size = 16, color = "#0D6E4F" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 4.5v15M4.5 12h15" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
);

interface Props {
    item: MenuItem;
    qty: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export default function CartCard({ item, qty, onIncrease, onDecrease }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price} each</Text>
            </View>
            <View style={styles.stepper}>
                <TouchableOpacity style={styles.stepBtn} onPress={onDecrease} activeOpacity={0.7}>
                    <MinusIcon size={16} color="#0D6E4F" />
                </TouchableOpacity>
                <Text style={styles.qty}>{qty}</Text>
                <TouchableOpacity style={styles.stepBtn} onPress={onIncrease} activeOpacity={0.7}>
                    <PlusIcon size={16} color="#0D6E4F" />
                </TouchableOpacity>
            </View>
            <Text style={styles.subtotal}>₹{item.price * qty}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#fff", borderRadius: 12,
        padding: 14, marginBottom: 10,
        borderWidth: 1, borderColor: "#E5E7EB",
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: "600", color: "#111827", marginBottom: 3 },
    price: { fontSize: 12, color: "#6B7280" },
    stepper: {
        flexDirection: "row", alignItems: "center",
        gap: 12, marginHorizontal: 12,
    },
    stepBtn: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: "#E6F4F0",
        alignItems: "center", justifyContent: "center",
    },
    qty: { fontSize: 15, fontWeight: "700", color: "#0D6E4F", minWidth: 20, textAlign: "center" },
    subtotal: { fontSize: 15, fontWeight: "700", color: "#0D6E4F", minWidth: 48, textAlign: "right" },
});
