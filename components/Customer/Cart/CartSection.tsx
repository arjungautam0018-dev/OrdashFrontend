import React, { useState } from "react";
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import CartCard from "./CartCard";
import { MenuItem } from "../Menu/MenuCard";
import { API } from "../../../Extras/api";
import { notifyOrderPlaced } from "../../../features/notification";

interface Props {
    sellerId: string;
    tableId: string;
    cart: Record<string, number>;
    menuItems: MenuItem[];
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onOrderPlaced: () => void;
}

export default function CartSection({ sellerId, tableId, cart, menuItems, onIncrease, onDecrease, onOrderPlaced }: Props) {
    const [loading, setLoading] = useState(false);

    const cartItems = menuItems.filter(i => (cart[i._id] ?? 0) > 0);
    const total = cartItems.reduce((sum, i) => sum + i.price * cart[i._id], 0);

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;
        setLoading(true);
        if (__DEV__) console.log(`[CartSection] placing order — sellerId=${sellerId}, tableId=${tableId}`);
        try {
            const items = cartItems.map(i => ({
                productId: i._id,
                name: i.name,
                price: i.price,
                quantity: cart[i._id],
            }));
            // total is NOT sent — backend must recalculate from prices in DB
            const res = await fetch(API.placeOrder, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sellerId, tableId, items }),
            });
            if (__DEV__) console.log(`[CartSection] place order response status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                notifyOrderPlaced();
                onOrderPlaced();
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (e) {
            if (__DEV__) console.error("[CartSection] NETWORK ERROR:", e);
            Alert.alert("Error", "Could not place order. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptyHint}>Add items from the Menu tab</Text>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <FlatList
                data={cartItems}
                keyExtractor={i => i._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <CartCard
                        item={item}
                        qty={cart[item._id]}
                        onIncrease={() => onIncrease(item._id)}
                        onDecrease={() => onDecrease(item._id)}
                    />
                )}
            />

            {/* Summary + Place Order */}
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{total}</Text>
                </View>
                <TouchableOpacity
                    style={styles.orderBtn}
                    onPress={handlePlaceOrder}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading
                        ? <ActivityIndicator color="#1a1a1a" />
                        : <Text style={styles.orderBtnText}>Place Order</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    listContent: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 180 },
    footer: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff", paddingHorizontal: 16,
        paddingTop: 16, paddingBottom: 32,
        borderTopWidth: 1, borderTopColor: "#E5E7EB",
        shadowColor: "#000", shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
    },
    totalRow: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", marginBottom: 14,
    },
    totalLabel: { fontSize: 16, fontWeight: "600", color: "#374151" },
    totalValue: { fontSize: 20, fontWeight: "700", color: "#0D6E4F" },
    orderBtn: {
        backgroundColor: "#F7D060", paddingVertical: 15,
        borderRadius: 12, alignItems: "center",
        shadowColor: "#F7D060", shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35, shadowRadius: 6, elevation: 3,
    },
    orderBtnText: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
    empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
    emptyTitle: { fontSize: 18, fontWeight: "600", color: "#374151" },
    emptyHint: { fontSize: 13, color: "#9CA3AF" },
});
