import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { s, sf } from "../../Extras/responsive";
import { MenuItem } from "../../components/Customer/Menu/MenuCard";
import { TableItem } from "../../components/Tables/tableCard";
import { API } from "../../Extras/api";
import { authFetch } from "../../Extras/authFetch";

import WaiterMethodPicker, { WaiterMethod } from "../../components/WaiterCreate/WaiterMethodPicker";
import WaiterQRScan from "../../components/WaiterCreate/WaiterQRScan";
import WaiterCodeEntry from "../../components/WaiterCreate/WaiterCodeEntry";
import WaiterTableSelect from "../../components/WaiterCreate/WaiterTableSelect";
import WaiterMenuSection from "../../components/WaiterCreate/WaiterMenuSection";
import WaiterCartSection from "../../components/WaiterCreate/WaiterCartSection";

// ── Tab icons ─────────────────────────────────────────────────────────────────
const MenuTabIcon = ({ color }: { color: string }) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const CartTabIcon = ({ color, badge }: { color: string; badge?: number }) => (
    <View style={{ width: 22, height: 22 }}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        {!!badge && badge > 0 && (
            <View style={{
                position: "absolute", top: -s(4), right: -s(6),
                backgroundColor: "#6C63FF", borderRadius: s(8),
                minWidth: s(16), height: s(16), alignItems: "center", justifyContent: "center",
                paddingHorizontal: s(3),
            }}>
                <Text style={{ color: "#fff", fontSize: sf(10), fontWeight: "700" }}>
                    {badge > 9 ? "9+" : badge}
                </Text>
            </View>
        )}
    </View>
);

