import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { s } from "../../../Extras/responsive";
import TopItemsCard from "../../../components/Analytics/TopItemsCard";
import PeakHoursCard from "../../../components/Analytics/PeakHoursCard";

export default function ItemsScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // TODO: fetch from API.analyticsTopItems and API.analyticsPeakHours
        setRefreshing(false);
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} tintColor="#6C63FF" />
            }
        >
            <TopItemsCard items={[]} />
            <PeakHoursCard data={[]} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    content:   { padding: s(16), paddingBottom: s(40) },
});
