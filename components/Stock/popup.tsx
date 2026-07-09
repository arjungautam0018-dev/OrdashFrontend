import React, { useState, useEffect } from "react";
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { API } from "../../Extras/api";

export interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    type: "product" | "service";
    quantity?: number | null;
    image?: string | null;
}

interface Props {
    product: Product | null;
    onClose: () => void;
    onSaved: (updated: Product) => void;
    onDeleted: (id: string) => void;
}

export default function EditProductPopup({ product, onClose, onSaved, onDeleted }: Props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [qty, setQty] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Sync fields when a new product is passed in
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(String(product.price));
            setCategory(product.category);
            setQty(product.quantity != null ? String(product.quantity) : "");
        }
    }, [product]);

    const handleSave = async () => {
        if (!product) return;
        if (!name.trim() || !price) {
            Alert.alert("Missing fields", "Name and price are required.");
            return;
        }
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("price", price);
            formData.append("category", category);
            if (product.type === "product" && qty !== "") {
                formData.append("quantity", qty);
            }
            const res = await fetch(API.updateProduct(product._id), {
                method: "PUT",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                onSaved({ ...product, ...data.product });
                onClose();
            } else {
                Alert.alert("Error", data.message);
            }
        } catch {
            Alert.alert("Error", "Could not update product.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        if (!product) return;
        const productId = product._id;
        const productName = product.name;
        onClose(); // close modal first so overlay doesn't interfere with Alert
        Alert.alert(
            "Delete item",
            `Remove "${productName}" from stock?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive",
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            const res = await fetch(API.deleteProduct(productId), {
                                method: "DELETE",
                                credentials: "include",
                            });
                            const data = await res.json();
                            if (data.success) {
                                onDeleted(productId);
                            } else {
                                Alert.alert("Error", data.message);
                            }
                        } catch {
                            Alert.alert("Error", "Could not delete product.");
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <Modal visible={!!product} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.kavContainer}
            >
            <View style={styles.sheet}>
                <View style={styles.handle} />
                <Text style={styles.sheetTitle}>Edit Item</Text>

                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Item name"
                    placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.label}>Price (₹)</Text>
                <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.label}>Category</Text>
                <TextInput
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="Category"
                    placeholderTextColor="#9CA3AF"
                />

                {product?.type === "product" && (
                    <>
                        <Text style={styles.label}>Quantity</Text>
                        <TextInput
                            style={styles.input}
                            value={qty}
                            onChangeText={setQty}
                            keyboardType="number-pad"
                            placeholder="0"
                            placeholderTextColor="#9CA3AF"
                        />
                    </>
                )}

                <View style={styles.sheetActions}>
                    <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} disabled={deleting}>
                        {deleting
                            ? <ActivityIndicator color="#DC2626" />
                            : <Text style={styles.deleteBtnText}>Delete</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                        {saving
                            ? <ActivityIndicator color="#1a1a1a" />
                            : <Text style={styles.saveBtnText}>Save</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    kavContainer: {
        position: "absolute", bottom: 0, left: 0, right: 0,
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12,
    },
    handle: {
        width: 40, height: 4, borderRadius: 2,
        backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 16,
    },
    sheetTitle: { fontSize: 17, fontWeight: "700", color: "#1E3A8A", marginBottom: 16 },
    label: { fontSize: 13, fontWeight: "600", color: "#6B7280", marginBottom: 4 },
    input: {
        height: 44, backgroundColor: "#F9FAFB",
        borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB",
        paddingHorizontal: 12, fontSize: 15, color: "#111827", marginBottom: 12,
    },
    sheetActions: { flexDirection: "row", gap: 12, marginTop: 4 },
    deleteBtn: {
        flex: 1, paddingVertical: 13, borderRadius: 10,
        borderWidth: 1.5, borderColor: "#FECACA", backgroundColor: "#FEF2F2",
        alignItems: "center",
    },
    deleteBtnText: { fontSize: 15, fontWeight: "600", color: "#DC2626" },
    saveBtn: {
        flex: 2, paddingVertical: 13, borderRadius: 10,
        backgroundColor: "#F7D060", alignItems: "center",
    },
    saveBtnText: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
});
