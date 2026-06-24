import React, { useEffect, useState, useRef } from "react";
import {
    View, Text, StyleSheet, ActivityIndicator,
    Alert, TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import Svg, { Path, Rect } from "react-native-svg";
import { API } from "../Extras/api";

// ── Corner frame SVG ──────────────────────────────────────────────────────────
const CornerTL = () => (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <Path d="M2 18V4a2 2 0 012-2h14" stroke="#F7D060" strokeWidth={3} strokeLinecap="round" />
    </Svg>
);
const CornerTR = () => (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <Path d="M34 18V4a2 2 0 00-2-2H18" stroke="#F7D060" strokeWidth={3} strokeLinecap="round" />
    </Svg>
);
const CornerBL = () => (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <Path d="M2 18v14a2 2 0 002 2h14" stroke="#F7D060" strokeWidth={3} strokeLinecap="round" />
    </Svg>
);
const CornerBR = () => (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <Path d="M34 18v14a2 2 0 01-2 2H18" stroke="#F7D060" strokeWidth={3} strokeLinecap="round" />
    </Svg>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function ScanQR({ navigation }: { navigation?: any }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [processing, setProcessing] = useState(false);
    const [scannedInfo, setScannedInfo] = useState<{ tableName?: string; message?: string } | null>(null);
    const lastScan = useRef<string | null>(null);

    useEffect(() => {
        requestPermission();
    }, []);

    if (!permission) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#F7D060" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.permText}>Camera permission is required to scan QR codes.</Text>
                <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
                    <Text style={styles.permBtnText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleScanned = async (result: BarcodeScanningResult) => {
        const raw = result.data;
        console.log("[Camera] barcode scanned, raw data:", raw);

        if (processing || lastScan.current === raw) {
            console.log("[Camera] skipping — already processing or same QR");
            return;
        }
        lastScan.current = raw;
        setProcessing(true);

        try {
            let parsed: { sellerId?: string; tableId?: string };
            try {
                parsed = JSON.parse(raw);
                console.log("[Camera] parsed QR payload:", parsed);
            } catch {
                console.warn("[Camera] QR is not valid JSON:", raw);
                Alert.alert("Invalid QR", "This QR code is not recognized.", [
                    { text: "Try Again", onPress: resetScan },
                ]);
                return;
            }

            if (!parsed.sellerId || !parsed.tableId) {
                console.warn("[Camera] QR missing sellerId or tableId:", parsed);
                Alert.alert("Invalid QR", "This QR code does not contain valid table information.", [
                    { text: "Try Again", onPress: resetScan },
                ]);
                return;
            }

            console.log(`[Camera] sending scan to: ${API.scanQR}`);
            console.log("[Camera] body:", { sellerId: parsed.sellerId, tableId: parsed.tableId });

            const res = await fetch(API.scanQR, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sellerId: parsed.sellerId,
                    tableId: parsed.tableId,
                }),
            });

            console.log(`[Camera] scan response status: ${res.status}`);
            const data = await res.json();
            console.log("[Camera] scan response body:", JSON.stringify(data));

            if (data.success) {
                console.log(`[Camera] success — navigating to DashboardCustomer with tableName="${data.tableName}"`);
                if (navigation) {
                    navigation.replace("DashboardCustomer", {
                        sellerId: data.sellerId,
                        tableId: data.tableId,
                        tableName: data.tableName,
                    });
                } else {
                    console.warn("[Camera] no navigation prop, showing success card instead");
                    setScannedInfo({ tableName: data.tableName, message: data.message });
                }
            } else {
                console.warn("[Camera] scan failed:", data.message);
                Alert.alert("Error", data.message || "Could not process QR.", [
                    { text: "Try Again", onPress: resetScan },
                ]);
            }
        } catch (e) {
            console.error("[Camera] NETWORK ERROR:", e);
            console.error("[Camera] scan URL was:", API.scanQR);
            Alert.alert("Network Error", "Could not reach the server.", [
                { text: "Try Again", onPress: resetScan },
            ]);
        } finally {
            setProcessing(false);
        }
    };

    const resetScan = () => {
        lastScan.current = null;
        setScannedInfo(null);
        setProcessing(false);
    };

    // ── Success screen ──────────────────────────────────────────────────────
    if (scannedInfo) {
        return (
            <View style={styles.successContainer}>
                <View style={styles.successCard}>
                    <Text style={styles.successEmoji}>✓</Text>
                    <Text style={styles.successTitle}>{scannedInfo.tableName ?? "Table Found"}</Text>
                    <Text style={styles.successMsg}>{scannedInfo.message ?? "QR scanned successfully."}</Text>
                    <TouchableOpacity style={styles.scanAgainBtn} onPress={resetScan}>
                        <Text style={styles.scanAgainText}>Scan Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // ── Scanner screen ──────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={processing ? undefined : handleScanned}
            />

            {/* Top label */}
            <View style={styles.topLabel}>
                <Text style={styles.title}>Scan QR Code</Text>
                <Text style={styles.subtitle}>Point at a table QR code</Text>
            </View>

            {/* Scan frame */}
            <View style={styles.frameWrapper}>
                <View style={styles.frame}>
                    <View style={[styles.corner, styles.cornerTL]}><CornerTL /></View>
                    <View style={[styles.corner, styles.cornerTR]}><CornerTR /></View>
                    <View style={[styles.corner, styles.cornerBL]}><CornerBL /></View>
                    <View style={[styles.corner, styles.cornerBR]}><CornerBR /></View>
                </View>
            </View>

            {/* Processing overlay */}
            {processing && (
                <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color="#F7D060" />
                    <Text style={styles.processingText}>Processing...</Text>
                </View>
            )}
        </View>
    );
}

const FRAME_SIZE = 240;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },

    topLabel: {
        position: "absolute", top: 70, width: "100%", alignItems: "center",
    },
    title: { color: "#fff", fontSize: 22, fontWeight: "700", letterSpacing: 0.4 },
    subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 },

    frameWrapper: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        alignItems: "center", justifyContent: "center",
    },
    frame: {
        width: FRAME_SIZE, height: FRAME_SIZE,
        position: "relative",
    },
    corner: { position: "absolute" },
    cornerTL: { top: 0, left: 0 },
    cornerTR: { top: 0, right: 0 },
    cornerBL: { bottom: 0, left: 0 },
    cornerBR: { bottom: 0, right: 0 },

    processingOverlay: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        alignItems: "center", justifyContent: "center", gap: 12,
    },
    processingText: { color: "#fff", fontSize: 16, fontWeight: "600" },

    center: {
        flex: 1, backgroundColor: "#000",
        alignItems: "center", justifyContent: "center", padding: 24,
    },
    permText: { color: "#fff", fontSize: 15, textAlign: "center", marginBottom: 20 },
    permBtn: {
        backgroundColor: "#F7D060", paddingVertical: 12, paddingHorizontal: 28,
        borderRadius: 10,
    },
    permBtnText: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },

    successContainer: {
        flex: 1, backgroundColor: "#000",
        alignItems: "center", justifyContent: "center", padding: 24,
    },
    successCard: {
        backgroundColor: "#fff", borderRadius: 20, padding: 32,
        alignItems: "center", width: "100%",
    },
    successEmoji: { fontSize: 48, color: "#16A34A", marginBottom: 12 },
    successTitle: { fontSize: 22, fontWeight: "700", color: "#1E3A8A", marginBottom: 8 },
    successMsg: { fontSize: 15, color: "#6B7280", textAlign: "center", marginBottom: 24 },
    scanAgainBtn: {
        backgroundColor: "#F7D060", paddingVertical: 13, paddingHorizontal: 32,
        borderRadius: 10,
    },
    scanAgainText: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
});