// ── Table header bar ──────────────────────────────────────────────────────────
function TableBar({ tableName, onClear }: { tableName: string; onClear: () => void }) {
    return (
        <View style={styles.tableBar}>
            <Text style={styles.tableBarLabel}>
                Table: <Text style={styles.tableBarName}>{tableName}</Text>
            </Text>
            <TouchableOpacity onPress={onClear} style={styles.changeBtn} activeOpacity={0.75}>
                <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Inner tab navigator (shown after table is selected) ───────────────────────
const Tab = createBottomTabNavigator();
const ACTIVE_COLOR   = "#6C63FF";
const INACTIVE_COLOR = "#9CA3AF";

interface OrderTabsProps {
    sellerId: string;
    table: TableItem;
    onClear: () => void;
}

function OrderTabs({ sellerId, table, onClear }: OrderTabsProps) {
    const insets = useSafeAreaInsets();
    const [cart, setCart] = useState<Record<string, number>>({});
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        // Eager menu fetch
        const load = async () => {
            try {
                const res = await authFetch(API.menuProducts(sellerId));
                const data = await res.json();
                if (data.success) setMenuItems(data.products);
            } catch {}
        };
        load();
    }, [sellerId]);

    const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

    const handleAdd = useCallback((item: MenuItem) => {
        setCart(prev => ({ ...prev, [item._id]: (prev[item._id] ?? 0) + 1 }));
    }, []);

    const handleIncrease = useCallback((id: string) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    }, []);

    const handleDecrease = useCallback((id: string) => {
        setCart(prev => {
            const next = { ...prev };
            if ((next[id] ?? 0) <= 1) delete next[id];
            else next[id] = next[id] - 1;
            return next;
        });
    }, []);

    const handleOrderPlaced = useCallback(() => {
        setCart({});
        onClear();
    }, [onClear]);

    const handleMenuLoaded = useCallback((items: MenuItem[]) => {
        setMenuItems(items);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#EDE9FE" }} edges={["top", "left", "right"]}>
            <TableBar tableName={table.name} onClear={onClear} />
            <Tab.Navigator
                screenOptions={({ route: r }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: ACTIVE_COLOR,
                    tabBarInactiveTintColor: INACTIVE_COLOR,
                    tabBarStyle: {
                        backgroundColor: "#fff",
                        borderTopWidth: 1, borderTopColor: "#E5E7EB",
                        height: s(60) + insets.bottom,
                        paddingBottom: insets.bottom,
                    },
                    tabBarLabelStyle: { fontSize: sf(11), fontWeight: "600" },
                    tabBarIcon: ({ color }) => {
                        if (r.name === "Menu") return <MenuTabIcon color={color} />;
                        if (r.name === "Cart") return <CartTabIcon color={color} badge={cartCount} />;
                    },
                })}
            >
                <Tab.Screen name="Menu">
                    {() => (
                        <WaiterMenuSection
                            sellerId={sellerId}
                            cart={cart}
                            onAdd={handleAdd}
                            onMenuLoaded={handleMenuLoaded}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen name="Cart">
                    {() => (
                        <WaiterCartSection
                            sellerId={sellerId}
                            tableId={table._id}
                            tableName={table.name}
                            cart={cart}
                            menuItems={menuItems}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            onOrderPlaced={handleOrderPlaced}
                        />
                    )}
                </Tab.Screen>
            </Tab.Navigator>
        </SafeAreaView>
    );
}
// sellerId is read from seller's own session if not passed
interface Props {
    sellerId?: string;
}

export default function WaiterOrderScreen({ sellerId: propSellerId }: Props) {
    const [step, setStep] = useState<"pick" | WaiterMethod>("pick");
    const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
    const [resolvedSellerId, setResolvedSellerId] = useState<string>(propSellerId ?? "");

    // Load seller ID from session if not passed as prop
    useEffect(() => {
        if (!propSellerId) {
            const load = async () => {
                try {
                    const res = await authFetch(API.sellerProfile);
                    const data = await res.json();
                    if (data.success && data.seller?._id) {
                        setResolvedSellerId(data.seller._id);
                    }
                } catch {}
            };
            load();
        }
    }, [propSellerId]);

    const handleTableResolved = useCallback((table: TableItem, sellerId: string) => {
        if (sellerId) setResolvedSellerId(sellerId);
        setSelectedTable(table);
        setStep("pick");
    }, []);

    const handleTableSelected = useCallback((table: TableItem) => {
        setSelectedTable(table);
        setStep("pick");
    }, []);

    const handleClear = useCallback(() => {
        setSelectedTable(null);
        setStep("pick");
    }, []);

    // ── Show order UI once table is picked ────────────────────────────────────
    if (selectedTable && resolvedSellerId) {
        return (
            <OrderTabs
                sellerId={resolvedSellerId}
                table={selectedTable}
                onClear={handleClear}
            />
        );
    }

    // ── Table identification steps ─────────────────────────────────────────────
    if (step === "qr") {
        return (
            <View style={{ flex: 1 }}>
                <BackHeader title="Scan QR" onBack={() => setStep("pick")} />
                <WaiterQRScan onTableResolved={handleTableResolved} />
            </View>
        );
    }

    if (step === "code") {
        return (
            <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
                <BackHeader title="Enter Code" onBack={() => setStep("pick")} />
                <WaiterCodeEntry onTableResolved={handleTableResolved} />
            </View>
        );
    }

    if (step === "select") {
        return (
            <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
                <BackHeader title="Select Table" onBack={() => setStep("pick")} />
                <WaiterTableSelect onTableSelected={handleTableSelected} />
            </View>
        );
    }

    return (
        <WaiterMethodPicker onSelect={(m) => setStep(m)} />
    );
}

// ── Small back header ─────────────────────────────────────────────────────────
function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.backHeader, { paddingTop: insets.top + s(8) }]}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.75}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path d="M15 18l-6-6 6-6" stroke="#111827" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            </TouchableOpacity>
            <Text style={styles.backTitle}>{title}</Text>
            <View style={{ width: s(36) }} />
        </View>
    );
}

const styles = StyleSheet.create({
    tableBar: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        backgroundColor: "#EDE9FE", paddingHorizontal: s(16), paddingVertical: s(10),
        borderBottomWidth: 1, borderBottomColor: "#C4B5FD",
    },
    tableBarLabel: { fontSize: sf(13), color: "#6B7280", fontWeight: "500" },
    tableBarName: { fontWeight: "700", color: "#6C63FF" },
    changeBtn: {
        backgroundColor: "#fff", borderRadius: s(8),
        paddingHorizontal: s(10), paddingVertical: s(4),
        borderWidth: 1, borderColor: "#C4B5FD",
    },
    changeBtnText: { fontSize: sf(12), fontWeight: "600", color: "#6C63FF" },
    backHeader: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        backgroundColor: "#fff", paddingHorizontal: s(12), paddingBottom: s(10),
        borderBottomWidth: 1, borderBottomColor: "#E5E7EB",
    },
    backBtn: {
        width: s(36), height: s(36), borderRadius: s(18),
        backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center",
    },
    backTitle: { fontSize: sf(16), fontWeight: "700", color: "#111827" },
});
