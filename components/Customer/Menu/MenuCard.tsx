import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { s, sf } from "../../../Extras/responsive";

const BoxIcon = ({ size = 26, color = "#9CA3AF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 17l10 5 10-5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 7v10M22 7v10M12 12v10" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const ClockIcon = ({ size = 26, color = "#9CA3AF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
        <Path d="M12 7v5l3 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const PlusIcon = ({ size = 18, color = "#1a1a1a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 4.5v15M4.5 12h15" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
);

export interface MenuItem {
    _id: string;
    name: string;
    price: number;
    category: string;
    type: "product" | "service";
    quantity?: number | null;
    image?: string | null;
}

interface Props {
    item: MenuItem;
    onAdd: (item: MenuItem) => void;
    cartQty: number;
}

export default function MenuCard({ item, onAdd, cartQty }: Props) {
    const outOfStock = item.type === "product" && item.quantity === 0;

    return (
        <View style={[styles.card, outOfStock && styles.cardDim]}>
            {/* Image / icon */}
            <View style={styles.imageWrap}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                    <View style={styles.iconBox}>
                        {item.type === "product"
                            ? <BoxIcon size={24} color="#9CA3AF" />
                            : <ClockIcon size={24} color="#9CA3AF" />
                        }
                    </View>
                )}
            </View>

            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <View style={styles.catPill}>
                    <Text style={styles.catText}>{item.category}</Text>
                </View>
                <Text style={styles.price}>₹{item.price}</Text>
            </View>

            {/* Add button */}
            <View style={styles.right}>
                {outOfStock ? (
                    <View style={styles.outBadge}>
                        <Text style={styles.outText}>Out</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.addBtn, cartQty > 0 && styles.addBtnActive]}
                        onPress={() => onAdd(item)}
                        activeOpacity={0.75}
                    >
                        {cartQty > 0 ? (
                            <Text style={styles.addBtnQty}>{cartQty}</Text>
                        ) : (
                            <PlusIcon size={18} color="#fff" />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#fff", borderRadius: s(12),
        padding: s(12), marginBottom: s(10),
        borderWidth: 1, borderColor: "#E5E7EB",
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: s(3), elevation: 1,
    },
    cardDim: { opacity: 0.55 },
    imageWrap: {
        width: s(52), height: s(52), borderRadius: s(26),
        overflow: "hidden", marginRight: s(12),
    },
    image: { width: "100%", height: "100%", borderRadius: s(26) },
    iconBox: {
        width: "100%", height: "100%", borderRadius: s(26),
        backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center",
    },
    info: { flex: 1, justifyContent: "center", gap: s(4) },
    name: { fontSize: sf(15), fontWeight: "600", color: "#111827" },
    catPill: {
        alignSelf: "flex-start", backgroundColor: "#E6F4F0",
        borderRadius: s(6), paddingHorizontal: s(8), paddingVertical: s(2),
    },
    catText: { fontSize: sf(11), fontWeight: "600", color: "#0D6E4F", letterSpacing: 0.3 },
    price: { fontSize: sf(14), fontWeight: "700", color: "#0D6E4F", marginTop: s(2) },
    right: { marginLeft: s(8) },
    addBtn: {
        width: s(34), height: s(34), borderRadius: s(17),
        backgroundColor: "#0D6E4F",
        alignItems: "center", justifyContent: "center",
    },
    addBtnActive: { backgroundColor: "#F7D060" },
    addBtnQty: { fontSize: sf(13), fontWeight: "700", color: "#1a1a1a" },
    outBadge: {
        backgroundColor: "#FEF2F2", borderRadius: s(6),
        paddingHorizontal: s(8), paddingVertical: s(3),
        borderWidth: 1, borderColor: "#FECACA",
    },
    outText: { fontSize: sf(11), fontWeight: "600", color: "#DC2626" },
});
