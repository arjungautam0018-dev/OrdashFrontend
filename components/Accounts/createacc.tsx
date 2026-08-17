import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { NavOrdersIcon } from "../../Extras/icons";
import { s, sf } from "../../Extras/responsive";
import AccountsFormPopup from "./formpopup";
import { authFetch } from "../../Extras/authFetch";
import { API } from "../../Extras/api";

export default function TopCreateAcc({ onAccountCreated }: { onAccountCreated?: () => void }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleCreateAccount = async (data: { accountName: string; phone: string; email: string; role: string; password: string }) => {
    try {
      const res = await authFetch(API.createAccount, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        Alert.alert("Error", json.message || "Failed to create account");
        return;
      }
      Alert.alert("Success", "Account created successfully");
      onAccountCreated?.();
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Manage Accounts</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowPopup(true)}>
        <NavOrdersIcon size={18} color="#000000" />
        <Text>Create Account</Text>
      </TouchableOpacity>
      {showPopup && (
        <AccountsFormPopup
          onClose={() => setShowPopup(false)}
          onSubmit={handleCreateAccount}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
    Text:{
        fontSize: sf(19),
        fontWeight: "bold",
        color: "#4a42e0",
    },
    container:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F7D060",
        gap: s(6),
        paddingVertical: s(8),
        paddingHorizontal: s(14),
        borderRadius: s(8),
    },
});
