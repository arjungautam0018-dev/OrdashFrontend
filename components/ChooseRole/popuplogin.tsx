import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  navigation: any;
};

export default function PopupLogin({ visible, onClose, navigation }: Props) {
  const handleSelect = (role: "seller" | "customer") => {
    onClose();
    if (role === "seller") {
      navigation.navigate("SellerLogin"); // replace with your actual route name
    } else {
      navigation.navigate("CustomerLogin"); // replace with your actual route name
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop — tap outside to close */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stop tap from bubbling through the card */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Log in as</Text>
          <Text style={styles.subtitle}>Choose your role to continue</Text>

          <TouchableOpacity
            style={[styles.btn, styles.customerBtn]}
            activeOpacity={0.8}
            onPress={() => handleSelect("customer")}
          >
            <Text style={styles.btnText}>🛒  Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.sellerBtn]}
            activeOpacity={0.8}
            onPress={() => handleSelect("seller")}
          >
            <Text style={styles.btnText}>🏪  Seller</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "gray",
    marginBottom: 20,
  },
  btn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  customerBtn: {
    backgroundColor: "#22c55e", // green
  },
  sellerBtn: {
    backgroundColor: "#3b82f6", // blue
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    marginTop: 4,
  },
  cancelText: {
    color: "gray",
    fontSize: 14,
  },
});