import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/Dashboard/top";
import SellerOrdersSection from "../../components/Dashboard/SellerOrdersSection";

export default function DashboardSeller() {
    return (
        <View style={styles.container}>
            <TopBar />
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Orders</Text>
            </View>
            <SellerOrdersSection />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },
});
