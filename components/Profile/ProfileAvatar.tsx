import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { s, sf } from "../../Extras/responsive";

interface Props {
    logoUrl?: string | null;
    name?: string | null;
    onUploadPress: () => void;
}

const CameraIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
            stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 17a4 4 0 100-8 4 4 0 000 8z"
            stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default function ProfileAvatar({ logoUrl, name, onUploadPress }: Props) {
    const initial = name?.charAt(0).toUpperCase() ?? "?";

    return (
        <View style={styles.wrapper}>
            <View style={styles.avatarContainer}>
                {logoUrl ? (
                    <Image source={{ uri: logoUrl }} style={styles.logo} />
                ) : (
                    <View style={styles.initialsCircle}>
                        <Text style={styles.initial}>{initial}</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.uploadBtn} onPress={onUploadPress} activeOpacity={0.8}>
                    <CameraIcon />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper:         { alignItems: "center", marginBottom: s(24) },
    avatarContainer: { position: "relative", width: s(90), height: s(90) },
    logo: {
        width: s(90), height: s(90), borderRadius: s(45),
        borderWidth: 3, borderColor: "#6C63FF",
    },
    initialsCircle: {
        width: s(90), height: s(90), borderRadius: s(45),
        backgroundColor: "#6C63FF", alignItems: "center", justifyContent: "center",
        borderWidth: 3, borderColor: "#EDE9FE",
    },
    initial:   { color: "#fff", fontSize: sf(36), fontWeight: "700" },
    uploadBtn: {
        position: "absolute", bottom: 0, right: 0,
        backgroundColor: "#4F46E5", borderRadius: s(16),
        width: s(32), height: s(32),
        alignItems: "center", justifyContent: "center",
        borderWidth: 2, borderColor: "#fff",
    },
});
