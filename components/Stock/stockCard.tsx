import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

// ── Box / product placeholder icon ───────────────────────────────────────────
const BoxIcon = ({ size = 28, color = "#9CA3AF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 7l10 5 10-5-10-5z"
            stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 17l10 5 10-5"
            stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 7v10M22 7v10M12 12v10"
            stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// ── Clock icon for service ────────────────────────────────────────────────────
const ClockIcon = ({ size = 28, color = "#9CA3AF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9"
            stroke={color} strokeWidth={1.5} />
        <Path d="M12 7v5l3 3"
            stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
interface StockCardProps {
    _id: string;
    name: string;
    price: number;
    category: string;
    type: "product" | "service";
    quantity?: number | null;
    image?: string | null;
    onPress?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function StockCard({ _id, name, price, category, type, quantity, image, onPress }: StockCardProps) {
    const isProduct = type === "product";

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>

            {/* Left — image or icon */}
            <View style={styles.imageWrap}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.iconBox}>
                        {isProduct
                            ? <BoxIcon size={26} color="#9CA3AF" />
                            : <ClockIcon size={26} color="#9CA3AF" />
                        }
                    </View>
                )}
            </View>

            {/* Center — name + category */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{category}</Text>
                </View>
            </View>

            {/* Right — price + quantity */}
            <View style={styles.right}>
                <Text style={styles.price}>₹{price}</Text>
                {isProduct && quantity !== null && quantity !== undefined ? (
                    <View style={[
                        styles.qtyBadge,
                        quantity === 0 && styles.qtyBadgeEmpty,
                        quantity > 0 && quantity <= 5 && styles.qtyBadgeLow,
                    ]}>
                        <Text style={[
                            styles.qtyText,
                            quantity === 0 && styles.qtyTextEmpty,
                            quantity > 0 && quantity <= 5 && styles.qtyTextLow,
                        ]}>
                            {quantity === 0 ? "Out" : `${quantity} left`}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.serviceBadge}>
                        <Text style={styles.serviceText}>Service</Text>
                    </View>
                )}
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

    // Image / icon
    imageWrap: {
        width: 52,
        height: 52,
        borderRadius: 26,
        overflow: "hidden",
        marginRight: 12,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 26,
    },
    iconBox: {
        width: "100%",
        height: "100%",
        borderRadius: 26,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },

    // Info
    info: {
        flex: 1,
        justifyContent: "center",
        gap: 6,
    },
    name: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    categoryPill: {
        alignSelf: "flex-start",
        backgroundColor: "#EFF6FF",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#1E3A8A",
        letterSpacing: 0.3,
    },

    // Right
    right: {
        alignItems: "flex-end",
        gap: 6,
        marginLeft: 8,
    },
    price: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1E3A8A",
    },

    // Quantity badge — normal
    qtyBadge: {
        backgroundColor: "#F0FDF4",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: "#BBF7D0",
    },
    qtyText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#16A34A",
    },

    // Low stock
    qtyBadgeLow: {
        backgroundColor: "#FEF9E7",
        borderColor: "#F7D060",
    },
    qtyTextLow: {
        color: "#92400E",
    },

    // Out of stock
    qtyBadgeEmpty: {
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA",
    },
    qtyTextEmpty: {
        color: "#DC2626",
    },

    // Service badge
    serviceBadge: {
        backgroundColor: "#EDE9FE",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    serviceText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#6C63FF",
    },
});
