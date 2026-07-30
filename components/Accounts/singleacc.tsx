import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Path, Svg } from "react-native-svg";

function AccountIcon({ size = 38, color = "#4a42e0" }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 30 30" width={size} height={size}>
      <Path
        d="M16,1a8,8,0,1,0,8,8A8,8,0,0,0,16,1Zm0,2a6,6,0,1,1-6,6A6,6,0,0,1,16,3Z"
        transform="translate(-1 -1)"
        fill={color}
        fillRule="evenodd"
      />
      <Path
        d="M16,19.2c-5.657,0-10.558,1.175-13,2.82A3.865,3.865,0,0,0,1,25.1a3.865,3.865,0,0,0,2,3.08C5.442,29.825,10.343,31,16,31s10.558-1.175,13-2.82a3.865,3.865,0,0,0,2-3.08,3.865,3.865,0,0,0-2-3.08C26.558,20.375,21.657,19.2,16,19.2Zm0,2a26.973,26.973,0,0,1,10.867,1.909,5.8,5.8,0,0,1,1.694,1.132,1.06,1.06,0,0,1,0,1.718,5.8,5.8,0,0,1-1.694,1.132A26.973,26.973,0,0,1,16,29,26.973,26.973,0,0,1,5.133,27.091a5.8,5.8,0,0,1-1.694-1.132,1.06,1.06,0,0,1,0-1.718,5.8,5.8,0,0,1,1.694-1.132A26.973,26.973,0,0,1,16,21.2Z"
        transform="translate(-1 -1)"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}

function EditIcon({ size = 18, color = "#4a42e0" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.33H5v-.92l8.06-8.06.92.92L5.92 19.58zM20.71 7.04a1.003 1.003 0 000-1.42L18.37 3.29a1.003 1.003 0 00-1.42 0l-1.13 1.13 3.75 3.75 1.14-1.13z"
        fill={color}
      />
    </Svg>
  );
}

function DeleteIcon({ size = 18, color = "#e04242" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4h6l1 1h4v2H4V5h4l1-1zm1 0v1h4V4h-4zM6 7h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7zm2 3v8h2v-8H8zm4 0v8h2v-8h-2z"
        fill={color}
      />
    </Svg>
  );
}

type Account = {
  id: string;
  accountName: string;
  role: string;
};

type Props = {
  account: Account;
  onEdit?: (account: Account) => void;
  onDelete?: (id: string) => void;
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  Admin:   { bg: "#ede9fe", text: "#4a42e0" },
  Waiter:  { bg: "#d1fae5", text: "#059669" },
  Chef:    { bg: "#fef3c7", text: "#d97706" },
  Cashier: { bg: "#fee2e2", text: "#dc2626" },
};

export default function SingleAccount({ account, onEdit, onDelete }: Props) {
  const roleStyle = ROLE_COLORS[account.role] ?? { bg: "#f3f4f6", text: "#6b7280" };

  return (
    <View style={styles.card}>
      {/* Avatar circle */}
      <View style={styles.avatar}>
        <AccountIcon size={26} color="#4a42e0" />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{account.accountName}</Text>
        <View style={[styles.roleBadge, { backgroundColor: roleStyle.bg }]}>
          <Text style={[styles.roleText, { color: roleStyle.text }]}>{account.role}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit?.(account)}>
          <EditIcon size={21} color="#4a42e0" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtnBg]} onPress={() => onDelete?.(account.id)}>
          <DeleteIcon size={21} color="#e04242" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ede9fe",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 5,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#ede9fe",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnBg: {
    backgroundColor: "#fee2e2",
  },
});
