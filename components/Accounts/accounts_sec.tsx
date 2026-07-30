import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text, Alert, StyleSheet } from "react-native";
import SingleAccount from "./singleacc";
import { authFetch } from "../../Extras/authFetch";
import { API } from "../../Extras/api";

type Account = { id: string; name: string; role: string };

export default function AccountsSection({ refresh }: { refresh: number }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(API.getAccounts);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setAccounts(
        (json.accounts as { name: string; role: string }[]).map((a, i) => ({
          id: String(i),
          name: a.name,
          role: a.role,
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

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} color="#4a42e0" />;

  if (accounts.length === 0)
    return <Text style={styles.empty}>No accounts yet.</Text>;

  return (


    <FlatList
    style={styles.list}
      data={accounts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SingleAccount
          account={item}
          onEdit={(acc) => Alert.alert("Edit", `Edit ${acc.name}`)}
          onDelete={(id) => Alert.alert("Delete", `Delete account ${id}`)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 7,
    marginTop: 5,
},
  empty: { textAlign: "center", marginTop: 32, color: "#999" },
});
