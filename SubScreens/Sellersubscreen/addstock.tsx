import React, { useState, useEffect } from "react";
import {
    StyleSheet, Text, View, TouchableOpacity,
    TextInput, ScrollView, Modal, FlatList, ActivityIndicator, Alert, Image,
    KeyboardAvoidingView, Platform,
} from "react-native";
import { s, sf } from "../../Extras/responsive";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { API } from "../../Extras/api";
import { authFetch } from "../../Extras/authFetch";

// ── Inline SVG icons ──────────────────────────────────────────────────────────

const ServiceIcon = ({ size = 22, color = "#6C63FF" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
            stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 6v6l4 2" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const ProductIcon = ({ size = 22, color = "#F7D060" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 17l10 5 10-5" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 7v10M22 7v10M12 12v10" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const TagIcon = ({ size = 18, color = "#1E3A8A" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
            stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="7" cy="7" r="1.5" fill={color} />
    </Svg>
);

const PriceIcon = ({ size = 18, color = "#1E3A8A" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
            stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={1.6} />
        <Path d="M12 8v4l2.5 2.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

const CategoryIcon = ({ size = 18, color = "#1E3A8A" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={1.6} />
        <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={1.6} />
        <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={1.6} />
        <Rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={1.6} />
    </Svg>
);

const ChevronDownIcon = ({ size = 16, color = "#6B7280" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const CheckIcon = ({ size = 16, color = "#1E3A8A" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const PlusSmIcon = ({ size = 16, color = "#1a1a1a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 4.5v15M4.5 12h15" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function AddStockScreen() {
    const navigation = useNavigation<any>();

    const [type, setType] = useState<"product" | "service" | null>(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [editingQty, setEditingQty] = useState(false);
    const [loading, setLoading] = useState(false);

    // image
    const [image, setImage] = useState<{ uri: string; type: string; name: string } | null>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission needed", "Allow photo library access to upload an image.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,   // lets user crop to square
            aspect: [1, 1],        // enforce 1:1 square crop
            quality: 0.8,
            base64: false,
        });
        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            const ext = asset.uri.split(".").pop()?.toLowerCase() ?? "jpg";
            const allowed = ["jpg", "jpeg", "png", "webp"];
            if (!allowed.includes(ext)) {
                Alert.alert("Invalid file", "Only JPG, PNG and WEBP images are supported.");
                return;
            }
            setImage({
                uri: asset.uri,
                type: `image/${ext === "jpg" ? "jpeg" : ext}`,
                name: `product-${Date.now()}.${ext}`,
            });
        }
    };

    // categories — loaded from server, fallback to defaults
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [catModalVisible, setCatModalVisible] = useState(false);
    const [newCatInput, setNewCatInput] = useState("");
    const [catLoading, setCatLoading] = useState(false);

    // fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await authFetch(API.getCategories);
                const data = await res.json();
                if (data.success) {
                    setCategories(data.categories.map((c: { name: string }) => c.name));
                }
            } catch {
                setCategories(["Stock", "Food", "Beverage", "Other"]);
            }
        };
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        const trimmed = newCatInput.trim();
        if (!trimmed || categories.includes(trimmed)) return;
        setCatLoading(true);
        try {
            const res = await authFetch(API.addCategory, {
                method: "POST",
                body: JSON.stringify({ name: trimmed }),
            });
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories.map((c: { name: string }) => c.name));
                setSelectedCategory(trimmed);
                setNewCatInput("");
                setCatModalVisible(false);
            } else {
                Alert.alert("Error", data.message);
            }
        } catch {
            Alert.alert("Error", "Could not create category.");
        } finally {
            setCatLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim() || !price || !selectedCategory || !type) {
            Alert.alert("Missing fields", "Please fill in all required fields.");
            return;
        }
        setLoading(true);
        try {
            let imageBase64: string | null = null;
            if (image) {
                const FileSystem = require("expo-file-system/legacy");
                imageBase64 = await FileSystem.readAsStringAsync(image.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
            }

            const res = await authFetch(API.addProduct, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    price,
                    category: selectedCategory,
                    type,
                    ...(type === "product" && { quantity: String(quantity) }),
                    ...(imageBase64 && { imageBase64 }),
                }),
            });
            const data = await res.json();
            if (data.success) {
                navigation.goBack();
            } else {
                Alert.alert("Error", data.message);
            }
        } catch {
            Alert.alert("Error", "Could not add product. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                {/* Header */}
                <View style={styles.headerCard}>
                    <Text style={styles.headerTitle}>ADD STOCK</Text>
                    <Text style={styles.headerSub}>Stock Details</Text>
                </View>

                {/* Image picker */}
                <View style={styles.imageSection}>
                    <TouchableOpacity style={styles.imageCircle} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                                    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                                        stroke="#9CA3AF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                                    <Circle cx="12" cy="13" r="4" stroke="#9CA3AF" strokeWidth={1.5} />
                                </Svg>
                                <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {image && (
                        <TouchableOpacity onPress={() => setImage(null)} style={styles.imageRemoveBtn}>
                            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                                <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
                            </Svg>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.imageHint}>JPG, PNG or WEBP · Max 5MB</Text>
                </View>

                {/* Type selector */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Type</Text>
                    <View style={styles.typeRow}>
                        <TouchableOpacity
                            style={[styles.typeBtn, type === "product" && styles.typeBtnActive]}
                            onPress={() => setType("product")}
                        >
                            <ProductIcon size={20} color={type === "product" ? "#1a1a1a" : "#9CA3AF"} />
                            <Text style={[styles.typeBtnText, type === "product" && styles.typeBtnTextActive]}>
                                Product
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeBtn, type === "service" && styles.typeBtnActiveService]}
                            onPress={() => setType("service")}
                        >
                            <ServiceIcon size={20} color={type === "service" ? "#fff" : "#9CA3AF"} />
                            <Text style={[styles.typeBtnText, type === "service" && styles.typeBtnTextService]}>
                                Service
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {type !== null && (
                    <>
                        {/* Category */}
                        <View style={styles.fieldGroup}>
                            <View style={styles.fieldLabelRow}>
                                <CategoryIcon size={16} />
                                <Text style={styles.fieldLabel}>Category</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.dropdownBtn}
                                onPress={() => setCatModalVisible(true)}
                            >
                                <Text style={selectedCategory ? styles.dropdownValue : styles.dropdownPlaceholder}>
                                    {selectedCategory ?? "Select or create category"}
                                </Text>
                                <ChevronDownIcon />
                            </TouchableOpacity>
                        </View>

                        {/* Name */}
                        <View style={styles.fieldGroup}>
                            <View style={styles.fieldLabelRow}>
                                <TagIcon size={16} />
                                <Text style={styles.fieldLabel}>
                                    {type === "service" ? "Service Name" : "Product Name"}
                                </Text>
                            </View>
                            <TextInput
                                style={styles.textInput}
                                placeholder={type === "service" ? "e.g. Table Service" : "e.g. Butter Chicken"}
                                placeholderTextColor="#9CA3AF"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Price */}
                        <View style={styles.fieldGroup}>
                            <View style={styles.fieldLabelRow}>
                                <PriceIcon size={16} />
                                <Text style={styles.fieldLabel}>Price</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <View style={styles.currencyBadge}>
                                    <Text style={styles.currencyText}>₹</Text>
                                </View>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="0.00"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="decimal-pad"
                                    value={price}
                                    onChangeText={setPrice}
                                />
                            </View>
                        </View>

                        {/* Quantity — only for product */}
                        {type === "product" && (
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Quantity</Text>
                                <View style={styles.capacityRow}>
                                    <TouchableOpacity
                                        style={styles.minusBtn}
                                        onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    >
                                        <Text style={styles.minusBtnText}>−</Text>
                                    </TouchableOpacity>
                                    <View style={styles.countBox}>
                                        {editingQty ? (
                                            <TextInput
                                                style={styles.countInput}
                                                value={String(quantity)}
                                                onChangeText={v => {
                                                    const n = parseInt(v);
                                                    if (!isNaN(n) && n > 0) setQuantity(n);
                                                    else if (v === "") setQuantity(1);
                                                }}
                                                onBlur={() => setEditingQty(false)}
                                                keyboardType="number-pad"
                                                autoFocus
                                                selectTextOnFocus
                                                textAlign="center"
                                            />
                                        ) : (
                                            <TouchableOpacity onPress={() => setEditingQty(true)}>
                                                <Text style={styles.countNumber}>{quantity}</Text>
                                            </TouchableOpacity>
                                        )}
                                        <Text style={styles.countLabel}>units</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.plusBtn}
                                        onPress={() => setQuantity(prev => prev + 1)}
                                    >
                                        <Text style={styles.plusBtnText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.addBtn, (!type || loading) && styles.addBtnDisabled]}
                        disabled={!type || loading}
                        onPress={handleSubmit}
                    >
                        {loading
                            ? <ActivityIndicator color="#1a1a1a" />
                            : <Text style={styles.addBtnText}>Add Stock</Text>
                        }
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Category Modal */}
            <Modal visible={catModalVisible} transparent animationType="slide">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCatModalVisible(false)} />
                <View style={styles.modalSheet}>
                    <View style={styles.modalHandle} />
                    <Text style={styles.modalTitle}>Choose Category</Text>

                    <FlatList
                        data={categories}
                        keyExtractor={item => item}
                        style={{ maxHeight: 240 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.catItem}
                                onPress={() => { setSelectedCategory(item); setCatModalVisible(false); }}
                            >
                                <Text style={[styles.catItemText, selectedCategory === item && styles.catItemTextActive]}>
                                    {item}
                                </Text>
                                {selectedCategory === item && <CheckIcon />}
                            </TouchableOpacity>
                        )}
                    />

                    {/* Create new */}
                    <View style={styles.newCatRow}>
                        <TextInput
                            style={styles.newCatInput}
                            placeholder="New category name..."
                            placeholderTextColor="#9CA3AF"
                            value={newCatInput}
                            onChangeText={setNewCatInput}
                        />
                        <TouchableOpacity style={styles.newCatBtn} onPress={handleAddCategory} disabled={catLoading}>
                            {catLoading
                                ? <ActivityIndicator size="small" color="#1a1a1a" />
                                : <PlusSmIcon size={16} color="#1a1a1a" />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F5F7FA" },
    scroll: { padding: s(16), paddingBottom: s(40) },

    // Image picker
    imageSection: {
        alignItems: "center",
        marginBottom: s(20),
        position: "relative",
    },
    imageCircle: {
        width: s(100),
        height: s(100),
        borderRadius: s(50),
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#E5E7EB",
        borderStyle: "dashed",
    },
    imagePreview: {
        width: "100%",
        height: "100%",
        borderRadius: s(50),
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#F9FAFB",
        alignItems: "center",
        justifyContent: "center",
        gap: s(4),
    },
    imagePlaceholderText: {
        fontSize: sf(11),
        color: "#9CA3AF",
        fontWeight: "500",
    },
    imageRemoveBtn: {
        position: "absolute",
        top: 0,
        right: "28%",
        width: s(22),
        height: s(22),
        borderRadius: s(11),
        backgroundColor: "#EF4444",
        alignItems: "center",
        justifyContent: "center",
    },
    imageHint: {
        marginTop: s(8),
        fontSize: sf(11),
        color: "#9CA3AF",
    },

    // Header
    headerCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#1E3A8A",
        backgroundColor: "#fff",
        borderRadius: s(10),
        paddingVertical: s(14),
        paddingHorizontal: s(16),
        marginBottom: s(16),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: s(4),
        elevation: 2,
    },
    headerTitle: {
        fontSize: sf(20),
        fontWeight: "700",
        color: "#1E3A8A",
        letterSpacing: 1.2,
        marginBottom: s(4),
    },
    headerSub: {
        fontSize: sf(13),
        fontWeight: "500",
        color: "#6B7280",
        letterSpacing: 0.4,
    },

    // Field cards
    fieldGroup: {
        backgroundColor: "#fff",
        borderRadius: s(10),
        padding: s(14),
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: s(14),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: s(3),
        elevation: 1,
    },
    fieldLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(6),
        marginBottom: s(10),
    },
    fieldLabel: {
        fontSize: sf(14),
        fontWeight: "600",
        color: "#374151",
        marginBottom: s(10),
    },

    // Type selector
    typeRow: { flexDirection: "row", gap: s(12) },
    typeBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: s(8),
        paddingVertical: s(12),
        borderRadius: s(10),
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        backgroundColor: "#F9FAFB",
    },
    typeBtnActive: {
        borderColor: "#F7D060",
        backgroundColor: "#FEF9E7",
    },
    typeBtnActiveService: {
        borderColor: "#6C63FF",
        backgroundColor: "#6C63FF",
    },
    typeBtnText: {
        fontSize: sf(14),
        fontWeight: "600",
        color: "#9CA3AF",
    },
    typeBtnTextActive: {
        color: "#1a1a1a",
    },
    typeBtnTextService: {
        color: "#fff",
    },

    // Dropdown
    dropdownBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: s(8),
        paddingHorizontal: s(12),
        paddingVertical: s(11),
    },
    dropdownValue: { fontSize: sf(15), fontWeight: "500", color: "#111827" },
    dropdownPlaceholder: { fontSize: sf(14), color: "#9CA3AF" },

    // Text input
    textInput: {
        height: s(44),
        backgroundColor: "#F9FAFB",
        borderRadius: s(8),
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: s(12),
        fontSize: sf(15),
        fontWeight: "500",
        color: "#111827",
    },

    // Price
    priceRow: { flexDirection: "row", alignItems: "center", gap: s(8) },
    currencyBadge: {
        width: s(44),
        height: s(44),
        borderRadius: s(8),
        backgroundColor: "#EFF6FF",
        borderWidth: 1,
        borderColor: "#BFDBFE",
        alignItems: "center",
        justifyContent: "center",
    },
    currencyText: { fontSize: sf(18), fontWeight: "700", color: "#1E3A8A" },
    priceInput: {
        flex: 1,
        height: s(44),
        backgroundColor: "#F9FAFB",
        borderRadius: s(8),
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: s(12),
        fontSize: sf(15),
        fontWeight: "500",
        color: "#111827",
    },

    // Quantity stepper
    capacityRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: s(4),
    },
    minusBtn: {
        width: s(52), height: s(52), borderRadius: s(12),
        backgroundColor: "#fff",
        borderWidth: 1.5, borderColor: "#E5E7EB",
        alignItems: "center", justifyContent: "center",
    },
    minusBtnText: { fontSize: sf(24), fontWeight: "400", color: "#374151", lineHeight: s(28) },
    countBox: { flex: 1, alignItems: "center", justifyContent: "center" },
    countNumber: { fontSize: sf(32), fontWeight: "700", color: "#1E3A8A", lineHeight: s(36) },
    countInput: {
        fontSize: sf(32),
        fontWeight: "700",
        color: "#1E3A8A",
        lineHeight: s(36),
        minWidth: s(60),
        borderBottomWidth: 2,
        borderBottomColor: "#1E3A8A",
        paddingHorizontal: s(4),
    },
    countLabel: { fontSize: sf(12), color: "#9CA3AF", marginTop: s(2) },
    plusBtn: {
        width: s(52), height: s(52), borderRadius: s(12),
        backgroundColor: "#F7D060",
        alignItems: "center", justifyContent: "center",
        shadowColor: "#F7D060",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4, shadowRadius: s(4), elevation: 3,
    },
    plusBtnText: { fontSize: sf(24), fontWeight: "600", color: "#1a1a1a", lineHeight: s(28) },

    // Actions
    actions: { flexDirection: "row", gap: s(12), marginTop: s(4) },
    cancelBtn: {
        flex: 1, paddingVertical: s(14), borderRadius: s(10),
        borderWidth: 1.5, borderColor: "#D1D5DB",
        alignItems: "center", backgroundColor: "#fff",
    },
    cancelText: { fontSize: sf(15), fontWeight: "600", color: "#6B7280" },
    addBtn: {
        flex: 2, paddingVertical: s(14), borderRadius: s(10),
        backgroundColor: "#F7D060", alignItems: "center",
        shadowColor: "#F7D060",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35, shadowRadius: s(6), elevation: 3,
    },
    addBtnDisabled: { backgroundColor: "#E5E7EB", shadowOpacity: 0 },
    addBtnText: { fontSize: sf(15), fontWeight: "700", color: "#1a1a1a" },

    // Category modal
    modalOverlay: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    modalSheet: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: s(20), borderTopRightRadius: s(20),
        paddingHorizontal: s(20), paddingBottom: s(32), paddingTop: s(12),
    },
    modalHandle: {
        width: s(40), height: s(4), borderRadius: s(2),
        backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: s(16),
    },
    modalTitle: {
        fontSize: sf(16), fontWeight: "700", color: "#1E3A8A", marginBottom: s(12),
    },
    catItem: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingVertical: s(13), borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
    },
    catItemText: { fontSize: sf(15), fontWeight: "500", color: "#374151" },
    catItemTextActive: { color: "#1E3A8A", fontWeight: "600" },
    newCatRow: {
        flexDirection: "row", gap: s(10), marginTop: s(16),
    },
    newCatInput: {
        flex: 1, height: s(44),
        backgroundColor: "#F9FAFB",
        borderRadius: s(8), borderWidth: 1, borderColor: "#E5E7EB",
        paddingHorizontal: s(12), fontSize: sf(14), color: "#111827",
    },
    newCatBtn: {
        width: s(44), height: s(44), borderRadius: s(8),
        backgroundColor: "#F7D060",
        alignItems: "center", justifyContent: "center",
    },
});
