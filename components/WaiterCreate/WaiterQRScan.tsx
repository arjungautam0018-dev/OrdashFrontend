import React, { useState, useRef, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert,
} from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import Svg, { Path } from "react-native-svg";
import { s, sf, sw } from "../../Extras/responsive";
import { API } from "../../Extras/api";
import { TableItem } from "../Tables/tableCard";

// ── Corner SVGs ───────────────────────────────────────────────────────────────
const CornerTL = () => (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <Path d="M2 18V4a2 2 0 012-2h14" stroke="#6C63FF" strokeWidth={3} strokeLinecap="round" />
    </Svg>
);
const CornerTR = () => (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <Path d="M34 18V4a2 2 0 00-2-2H18" stroke="#6C63FF" strokeWidth={3} strokeLinecap="round" />
    </Svg>
);
const CornerBL = () => (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <Path d="M2 18v14a2 2 0 002 2h14" stroke="#6C63FF" strokeWidth={3} strokeLinecap="round" />
    </Svg>
);
const CornerBR = () => (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
        <Path d="M34 18v14a2 2 0 01-2 2H18" stroke="#6C63FF" strokeWidth={3} strokeLinecap="round" />
    </Svg>
);

interface Props {
    onTableResolved: (table: TableItem, sellerId: string) => void;
}

const FRAME_SIZE = sw(240);

export default function WaiterQRScan({ onTableResolved }: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const [processing, setProcessing] = useState(false);
    const lastScan = useRef<string | null>(null);

    useEffect(() => {
        requestPermission();
    }, []);

    if (!permission) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#6C63FF" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.permText}>Camera permission needed to scan QR codes.</Text>
                <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
                    <Text style={styles.permBtnText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleScanned = async (result: BarcodeScanningResult) => {
        const raw = result.data;
        if (processing || lastScan.current === raw) return;
        lastScan.current = raw;
        setProcessing(true);

        try {
            let parsed: { sellerId?: string; tableId?: string };
            try {
                parsed = JSON.parse(raw);
            } catch {
                Alert.alert("Invalid QR", "This QR is not recognized.", [
                    { text: "Try Again", onPress: resetScan },
                ]);
                return;
            }

            if (!parsed.sellerId || !parsed.tableId) {
                Alert.alert("Invalid QR", "QR does not contain valid table info.", [
                    { text: "Try Again", onPress: resetScan },
                ]);
                return;
            }

            const res = await fetch(API.scanQR, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sellerId: parsed.sellerId, tableId: parsed.tableId }),
            });
            const data = await res.json();

            if (data.success) {
                onTableResolved(
                    { _id: data.tableId, name: data.tableName, capacity: 0 },
                    data.sellerId
                );
            } else {
                Alert.alert("Error", data.message || "Could not process QR.", [
                    { text: "Try Again", onPress: resetScan },
                ]);
            }
        } catch (e) {
            Alert.alert("Network Error", "Could not reach server.", [
                { text: "Try Again", onPress: resetScan },
            ]);
        } finally {
            setProcessing(false);
        }
    };

    const resetScan = () => {
        lastScan.current = null;
        setProcessing(false);
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={processing ? undefined : handleScanned}
            />

            <View style={styles.topLabel}>
                <Text style={styles.title}>Scan Table QR</Text>
                <Text style={styles.subtitle}>Point at the table's QR code</Text>
            </View>

            <View style={styles.frameWrapper}>
                <View style={styles.frame}>
                    <View style={[styles.corner, styles.cornerTL]}><CornerTL /></View>
                    <View style={[styles.corner, styles.cornerTR]}><CornerTR /></View>
                    <View style={[styles.corner, styles.cornerBL]}><CornerBL /></View>
                    <View style={[styles.corner, styles.cornerBR]}><CornerBR /></View>
                </View>
            </View>

            {processing && (
                <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color="#6C63FF" />
                    <Text style={styles.processingText}>Processing...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    center: {
        flex: 1, backgroundColor: "#1a1a1a",
        alignItems: "center", justifyContent: "center", padding: s(24),
    },
    permText: { color: "#fff", fontSize: sf(15), textAlign: "center", marginBottom: s(20) },
    permBtn: {
        backgroundColor: "#6C63FF", paddingVertical: s(12), paddingHorizontal: s(28),
        borderRadius: s(10),
    },
    permBtnText: { fontSize: sf(15), fontWeight: "700", color: "#fff" },
    topLabel: {
        position: "absolute", top: s(60), width: "100%", alignItems: "center",
    },
    title: { color: "#fff", fontSize: sf(22), fontWeight: "700" },
    subtitle: { color: "rgba(255,255,255,0.65)", fontSize: sf(14), marginTop: s(4) },
    frameWrapper: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        alignItems: "center", justifyContent: "center",
    },
    frame: { width: FRAME_SIZE, height: FRAME_SIZE, position: "relative" },
    corner: { position: "absolute" },
    cornerTL: { top: 0, left: 0 },
    cornerTR: { top: 0, right: 0 },
    cornerBL: { bottom: 0, left: 0 },
    cornerBR: { bottom: 0, right: 0 },
    processingOverlay: {
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        alignItems: "center", justifyContent: "center", gap: s(12),
    },
    processingText: { color: "#fff", fontSize: sf(16), fontWeight: "600" },
});
