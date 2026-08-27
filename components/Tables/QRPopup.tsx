import React, { useState, useEffect, useRef } from "react";
import {
    Modal, View, Text, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, Image,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { s, sf, sw } from "../../Extras/responsive";
import * as MediaLibrary from "expo-media-library";
import Svg, { Path } from "react-native-svg";
import { API } from "../../Extras/api";
import { authFetch } from "../../Extras/authFetch";
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
    const [shopName, setShopName] = useState<string>("Our Restaurant");

    const viewShotRef = useRef<ViewShot>(null);

    useEffect(() => {
        if (table) {
            if (table.qrcode) {
                setQrImage(table.qrcode);
            } else {
                setQrImage(null);
                generateQR();
            }
        }
        // fetch shop name
        authFetch(API.sellerProfile)
            .then(r => r.json())
            .then(d => { if (d.success && d.seller?.shopName) setShopName(d.seller.shopName); })
            .catch(() => {});
    }, [table]);

    const generateQR = async () => {
        if (!table) return;
        setLoading(true);
        try {
            const res = await authFetch(API.generateQR, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        if (!qrImage || !viewShotRef.current) return;
        setDownloading(true);
        try {
            const uri = await (viewShotRef.current as any).capture();
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("Saved", "QR card saved to your photo library.");
        } catch (e) {
            console.error("[QRPopup] download error:", e);
            Alert.alert("Error", String(e));
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

                {/* QR area — visible preview */}
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
                    {table?.code && (
                        <Text style={styles.codeLabel}>{table.code}</Text>
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

            {/* Hidden ViewShot card — captured on download */}
            {qrImage && (
                <ViewShot
                    ref={viewShotRef}
                    options={{ format: "png", quality: 1 }}
                    style={styles.hiddenCard}
                >
                    <View style={styles.cardBg}>
                        <Image source={{ uri: qrImage }} style={styles.cardQR} resizeMode="contain" />
                        <Text style={styles.cardCode}>{table?.code ?? table?.name}</Text>
                        <Text style={styles.cardShopName}>{shopName}</Text>
                    </View>
                </ViewShot>
            )}
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
        borderTopLeftRadius: s(24), borderTopRightRadius: s(24),
        paddingHorizontal: s(20), paddingBottom: s(40), paddingTop: s(12),
    },
    handle: {
        width: s(40), height: s(4), borderRadius: s(2),
        backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: s(16),
    },
    headerRow: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: s(20),
    },
    sheetTitle: { fontSize: sf(18), fontWeight: "700", color: "#1E3A8A" },
    sheetSub: { fontSize: sf(13), color: "#6B7280", marginTop: s(2) },
    editBtn: {
        flexDirection: "row", alignItems: "center", gap: s(4),
        paddingHorizontal: s(12), paddingVertical: s(7),
        borderRadius: s(8), borderWidth: 1, borderColor: "#E5E7EB",
        backgroundColor: "#F9FAFB",
    },
    editBtnText: { fontSize: sf(13), fontWeight: "600", color: "#6B7280" },
    qrBox: {
        alignItems: "center", justifyContent: "center",
        backgroundColor: "#F9FAFB", borderRadius: s(16),
        borderWidth: 1, borderColor: "#E5E7EB",
        padding: s(16), marginBottom: s(20),
    },
    qrImage: { width: sw(220), height: sw(220), borderRadius: s(8) },
    qrPlaceholder: { width: sw(220), height: sw(220), alignItems: "center", justifyContent: "center", gap: s(8) },
    qrLoadingText: { fontSize: sf(14), color: "#9CA3AF", fontWeight: "500" },
    codeLabel: {
        marginTop: s(12), fontSize: sf(20), fontWeight: "800",
        color: "#1E3A8A", letterSpacing: 3, textAlign: "center",
    },
    actions: { gap: s(10) },
    downloadBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: s(8), paddingVertical: s(14), borderRadius: s(12),
        backgroundColor: "#F7D060",
    },
    downloadText: { fontSize: sf(15), fontWeight: "700", color: "#1a1a1a" },

    // Hidden capture card
    hiddenCard: {
        position: "absolute", top: -2000, left: 0,
    },
    cardBg: {
        width: sw(320), backgroundColor: "#fff",
        alignItems: "center", paddingVertical: s(32),
        paddingHorizontal: s(24), borderRadius: s(16),
    },
    cardQR: { width: sw(260), height: sw(260), marginBottom: s(20) },
    cardCode: {
        fontSize: sf(24), fontWeight: "800", color: "#1E3A8A",
        letterSpacing: 2, marginBottom: s(8), textAlign: "center",
    },
    cardShopName: {
        fontSize: sf(15), fontWeight: "600", color: "#6B7280",
        textAlign: "center",
    },
});
