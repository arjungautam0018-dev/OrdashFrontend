import React from "react";
import { View, StyleSheet } from "react-native";
import { s } from "../../Extras/responsive";
import ProfileRow from "./ProfileRow";

export interface SellerProfile {
    name?:       string | null;
    email?:      string | null;
    shopName?:   string | null;
    city?:       string | null;
    phone?:      string | null;
    address?:    string | null;
    logoUrl?:    string | null;
}

interface Props {
    seller: SellerProfile | null;
}

export default function ProfileInfoCard({ seller }: Props) {
    return (
        <View style={styles.card}>
            <ProfileRow label="Shop Namee"  value={seller?.shopName} />
            <ProfileRow label="Email"      value={seller?.email} />
            <ProfileRow label="Phone"      value={seller?.phone} />
            <ProfileRow label="City"       value={seller?.city} />
            <ProfileRow label="Address"    value={seller?.address} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff", borderRadius: s(14),
        paddingHorizontal: s(16), paddingVertical: s(4),
        shadowColor: "#000", shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 }, shadowRadius: s(6), elevation: 2,
    },
});
