import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text, Alert, StyleSheet } from "react-native";
import SingleAccount from "./singleacc";
import DeleteAccountPopup from "./deletepopup";
import EditAccountPopup from "./editpopup";
import { authFetch } from "../../Extras/authFetch";
import { API } from "../../Extras/api";

type Account = { id: string; accountName: string; role: string; phone?: string };

export default function AccountsSection({ refresh }: { refresh: number }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);
  const [editTarget, setEditTarget] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(API.getAccounts);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setAccounts(
        (json.accounts as { id: string; accountName: string; role: string; phone?: string }[]).map((a) => ({
          id:          a.id,
          accountName: a.accountName,
          role:        a.role,
          phone:       a.phone,
        }))
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [refresh, fetchAccounts]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await authFetch(API.deleteAccount(deleteTarget.id), { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleEditSubmit = async (data: { accountName: string; role: string; phone: string; password: string }) => {
    if (!editTarget) return;
    setEditing(true);
    try {
      const res = await authFetch(API.updateAccount(editTarget.id), {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setAccounts((prev) =>
        prev.map((a) => a.id === editTarget.id ? { ...a, accountName: data.accountName, role: data.role, phone: data.phone } : a)
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update account");
    } finally {
      setEditing(false);
      setEditTarget(null);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} color="#4a42e0" />;

  if (accounts.length === 0)
    return <Text style={styles.empty}>No accounts yet.</Text>;

  return (
    <>
      <FlatList
        style={styles.list}
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SingleAccount
            account={item}
            onEdit={(acc) => setEditTarget(acc)}
            onDelete={(id) => setDeleteTarget(accounts.find((a) => a.id === id) ?? null)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      {deleteTarget && (
        <DeleteAccountPopup
          accountName={deleteTarget.accountName}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {editTarget && (
        <EditAccountPopup
          account={editTarget}
          onSubmit={handleEditSubmit}
          onClose={() => setEditTarget(null)}
          loading={editing}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 5 },
  listContent: { paddingHorizontal: 7, paddingBottom: 20 },
  empty: { textAlign: "center", marginTop: 32, color: "#999" },
});
