import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, FlatList,
    ActivityIndicator, ScrollView, TouchableOpacity,
} from "react-native";
import MenuCard, { MenuItem } from "./MenuCard";

const BASE_URL = "http://10.120.18.143:3000/api";

interface Props {
    sellerId: string;
    cart: Record<string, number>;
    onAdd: (item: MenuItem) => void;
    onMenuLoaded?: (items: MenuItem[]) => void;
}

export default function MenuSection({ sellerId, cart, onAdd, onMenuLoaded }: Props) {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, [sellerId]);

    const fetchMenu = async () => {
        console.log(`[MenuSection] fetching menu for sellerId=${sellerId}`);
        console.log(`[MenuSection] products URL: ${BASE_URL}/menu/products/${sellerId}`);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(`${BASE_URL}/menu/products/${sellerId}`),
                fetch(`${BASE_URL}/menu/categories/${sellerId}`),
            ]);
            console.log(`[MenuSection] products status: ${prodRes.status}, categories status: ${catRes.status}`);
            const prodData = await prodRes.json();
            const catData = await catRes.json();
            console.log(`[MenuSection] products response:`, JSON.stringify(prodData).slice(0, 200));
            console.log(`[MenuSection] categories response:`, JSON.stringify(catData).slice(0, 200));
            if (prodData.success) {
                setItems(prodData.products);
                onMenuLoaded?.(prodData.products);
            }
            if (catData.success) {
                setCategories(["All", ...catData.categories.map((c: { name: string }) => c.name)]);
            }
        } catch (e) {
            console.error("[MenuSection] FETCH ERROR:", e);
            console.error("[MenuSection] URL was:", `${BASE_URL}/menu/products/${sellerId}`);
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
                <ActivityIndicator size="large" color="#0D6E4F" />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            {/* Filter chips */}
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

            {/* Menu list */}
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
    centered: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },
    filterScroll: { flexGrow: 0 },
    filterRow: { paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
    chip: {
        width: 80, paddingVertical: 5, borderRadius: 20,
        backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB",
        alignItems: "center",
    },
    chipActive: { backgroundColor: "#0D6E4F", borderColor: "#0D6E4F" },
    chipText: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
    chipTextActive: { color: "#fff" },
    listContent: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 120 },
    empty: { alignItems: "center", marginTop: 60 },
    emptyText: { fontSize: 15, color: "#9CA3AF" },
});
