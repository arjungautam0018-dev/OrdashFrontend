import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MenuSection from "../../components/Customer/Menu/MenuSection";
import { MenuItem } from "../../components/Customer/Menu/MenuCard";

interface Props {
    sellerId: string;
    cart: Record<string, number>;
    menuItems: MenuItem[];
    onAdd: (item: MenuItem) => void;
    onMenuLoaded: (items: MenuItem[]) => void;
}

export default function HomeScreen({ sellerId, cart, menuItems, onAdd, onMenuLoaded }: Props) {
    return (
        <View style={styles.container}>
            <MenuSection
                sellerId={sellerId}
                cart={cart}
                onAdd={onAdd}
                onMenuLoaded={onMenuLoaded}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
});
