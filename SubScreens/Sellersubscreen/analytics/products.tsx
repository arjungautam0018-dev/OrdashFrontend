import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { s } from "../../../Extras/responsive";
import HighestRevenueCard from "../../../components/Analytics/HighestRevenueCard";
import MostOrderedCard    from "../../../components/Analytics/MostOrderedCard";
import FastestGrowingCard from "../../../components/Analytics/FastestGrowingCard";
import DecliningCard      from "../../../components/Analytics/DecliningCard";

export default function ProductsScreen() {
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
            <HighestRevenueCard />
            <MostOrderedCard />
            <FastestGrowingCard />
            <DecliningCard />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    content:   { padding: s(16), paddingBottom: s(40) },
});
