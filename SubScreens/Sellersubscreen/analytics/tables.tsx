import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { s } from "../../../Extras/responsive";
import TableRevenueCard    from "../../../components/Analytics/TableRevenueCard";
import TableOrdersCard     from "../../../components/Analytics/TableOrdersCard";
import ActiveTablesCard    from "../../../components/Analytics/ActiveTablesCard";
import AvgOrderByTableCard from "../../../components/Analytics/AvgOrderByTableCard";

export default function TablesScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setRefreshing(false);
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} tintColor="#6C63FF" />}
        >
            <TableRevenueCard />
            <TableOrdersCard  />
            <ActiveTablesCard />
            <AvgOrderByTableCard />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    content:   { padding: s(16), paddingBottom: s(40) },
});
