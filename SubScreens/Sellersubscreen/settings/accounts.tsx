import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopCreateAcc from "../../../components/Accounts/createacc";
import AccountsSection from "../../../components/Accounts/accounts_sec";

export default function ManageAccounts() {
  const [refresh, setRefresh] = useState(0);

  return (
    <View style={styles.root}>
      <SafeAreaView>
        <View style={styles.top}>
          <TopCreateAcc onAccountCreated={() => setRefresh((r) => r + 1)} />
        </View>
        <AccountsSection refresh={refresh} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: { marginHorizontal: 10 },
});
