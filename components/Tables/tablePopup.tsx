import React, { useState, useEffect } from "react";
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { API } from "../../Extras/api";
import { TableItem } from "./tableCard";

interface Props {
    table: TableItem | null;
    onClose: () => void;
    onSaved: (updated: TableItem) => void;
    onDeleted: (id: string) => void;
}

export default function EditTablePopup({ table, onClose, onSaved, onDeleted }: Props) {
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("1");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (table) {
            setName(table.name);
            setCapacity(String(table.capacity));
        }
    }, [table]);

    const handleSave = async () => {
        if (!table) return;
        if (!name.trim()) {
            Alert.alert("Missing fields", "Table name is required.");
            return;
        }
        const cap = Number(capacity);
        if (isNaN(cap) || cap <= 0) {
            Alert.alert("Invalid capacity", "Capacity must be greater than 0.");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(API.updateTable(table._id), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: name.trim(), capacity: cap }),
            });
            const data = await res.json();
            if (data.success) {
                onSaved({ ...table, ...data.table });
                onClose();
            } else {
                Alert.alert("Error", data.message);
            }
        } catch {
            Alert.alert("Error", "Could not update table.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        if (!table) return;
        const tableId = table._id;
        const tableName = table.name;
        Alert.alert(
            "Delete table",
            `Remove "${tableName}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive",
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            const res = await fetch(API.deleteTable(tableId), {
                                method: "DELETE",
                                credentials: "include",
                            });
                            const data = await res.json();
                            if (data.success) {
                                onDeleted(tableId);
                                onClose();
                            } else {
                                Alert.alert("Error", data.message);
                            }
                        } catch {
                            Alert.alert("Error", "Could not delete table.");
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <Modal visible={!!table} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.kavContainer}
            >
            <View style={styles.sheet}>
                <View style={styles.handle} />
                <Text style={styles.sheetTitle}>Edit Table</Text>

                <Text style={styles.label}>Table Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Table A1"
                    placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.label}>Capacity</Text>
                <TextInput
                    style={styles.input}
                    value={capacity}
                    onChangeText={setCapacity}
                    keyboardType="number-pad"
                    placeholder="e.g. 4"
                    placeholderTextColor="#9CA3AF"
                />

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
