import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Modal, FlatList, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { s, sf } from "../../Extras/responsive";

const ROLE_TYPES = ["Admin", "Waiter", "Chef", "Cashier"];

type Account = { id: string; accountName: string; role: string; phone?: string };

type Props = {
  account: Account;
  onSubmit: (data: { accountName: string; role: string; phone: string; password: string }) => void;
  onClose: () => void;
  loading?: boolean;
};

export default function EditAccountPopup({ account, onSubmit, onClose, loading }: Props) {
  const [accountName, setAccountName] = useState(account.accountName);
  const [phone, setPhone] = useState(account.phone ?? "");
  const [role, setRole] = useState(account.role);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const handleSubmit = () => {
    if (!accountName.trim() || !role) return;
    if (password && password.length < 6) return;
    onSubmit({ accountName, role, phone, password });
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ width: "85%" }}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.popup}>
              <Text style={styles.title}>Edit Account</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Account Name</Text>
                <TextInput
                  style={styles.input}
                  value={accountName}
                  onChangeText={setAccountName}
                  placeholderTextColor="#999"
                  placeholder="e.g. John Doe"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="e.g. 03001234567"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Role</Text>
                <TouchableOpacity style={styles.input} onPress={() => setRoleOpen(true)}>
                  <Text style={role ? styles.dropdownText : styles.placeholder}>
                    {role || "Select role..."}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>New Password <Text style={styles.optional}>(leave blank to keep current)</Text></Text>
                <View style={styles.pwWrap}>
                  <TextInput
                    style={[styles.input, { flex: 1, borderWidth: 0 }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Min. 6 characters"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                    <Text style={{ fontSize: 16 }}>{showPassword ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.submitBtnText}>{loading ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Modal transparent animationType="fade" visible={roleOpen} onRequestClose={() => setRoleOpen(false)}>
        <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setRoleOpen(false)}>
          <View style={styles.dropdownList}>
            <FlatList
              data={ROLE_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => { setRole(item); setRoleOpen(false); }}>
                  <Text style={[styles.optionText, item === role && styles.optionSelected]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", alignItems: "center",
  },
  popup: { backgroundColor: "#fff", borderRadius: s(12), padding: s(24), gap: s(16) },
  title: { fontSize: sf(18), fontWeight: "bold", color: "#4a42e0" },
  field: { gap: s(6) },
  label: { fontSize: sf(13), fontWeight: "600", color: "#555" },
  optional: { fontSize: sf(11), fontWeight: "400", color: "#999" },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: s(8),
    paddingHorizontal: s(12), paddingVertical: s(10),
    fontSize: sf(15), color: "#222", justifyContent: "center",
  },
  pwWrap: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#ddd", borderRadius: s(8),
    paddingHorizontal: s(12),
  },
  eyeBtn: { paddingVertical: s(10), paddingLeft: s(8) },
  dropdownText: { fontSize: sf(15), color: "#222" },
  placeholder: { fontSize: sf(15), color: "#999" },
  submitBtn: { alignItems: "center", paddingVertical: s(10), borderRadius: s(8), backgroundColor: "#4a42e0" },
  submitBtnText: { color: "#fff", fontWeight: "600" },
  cancelBtn: { alignItems: "center", paddingVertical: s(10), borderRadius: s(8), backgroundColor: "#eee" },
  cancelBtnText: { color: "#333", fontWeight: "600" },
  dropdownOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center", alignItems: "center",
  },
  dropdownList: { width: "70%", backgroundColor: "#fff", borderRadius: s(10), paddingVertical: s(8) },
  option: { paddingVertical: s(12), paddingHorizontal: s(16) },
  optionText: { fontSize: sf(15), color: "#222" },
  optionSelected: { color: "#4a42e0", fontWeight: "700" },
});
