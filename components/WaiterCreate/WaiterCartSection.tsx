import React, { useState } from "react";
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { s, sf } from "../../Extras/responsive";
import CartCard from "../Customer/Cart/CartCard";
import { MenuItem } from "../Customer/Menu/MenuCard";
import { API } from "../../Extras/api";
import { authFetch } from "../../Extras/authFetch";

interface Props {
    sellerId: string;
    tableId: string;
    tableName: string;
    cart: Record<string, number>;
    menuItems: MenuItem[];
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onOrderPlaced: () => void;
}

export default function WaiterCartSection({
    sellerId, tableId, tableName, cart, menuItems,
    onIncrease, onDecrease, onOrderPlaced,
}: Props) {
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const cartItems = menuItems.filter(i => (cart[i._id] ?? 0) > 0);
    const total = cartItems.reduce((sum, i) => sum + i.price * cart[i._id], 0);

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;
        setLoading(true);
        try {
            const items = cartItems.map(i => ({
                productId: i._id,
                name: i.name,
                price: i.price,
                quantity: cart[i._id],
            }));
            const res = await authFetch(API.placeOrder, {
                method: "POST",
                body: JSON.stringify({ sellerId, tableId, items }),
            });
            const data = await res.json();
            if (data.success) {
                Alert.alert("Order Placed", `Order placed for ${tableName} successfully.`);
                onOrderPlaced();
            } else {
                Alert.alert("Error", data.message);
            }
        } catch (e) {
            Alert.alert("Error", "Could not place order. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Cart is empty</Text>
                <Text style={styles.emptyHint}>Add items from the Menu tab</Text>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            {/* Table indicator */}
            <View style={styles.tableBar}>
                <Text style={styles.tableBarText}>Order for: <Text style={styles.tableBarName}>{tableName}</Text></Text>
            </View>

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

            <View style={[styles.footer, { paddingBottom: insets.bottom + s(16) }]}>
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
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.orderBtnText}>Place Order</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    tableBar: {
        backgroundColor: "#EDE9FE", paddingHorizontal: s(16), paddingVertical: s(10),
        borderBottomWidth: 1, borderBottomColor: "#C4B5FD",
    },
    tableBarText: { fontSize: sf(13), color: "#6B7280", fontWeight: "500" },
    tableBarName: { fontWeight: "700", color: "#6C63FF" },
    listContent: { paddingHorizontal: s(12), paddingTop: s(12), paddingBottom: s(180) },
    footer: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff", paddingHorizontal: s(16),
        paddingTop: s(16),
        borderTopWidth: 1, borderTopColor: "#E5E7EB",
        shadowColor: "#000", shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06, shadowRadius: s(8), elevation: 8,
    },
    totalRow: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", marginBottom: s(14),
    },
    totalLabel: { fontSize: sf(16), fontWeight: "600", color: "#374151" },
    totalValue: { fontSize: sf(20), fontWeight: "700", color: "#6C63FF" },
    orderBtn: {
        backgroundColor: "#6C63FF", paddingVertical: s(15),
        borderRadius: s(12), alignItems: "center",
        shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35, shadowRadius: s(6), elevation: 3,
    },
    orderBtnText: { fontSize: sf(16), fontWeight: "700", color: "#fff" },
    empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: s(8) },
    emptyTitle: { fontSize: sf(18), fontWeight: "600", color: "#374151" },
    emptyHint: { fontSize: sf(13), color: "#9CA3AF" },
});
