import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { s, sf } from "../../Extras/responsive";

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
    borderRadius: s(14),
    padding: s(24),
    gap: s(16),
  },
  title: { fontSize: sf(17), fontWeight: "700", color: "#e04242" },
  message: { fontSize: sf(14), color: "#444", lineHeight: s(20) },
  name: { fontWeight: "700", color: "#1a1a2e" },
  actions: { flexDirection: "row", gap: s(10), justifyContent: "flex-end" },
  cancelBtn: {
    paddingVertical: s(9),
    paddingHorizontal: s(18),
    borderRadius: s(8),
    backgroundColor: "#f3f4f6",
  },
  cancelText: { fontSize: sf(14), fontWeight: "600", color: "#555" },
  deleteBtn: {
    paddingVertical: s(9),
    paddingHorizontal: s(18),
    borderRadius: s(8),
    backgroundColor: "#fee2e2",
  },
  deleteText: { fontSize: sf(14), fontWeight: "600", color: "#e04242" },
});
