import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle } from "react-native-svg";
import { s, sf } from "../Extras/responsive";

import CustomerTopBar from "../components/Customer/TopBar/CustomerTopBar";
import HomeScreen from "../SubScreens/Customersubscreen/home";
import CartScreen from "../SubScreens/Customersubscreen/cart";
import OrdersScreen from "../SubScreens/Customersubscreen/orders";
import { MenuItem } from "../components/Customer/Menu/MenuCard";
import { API } from "../Extras/api";

// ── Icons ─────────────────────────────────────────────────────────────────────

const MenuTabIcon = ({ color }: { color: string }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const CartTabIcon = ({ color, badge }: { color: string; badge?: number }) => (
    <View style={{ width: 24, height: 24 }}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        {!!badge && badge > 0 && (
            <View style={{
                position: "absolute", top: -s(4), right: -s(6),
                backgroundColor: "#EF4444", borderRadius: s(8),
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

const OrdersTabIcon = ({ color }: { color: string }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
            stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v0Z"
            stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 12h6M9 16h4"
            stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

// ── Tab navigator ─────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = "#0D6E4F";
const INACTIVE_COLOR = "#9CA3AF";

interface Props {
    route: {
        params: {
            sellerId: string;
            tableId: string;
            tableName: string;
            shopName?: string;
        };
    };
}

export default function DashboardCustomer({ route }: Props) {
    const { sellerId, tableId, tableName, shopName } = route.params;
    const insets = useSafeAreaInsets();

    const [cart, setCart] = useState<Record<string, number>>({});
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

    // Fetch menu eagerly on mount so Cart tab always has item data
    useEffect(() => {
        const loadMenu = async () => {
            if (__DEV__) console.log(`[DashboardCustomer] eager menu fetch for sellerId=${sellerId}`);
            try {
                const res = await fetch(API.menuProducts(sellerId));
                const data = await res.json();
                if (data.success) setMenuItems(data.products);
            } catch (e) {
                if (__DEV__) console.error("[DashboardCustomer] menu fetch error:", e);
            }
        };
        loadMenu();
    }, [sellerId]);

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
    }, []);

    const handleMenuLoaded = useCallback((items: MenuItem[]) => {
        setMenuItems(items);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <CustomerTopBar tableName={tableName} shopName={shopName} />
            <Tab.Navigator
                screenOptions={({ route: r }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: ACTIVE_COLOR,
                    tabBarInactiveTintColor: INACTIVE_COLOR,
                    tabBarStyle: {
                        backgroundColor: "#fff",
                        borderTopWidth: 1,
                        borderTopColor: "#E5E7EB",
                        height: s(60) + insets.bottom,
                        paddingBottom: insets.bottom,
                    },
                    tabBarLabelStyle: { fontSize: sf(11), fontWeight: "600" },
                    tabBarIcon: ({ color }) => {
                        if (r.name === "Menu") return <MenuTabIcon color={color} />;
                        if (r.name === "Cart") return <CartTabIcon color={color} badge={cartCount} />;
                        if (r.name === "Orders") return <OrdersTabIcon color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Menu">
                    {() => (
                        <HomeScreen
                            sellerId={sellerId}
                            cart={cart}
                            menuItems={menuItems}
                            onAdd={handleAdd}
                            onMenuLoaded={handleMenuLoaded}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen name="Cart">
                    {() => (
                        <CartScreen
                            sellerId={sellerId}
                            tableId={tableId}
                            cart={cart}
                            menuItems={menuItems}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            onOrderPlaced={handleOrderPlaced}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen name="Orders">
                    {() => <OrdersScreen sellerId={sellerId} tableId={tableId} />}
                </Tab.Screen>
            </Tab.Navigator>
        </View>
    );
}
