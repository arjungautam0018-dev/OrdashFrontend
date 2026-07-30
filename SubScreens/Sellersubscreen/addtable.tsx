import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
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
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
    },

    // Header card
    headerCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#1E3A8A",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    newTableLabel: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1E3A8A",
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    tableDetailsLabel: {
        fontSize: 13,
        fontWeight: "500",
        color: "#6B7280",
        letterSpacing: 0.4,
    },

    // Form
    formSection: {
        flex: 1,
        gap: 16,
    },
    fieldGroup: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 10,
    },

    // Table Name input
    textInput: {
        height: 44,
        backgroundColor: "#F9FAFB",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 12,
        fontSize: 15,
        fontWeight: "500",
        color: "#111827",
    },

    // Capacity stepper
    capacityRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
    },
    minusBtn: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: "#ffffff",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
    },
    minusBtnText: {
        fontSize: 24,
        fontWeight: "400",
        color: "#374151",
        lineHeight: 28,
    },
    countBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    countNumber: {
        fontSize: 32,
        fontWeight: "700",
        color: "#1E3A8A",
        lineHeight: 36,
    },
    countInput: {
        fontSize: 32,
        fontWeight: "700",
        color: "#1E3A8A",
        lineHeight: 36,
        minWidth: 60,
        borderBottomWidth: 2,
        borderBottomColor: "#1E3A8A",
        paddingHorizontal: 4,
    },
    countLabel: {
        fontSize: 12,
        fontWeight: "400",
        color: "#9CA3AF",
        marginTop: 2,
    },
    plusBtn: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: "#F7D060",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#F7D060",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    plusBtnText: {
        fontSize: 24,
        fontWeight: "600",
        color: "#1a1a1a",
        lineHeight: 28,
    },

    // Bottom action buttons
    actions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 16,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#D1D5DB",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    cancelText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6B7280",
    },
    addTableBtn: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: "#F7D060",
        alignItems: "center",
        shadowColor: "#F7D060",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 3,
    },
    addTableText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1a1a1a",
    },
});
