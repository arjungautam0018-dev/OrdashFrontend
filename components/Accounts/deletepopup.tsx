import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

type Props = {
  accountName: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
};

export default function DeleteAccountPopup({ accountName, onConfirm, onClose, loading }: Props) {
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Delete Account</Text>
          <Text style={styles.message}>
            Are you sure you want to delete{" "}
            <Text style={styles.name}>{accountName}</Text>? This cannot be undone.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm} disabled={loading}>
              <Text style={styles.deleteText}>{loading ? "Deleting..." : "Delete"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "82%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    gap: 16,
  },
  title: { fontSize: 17, fontWeight: "700", color: "#e04242" },
  message: { fontSize: 14, color: "#444", lineHeight: 20 },
  name: { fontWeight: "700", color: "#1a1a2e" },
  actions: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
  cancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#555" },
  deleteBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
  },
  deleteText: { fontSize: 14, fontWeight: "600", color: "#e04242" },
});
