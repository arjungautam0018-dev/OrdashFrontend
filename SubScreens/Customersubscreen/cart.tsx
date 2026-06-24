import React from "react";
import { View, StyleSheet } from "react-native";
import CartSection from "../../components/Customer/Cart/CartSection";
import { MenuItem } from "../../components/Customer/Menu/MenuCard";

interface Props {
    sellerId: string;
    tableId: string;
    cart: Record<string, number>;
    menuItems: MenuItem[];
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onOrderPlaced: () => void;
}

export default function CartScreen({ sellerId, tableId, cart, menuItems, onIncrease, onDecrease, onOrderPlaced }: Props) {
    return (
        <View style={styles.container}>
            <CartSection
                sellerId={sellerId}
                tableId={tableId}
                cart={cart}
                menuItems={menuItems}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onOrderPlaced={onOrderPlaced}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
});
