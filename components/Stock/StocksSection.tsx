import React, { useState, useCallback } from "react";
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl, ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import StockCard from "./stockCard";
import EditProductPopup, { Product } from "./popup";
import { API } from "../../Extras/api";

export default function StocksSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selected, setSelected] = useState<Product | null>(null);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(API.getProducts, { credentials: "include" }),
                fetch(API.getCategories, { credentials: "include" }),
            ]);
            const prodData = await prodRes.json();
            const catData = await catRes.json();
            if (prodData.success) setProducts(prodData.products);
            if (catData.success) {
                const cats = catData.categories.map((c: { name: string }) => c.name);
                setCategories(["All", ...cats]);
            }
        } catch (e) {
            console.error("StocksSection fetch error:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const filtered = activeFilter === "All"
        ? products
        : products.filter(p => p.category === activeFilter);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>

            {/* Filter chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
                style={styles.filterScroll}
            >
                {categories.map(item => (
                    <TouchableOpacity
                        key={item}
                        style={[styles.chip, activeFilter === item && styles.chipActive]}
                        onPress={() => setActiveFilter(item)}
                    >
                        <Text style={[styles.chipText, activeFilter === item && styles.chipTextActive]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Product list */}
            <FlatList
                data={filtered}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No items found</Text>
                        <Text style={styles.emptyHint}>Add stock using the button above</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <StockCard
                        _id={item._id}
                        name={item.name}
                        price={item.price}
                        category={item.category}
                        type={item.type}
                        quantity={item.quantity}
                        image={item.image}
                        onPress={() => setSelected(item)}
                    />
                )}
            />

            {/* Edit popup */}
            <EditProductPopup
                product={selected}
                onClose={() => setSelected(null)}
                onSaved={(updated) =>
                    setProducts(prev => prev.map(p => p._id === updated._id ? updated : p))
                }
                onDeleted={(id) =>
                    setProducts(prev => prev.filter(p => p._id !== id))
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1},
    centered: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 60 },

    filterScroll: { flexGrow: 0 },
    filterRow: { paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
    chip: {
        width: 80, paddingVertical: 5,
        borderRadius: 20, backgroundColor: "#F3F4F6",
        borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center",
    },
    chipActive: { backgroundColor: "#1E3A8A", borderColor: "#1E3A8A" },
    chipText: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
    chipTextActive: { color: "#fff" },

    listContent: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 100 },

    empty: { alignItems: "center", marginTop: 60 },
    emptyText: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 6 },
    emptyHint: { fontSize: 13, color: "#9CA3AF" },
});
