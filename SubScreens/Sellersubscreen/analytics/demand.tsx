import React, { useState, useCallback } from "react";
import { ScrollView, View, Text, StyleSheet, RefreshControl } from "react-native";
import { s, sf } from "../../../Extras/responsive";

export default function DemandScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // TODO: fetch from API.analyticsDemand when ML model is ready
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
            <View style={styles.placeholder}>
                <Text style={styles.emoji}>🤖</Text>
                <Text style={styles.title}>Demand Forecast</Text>
                <Text style={styles.sub}>
                    7-day demand prediction powered by ML.{"\n"}
                    Wire GET /api/analytics/demand after{"\n"}
                    training your model in python-service.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:   { flex: 1, backgroundColor: "#F9FAFB" },
    content:     { flexGrow: 1, padding: s(16) },
    placeholder: { flex: 1, alignItems: "center", justifyContent: "center", gap: s(12), minHeight: 300 },
    emoji: { fontSize: sf(48) },
    title: { fontSize: sf(18), fontWeight: "700", color: "#111827" },
    sub:   { fontSize: sf(13), color: "#9CA3AF", textAlign: "center", lineHeight: sf(20) },
});
