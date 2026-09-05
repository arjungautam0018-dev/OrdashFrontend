import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { s } from "../../../Extras/responsive";
import TodayCard from "../../../components/Analytics/TodayCard";
import OverviewCard from "../../../components/Analytics/OverviewCard";
import RevenueChart from "../../../components/Analytics/RevenueChart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../../../Extras/api";
import { authFetch } from "../../../Extras/authFetch";

const CACHE_KEY = "analytics_today";

export default function OverviewScreen() {
    const [data, setData]           = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
            console.log("[analytics/today] loaded from AsyncStorage");
            setData(JSON.parse(cached));
        }
        try {
            console.log("[analytics/today] fetching from API...");
            const res  = await authFetch(API.analyticsToday);
            console.log("[analytics/today] response status:", res.status);
            const json = await res.json();
            console.log("[analytics/today] response body:", JSON.stringify(json));
            if (json?.data) {
                setData(json.data);
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
            } else {
                console.warn("[analytics/today] unexpected response:", JSON.stringify(json));
            }
        } catch (e) {
            console.error("[analytics/today] error:", e);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    }, [load]);

    const today  = data?.today;
    const growth = { revenue: data?.revenueGrowth ?? 0, orders: data?.ordersGrowth ?? 0 };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} tintColor="#6C63FF" />
            }
        >
            <TodayCard
                revenue={`₹${today?.revenue ?? 0}`}
                orders={String(today?.orders ?? 0)}
            />
            <OverviewCard
                totalRevenue={`₹${today?.revenue ?? 0}`}
                totalOrders={String(today?.orders ?? 0)}
                avgOrder={today?.orders ? `₹${Math.round(today.revenue / today.orders)}` : "₹0"}
            />
            <RevenueChart data={[]} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    content:   { padding: s(16), paddingBottom: s(40) },
});
