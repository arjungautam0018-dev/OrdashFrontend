import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, FlatList,
    ActivityIndicator, ScrollView, TouchableOpacity,
} from "react-native";
import { s, sf } from "../../Extras/responsive";
import MenuCard, { MenuItem } from "../Customer/Menu/MenuCard";
import { API } from "../../Extras/api";
import { authFetch } from "../../Extras/authFetch";

interface Props {
    sellerId: string;
    cart: Record<string, number>;
    onAdd: (item: MenuItem) => void;
    onMenuLoaded?: (items: MenuItem[]) => void;
}

export default function WaiterMenuSection({ sellerId, cart, onAdd, onMenuLoaded }: Props) {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, [sellerId]);

    const fetchMenu = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                authFetch(API.menuProducts(sellerId)),
                authFetch(API.menuCategories(sellerId)),
            ]);
            const prodData = await prodRes.json();
            const catData  = await catRes.json();
            if (prodData.success) {
                setItems(prodData.products);
                onMenuLoaded?.(prodData.products);
            }
            if (catData.success) {
                setCategories(["All", ...catData.categories.map((c: { name: string }) => c.name)]);
            }
        } catch (e) {
            console.error("[WaiterMenuSection] fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    const filtered = activeFilter === "All"
        ? items
        : items.filter(i => i.category === activeFilter);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
                style={styles.filterScroll}
            >
                {categories.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.chip, activeFilter === cat && styles.chipActive]}
                        onPress={() => setActiveFilter(cat)}
                    >
                        <Text style={[styles.chipText, activeFilter === cat && styles.chipTextActive]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={filtered}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No items found</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <MenuCard
                        item={item}
                        onAdd={onAdd}
                        cartQty={cart[item._id] ?? 0}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    centered: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: s(60) },
    filterScroll: { flexGrow: 0 },
    filterRow: { paddingHorizontal: s(12), paddingVertical: s(6), gap: s(6) },
    chip: {
        width: s(80), paddingVertical: s(5), borderRadius: s(20),
        backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center",
    },
    chipActive: { backgroundColor: "#6C63FF", borderColor: "#6C63FF" },
    chipText: { fontSize: sf(12), fontWeight: "600", color: "#6B7280" },
    chipTextActive: { color: "#fff" },
    listContent: { paddingHorizontal: s(12), paddingTop: s(8), paddingBottom: s(120) },
    empty: { alignItems: "center", marginTop: s(60) },
    emptyText: { fontSize: sf(15), color: "#9CA3AF" },
});
