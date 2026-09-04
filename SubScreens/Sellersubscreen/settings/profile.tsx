import React, { useEffect, useState } from "react";
import {
    View, Text, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { s, sf } from "../../../Extras/responsive";
import { authFetch } from "../../../Extras/authFetch";
import { API } from "../../../Extras/api";
import * as ImagePicker from "expo-image-picker";
import ProfileAvatar from "../../../components/Profile/ProfileAvatar";
import ProfileInfoCard, { SellerProfile } from "../../../components/Profile/ProfileInfoCard";
import EditProfilePopup from "../../../components/Profile/EditProfilePopup";

const PencilIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
            stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default function ProfileSettings() {
    const [seller, setSeller] = useState<SellerProfile | null>(null);
    const [loading, setLoading]   = useState(true);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        try {

            // Instant render from cache
            const cached = await AsyncStorage.getItem("seller_profile");
            if(cached) setSeller(JSON.parse(cached));

            // Fetch from backend
            const res  = await authFetch(API.getSellerProfile);
            const data = await res.json();
            if (data.success) {
                const mapped: SellerProfile = {
                    name:     data.seller.name,
                    email:    data.seller.email,
                    shopName: data.seller.shopName,
                    phone:    data.seller.phone,
                    city:     data.seller.city,
                    address:  data.seller.address,
                    logoUrl:  data.seller.profilePic || null,
                }
                setSeller(mapped);
                await AsyncStorage.setItem("seller_profile", JSON.stringify(mapped));

            };
            

        } catch {}
        setLoading(false);
    };

    // TODO: wire to backend when ready
    const handleSave = async (updated: SellerProfile) => {
        try{
            const res = await authFetch(API.updateSellerProfile, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name:       updated.name,
                    phone:      updated.phone,
                    shopName:   updated.shopName,
                    city:       updated.city,
                    address:    updated.address,
                    profilePic: updated.logoUrl,
                }),
            });
            const data = await res.json();
            if (data.success) {
                const fresh : SellerProfile = { ...updated , logoUrl: data.seller.profilePic || null};
                setSeller(fresh);
                await AsyncStorage.setItem("seller_profile", JSON.stringify(fresh));
                Alert.alert("Success", "Profile updated successfully.");
                console.log("Profile updated successfully:", fresh);
                setEditOpen(false);
            }
            else{
                Alert.alert("Error", "Failed to update profile. Please try again.");
            }
        }
        catch{
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        }
    };

    const uploadLogo = async (uri: string) => {
        try {
            console.log("[uploadLogo] starting upload, uri:", uri);

            // Read file as base64 using expo-file-system (works in Expo Go + production)
            const FileSystem = require("expo-file-system/legacy");
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            console.log("[uploadLogo] base64 length:", base64.length);

            const raw   = await AsyncStorage.getItem("session");
            const token = raw ? JSON.parse(raw)?.token : null;

            // Send as JSON with base64 string — backend decodes and uploads to Cloudinary
            console.log("[uploadLogo] calling API:", API.uploadSellerLogo);
            const res = await fetch(API.uploadSellerLogo, {
                method:  "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ imageBase64: base64 }),
            });

            console.log("[uploadLogo] response status:", res.status);
            const data = await res.json();
            console.log("[uploadLogo] response body:", JSON.stringify(data));

            if (data.success) {
                const updated = { ...seller!, logoUrl: data.url };
                setSeller(updated);
                await AsyncStorage.setItem("seller_profile", JSON.stringify(updated));
                Alert.alert("Success", "Logo updated successfully.");
            } else {
                Alert.alert("Error", data.message ?? "Failed to update logo.");
            }
        } catch (e) {
            console.error("[uploadLogo] error:", e);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        }
    };

    const handleUploadLogo = async() => {
        console.log("[handleUploadLogo] opening image picker");
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        console.log("[handleUploadLogo] picker result canceled:", result.canceled);
        if(!result.canceled){
            const uri = result.assets[0].uri;
            console.log("[handleUploadLogo] selected uri:", uri);
            uploadLogo(uri);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color="#6C63FF" />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* Edit mode button */}
                <TouchableOpacity style={styles.editBtn} onPress={() => setEditOpen(true)} activeOpacity={0.85}>
                    <PencilIcon />
                    <Text style={styles.editBtnText}>Edit Mode</Text>
                </TouchableOpacity>

                {/* Avatar / logo */}
                <ProfileAvatar
                    logoUrl={seller?.logoUrl}
                    name={seller?.name}
                    onUploadPress={handleUploadLogo}
                />

                {/* Name + email under avatar */}
                <View style={styles.nameRow}>
                    <Text style={styles.name}>{seller?.name ?? "—"}</Text>
                    <Text style={styles.emailSub}>{seller?.email ?? "—"}</Text>
                </View>

                {/* Info card */}
                <ProfileInfoCard seller={seller} />

            </ScrollView>

            <EditProfilePopup
                visible={editOpen}
                seller={seller}
                onClose={() => setEditOpen(false)}
                onSave={handleSave}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    centered:  { flex: 1, alignItems: "center", justifyContent: "center" },
    scroll:    { padding: s(20), paddingBottom: s(40) },
    editBtn: {
        flexDirection: "row", alignItems: "center", gap: s(6),
        alignSelf: "flex-end",
        backgroundColor: "#F7D060", paddingHorizontal: s(14), paddingVertical: s(8),
        borderRadius: s(10), marginBottom: s(20),
        shadowColor: "#F7D060", shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 }, shadowRadius: s(6), elevation: 4,
    },
    editBtnText: { color: "#1a1a1a", fontSize: sf(13), fontWeight: "700" },
    nameRow:   { alignItems: "center", marginBottom: s(24) },
    name:      { fontSize: sf(20), fontWeight: "700", color: "#111827" },
    emailSub:  { fontSize: sf(13), color: "#6B7280", marginTop: s(3) },
});
