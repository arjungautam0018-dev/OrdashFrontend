import React, { useState, useEffect } from "react";
import {
    Modal, View, Text, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, Image,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import Svg, { Path } from "react-native-svg";
import { API } from "../../Extras/api";
import { TableItem } from "./tableCard";

const DownloadIcon = ({ size = 20, color = "#1a1a1a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3v13M7 11l5 5 5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 19h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
);

const EditIcon = ({ size = 18, color = "#6B7280" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

interface Props {
    table: TableItem | null;
    onClose: () => void;
    onEdit: (table: TableItem) => void;
    onQRGenerated: (tableId: string, imageUrl: string) => void;
}

export default function QRPopup({ table, onClose, onEdit, onQRGenerated }: Props) {
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (table) {
            // If QR already stored on the table object, use it
            if (table.qrcode) {
                setQrImage(table.qrcode);
            } else {
                setQrImage(null);
                generateQR();
            }
        }
    }, [table]);

    const generateQR = async () => {
        if (!table) return;
        setLoading(true);
        try {
            const res = await fetch(API.generateQR, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ tableId: table._id }),
            });
            const data = await res.json();
            if (data.success) {
                setQrImage(data.image);
                onQRGenerated(table._id, data.image);
            } else {
                Alert.alert("Error", data.message);
            }
        } catch {
            Alert.alert("Error", "Could not generate QR code.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!qrImage) return;
        setDownloading(true);
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission needed", "Allow media library access to save the QR code.");
                return;
            }
            const filename = `qr_${table?._id}_${Date.now()}.png`;
            const fileUri = FileSystem.documentDirectory + filename;
            await FileSystem.downloadAsync(qrImage, fileUri);
            await MediaLibrary.saveToLibraryAsync(fileUri);
            Alert.alert("Saved", "QR code saved to your photo library.");
        } catch {
            Alert.alert("Error", "Could not download QR code.");
        } finally {
            setDownloading(false);
        }
    };

    const handleClose = () => {
        setQrImage(null);
        onClose();
    };

    return (
        <Modal visible={!!table} transparent animationType="slide" onRequestClose={handleClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose} />
            <View style={styles.sheet}>
                <View style={styles.handle} />

                {/* Header row */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.sheetTitle}>{table?.name}</Text>
                        <Text style={styles.sheetSub}>{table?.capacity} guests · QR Code</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => { handleClose(); if (table) onEdit(table); }}
                    >
                        <EditIcon size={18} color="#6B7280" />
                        <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* QR area */}
                <View style={styles.qrBox}>
                    {loading ? (
                        <View style={styles.qrPlaceholder}>
                            <ActivityIndicator size="large" color="#1E3A8A" />
                            <Text style={styles.qrLoadingText}>Generating QR...</Text>
                        </View>
                    ) : qrImage ? (
                        <Image source={{ uri: qrImage }} style={styles.qrImage} resizeMode="contain" />
                    ) : (
                        <View style={styles.qrPlaceholder}>
                            <Text style={styles.qrLoadingText}>No QR yet</Text>
                        </View>
                    )}
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} disabled={downloading || !qrImage}>
                        {downloading
                            ? <ActivityIndicator color="#1a1a1a" />
                            : <>
                                <DownloadIcon size={18} color="#1a1a1a" />
                                <Text style={styles.downloadText}>Save to Gallery</Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    sheet: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12,
    },
    handle: {
        width: 40, height: 4, borderRadius: 2,
        backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 16,
    },
    headerRow: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 20,
    },
    sheetTitle: { fontSize: 18, fontWeight: "700", color: "#1E3A8A" },
    sheetSub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
    editBtn: {
        flexDirection: "row", alignItems: "center", gap: 4,
        paddingHorizontal: 12, paddingVertical: 7,
        borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB",
        backgroundColor: "#F9FAFB",
    },
    editBtnText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },

    qrBox: {
        alignItems: "center", justifyContent: "center",
        backgroundColor: "#F9FAFB", borderRadius: 16,
        borderWidth: 1, borderColor: "#E5E7EB",
        padding: 16, marginBottom: 20,
    },
    qrImage: { width: 220, height: 220, borderRadius: 8 },
    qrPlaceholder: { width: 220, height: 220, alignItems: "center", justifyContent: "center", gap: 8 },
    qrLoadingText: { fontSize: 14, color: "#9CA3AF", fontWeight: "500" },

    actions: { gap: 10 },
    downloadBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 8, paddingVertical: 14, borderRadius: 12,
        backgroundColor: "#F7D060",
    },
    downloadText: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
});
