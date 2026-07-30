import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const ACCOUNTS_TYPES = ["Admin", "Waiter", "Chef", "Cashier"];

export default function AccountsFormPopup({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: { accountName: string; phone: string; email: string; role: string; password: string }) => void;
}) {
  const [accountName, setAccountName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!accountName.trim() || !role || !password || (!phone.trim() && !email.trim())) return;
    onSubmit({ accountName, phone, email, role, password });
    onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ width: "85%" }}
        >
          <View style={styles.popup}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Account Name</Text>
              <TextInput
                style={styles.input}
                value={accountName}
                onChangeText={setAccountName}
                placeholder="e.g. John Doe"
                placeholderTextColor="#999"
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
              <Text style={styles.label}>Email (optional)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. john@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Role</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setRoleOpen(true)}
              >
                <Text style={role ? styles.dropdownText : styles.placeholder}>
                  {role || "Select role..."}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Create</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Role dropdown - separate Modal layered on top */}
      <Modal
        transparent
        animationType="fade"
        visible={roleOpen}
        onRequestClose={() => setRoleOpen(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setRoleOpen(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={ACCOUNTS_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setRole(item);
                    setRoleOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === role && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Set password */}

      
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a42e0",
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#222",
    justifyContent: "center",
  },
  dropdownText: {
    fontSize: 15,
    color: "#222",
  },
  placeholder: {
    fontSize: 15,
    color: "#999",
  },
  submitBtn: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#4a42e0",
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeBtn: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  closeBtnText: {
    color: "#333",
    fontWeight: "600",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownList: {
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 15,
    color: "#222",
  },
  optionTextSelected: {
    color: "#4a42e0",
    fontWeight: "700",
  },
});