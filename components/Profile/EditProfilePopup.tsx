import React, { useState, useEffect } from "react";
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    ScrollView, StyleSheet, ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { s, sf } from "../../Extras/responsive";
import { SellerProfile } from "./ProfileInfoCard";

interface Props {
    visible: boolean;
    seller: SellerProfile | null;
    onClose: () => void;
    onSave: (updated: SellerProfile) => Promise<void>;
}

const CloseIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M18 6L6 18M6 6l12 12" stroke="#6B7280" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
);

interface FieldProps {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
    keyboardType?: "default" | "email-address" | "phone-pad";
    multiline?: boolean;
}

function Field({ label, value, onChangeText, placeholder, keyboardType = "default", multiline }: FieldProps) {
    return (
        <View style={field.wrapper}>
            <Text style={field.label}>{label}</Text>
            <TextInput
                style={[field.input, multiline && field.multiline]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder ?? label}
                placeholderTextColor="#9CA3AF"
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
            />
        </View>
    );
}

const field = StyleSheet.create({
    wrapper:   { marginBottom: s(16) },
    label:     { fontSize: sf(13), fontWeight: "600", color: "#374151", marginBottom: s(6) },
    input: {
        backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB",
        borderRadius: s(10), paddingHorizontal: s(14), paddingVertical: s(11),
        fontSize: sf(14), color: "#111827",
    },
    multiline: { height: s(80), textAlignVertical: "top" },
});

export default function EditProfilePopup({ visible, seller, onClose, onSave }: Props) {
    const [form, setForm] = useState<SellerProfile>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (seller) setForm({ ...seller });
    }, [seller, visible]);

    const set = (key: keyof SellerProfile) => (val: string) =>
        setForm(prev => ({ ...prev, [key]: val }));

    const handleSave = async () => {
        setSaving(true);
        await onSave(form);
        setSaving(false);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Profile</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <CloseIcon />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
                        <Field label="Full Name"   value={form.name ?? ""}     onChangeText={set("name")} />
                        <Field label="Email"       value={form.email ?? ""}    onChangeText={set("email")} keyboardType="email-address" />
                        <Field label="Shop Name"   value={form.shopName ?? ""} onChangeText={set("shopName")} />
                        <Field label="Phone"       value={form.phone ?? ""}    onChangeText={set("phone")} keyboardType="phone-pad" />
                        <Field label="City"        value={form.city ?? ""}     onChangeText={set("city")} />
                        <Field label="Address"     value={form.address ?? ""}  onChangeText={set("address")} multiline />
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.85}
                    >
                        {saving
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.saveBtnText}>Save Changes</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1, backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: s(24), borderTopRightRadius: s(24),
        paddingTop: s(12), paddingHorizontal: s(20), paddingBottom: s(36),
        maxHeight: "90%",
    },
    header: {
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", marginBottom: s(20),
    },
    title:    { fontSize: sf(18), fontWeight: "700", color: "#111827" },
    closeBtn: {
        width: s(36), height: s(36), borderRadius: s(10),
        backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center",
    },
    body:     { paddingBottom: s(12) },
    saveBtn: {
        backgroundColor: "#6C63FF", paddingVertical: s(15),
        borderRadius: s(12), alignItems: "center", marginTop: s(8),
    },
    saveBtnDisabled: { opacity: 0.6 },
    saveBtnText: { color: "#fff", fontSize: sf(15), fontWeight: "700" },
});
