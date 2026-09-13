import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { s } from "../../../Extras/responsive";
import TodayCard from "../../../components/Analytics/TodayCard";
import OverviewCard from "../../../components/Analytics/OverviewCard";
import RevenueChart from "../../../components/Analytics/RevenueChart";
import CategoryDonut from "../../../components/Analytics/CategoryDonut";
import TopItemsCard from "../../../components/Analytics/TopItemsCard";
import PeakHoursCard from "../../../components/Analytics/PeakHoursCard";
import { API } from "../../../Extras/api";
import { authFetch } from "../../../Extras/authFetch";

export default function OverviewScreen() {
    const [data, setData]             = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            const res  = await authFetch(API.analyticsToday);
            const json = await res.json();
            if (json?.data) {
                setData(json.data);
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
                revenueGrowth={data?.revenueGrowth}
                ordersGrowth={data?.ordersGrowth}
            />
            <OverviewCard
                totalRevenue={`₹${today?.revenue ?? 0}`}
                totalOrders={String(today?.orders ?? 0)}
                avgOrder={today?.orders ? `₹${Math.round(today.revenue / today.orders)}` : "₹0"}
            />
            <RevenueChart />
            <CategoryDonut />
            <TopItemsCard />
            {/* TODO: fetch from GET /api/analytics/peak-hours */}
            <PeakHoursCard />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    content:   { padding: s(16), paddingBottom: s(40) },
});
