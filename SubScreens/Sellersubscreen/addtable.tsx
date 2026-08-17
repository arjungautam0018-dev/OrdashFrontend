import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { s, sf } from "../../Extras/responsive";
import { API } from "../../Extras/api";
import { authFetch } from "../../Extras/authFetch";

export default function AddTableScreen(){
    const navigation = useNavigation<any>();
    const [tableName, setTableName] = useState("");
    const [capacity, setCapacity] = useState(1);
    const [editingCapacity, setEditingCapacity] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!tableName.trim()) {
            Alert.alert("Missing fields", "Please enter a table name.");
            return;
        }
        setLoading(true);
        try {
            const res = await authFetch(API.addTable, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: tableName.trim(), capacity }),
            });
            const data = await res.json();
            if (data.success) {
                navigation.goBack();
            } else {
                Alert.alert("Error", data.message);
            }
        } catch {
            Alert.alert("Error", "Could not add table. Try again.");
        } finally {
            setLoading(false);
        }
    };




    return(
        <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
            <View style={styles.container}>

                {/* Header Card */}
                <View style={styles.headerCard}>
                    <Text style={styles.newTableLabel}>NEW TABLE</Text>
                    <Text style={styles.tableDetailsLabel}>Table Details</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formSection}>

                    {/* Table Name */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Table Name</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="e.g. Table A1"
                            placeholderTextColor="#9CA3AF"
                            value={tableName}
                            onChangeText={setTableName}
                        />
                    </View>

                    {/* Capacity */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Capacity</Text>
                        <View style={styles.capacityRow}>

                            {/* Minus */}
                            <TouchableOpacity
                                style={styles.minusBtn}
                                onPress={() => setCapacity(prev => Math.max(1, prev - 1))}
                            >
                                <Text style={styles.minusBtnText}>−</Text>
                            </TouchableOpacity>

                            {/* Count */}
                            <View style={styles.countBox}>
                                {editingCapacity ? (
                                    <TextInput
                                        style={styles.countInput}
                                        value={String(capacity)}
                                        onChangeText={v => {
                                            const n = parseInt(v);
                                            if (!isNaN(n) && n > 0) setCapacity(n);
                                            else if (v === "") setCapacity(1);
                                        }}
                                        onBlur={() => setEditingCapacity(false)}
                                        keyboardType="number-pad"
                                        autoFocus
                                        selectTextOnFocus
                                        textAlign="center"
                                    />
                                ) : (
                                    <TouchableOpacity onPress={() => setEditingCapacity(true)}>
                                        <Text style={styles.countNumber}>{capacity}</Text>
                                    </TouchableOpacity>
                                )}
                                <Text style={styles.countLabel}>guests</Text>
                            </View>

                            {/* Plus */}
                            <TouchableOpacity
                                style={styles.plusBtn}
                                onPress={() => setCapacity(prev => prev + 1)}
                            >
                                <Text style={styles.plusBtnText}>+</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.cancelBtn}
                    onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addTableBtn} onPress={handleSubmit} disabled={loading}>
                        {loading
                            ? <ActivityIndicator color="#1a1a1a" />
                            : <Text style={styles.addTableText}>Add Table</Text>
                        }
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        marginHorizontal: s(16),
        marginTop: s(16),
        marginBottom: s(12),
    },

    // Header card
    headerCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#1E3A8A",
        backgroundColor: "#ffffff",
        borderRadius: s(10),
        paddingVertical: s(14),
        paddingHorizontal: s(16),
        marginBottom: s(20),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: s(4),
        elevation: 2,
    },
    newTableLabel: {
        fontSize: sf(20),
        fontWeight: "700",
        color: "#1E3A8A",
        letterSpacing: 1.2,
        marginBottom: s(4),
    },
    tableDetailsLabel: {
        fontSize: sf(13),
        fontWeight: "500",
        color: "#6B7280",
        letterSpacing: 0.4,
    },

    // Form
    formSection: {
        flex: 1,
        gap: s(16),
    },
    fieldGroup: {
        backgroundColor: "#ffffff",
        borderRadius: s(10),
        padding: s(14),
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: s(3),
        elevation: 1,
    },
    fieldLabel: {
        fontSize: sf(14),
        fontWeight: "600",
        color: "#374151",
        marginBottom: s(10),
    },

    // Table Name input
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

    // Capacity stepper
    capacityRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: s(4),
    },
    minusBtn: {
        width: s(52),
        height: s(52),
        borderRadius: s(12),
        backgroundColor: "#ffffff",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
    },
    minusBtnText: {
        fontSize: sf(24),
        fontWeight: "400",
        color: "#374151",
        lineHeight: s(28),
    },
    countBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    countNumber: {
        fontSize: sf(32),
        fontWeight: "700",
        color: "#1E3A8A",
        lineHeight: s(36),
    },
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
    countLabel: {
        fontSize: sf(12),
        fontWeight: "400",
        color: "#9CA3AF",
        marginTop: s(2),
    },
    plusBtn: {
        width: s(52),
        height: s(52),
        borderRadius: s(12),
        backgroundColor: "#F7D060",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#F7D060",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: s(4),
        elevation: 3,
    },
    plusBtnText: {
        fontSize: sf(24),
        fontWeight: "600",
        color: "#1a1a1a",
        lineHeight: s(28),
    },

    // Bottom action buttons
    actions: {
        flexDirection: "row",
        gap: s(12),
        marginTop: s(16),
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: s(14),
        borderRadius: s(10),
        borderWidth: 1.5,
        borderColor: "#D1D5DB",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    cancelText: {
        fontSize: sf(15),
        fontWeight: "600",
        color: "#6B7280",
    },
    addTableBtn: {
        flex: 2,
        paddingVertical: s(14),
        borderRadius: s(10),
        backgroundColor: "#F7D060",
        alignItems: "center",
        shadowColor: "#F7D060",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: s(6),
        elevation: 3,
    },
    addTableText: {
        fontSize: sf(15),
        fontWeight: "700",
        color: "#1a1a1a",
    },
});
