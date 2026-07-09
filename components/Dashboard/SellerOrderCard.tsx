import React, { useState } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

// ── Icons ─────────────────────────────────────────────────────────────────────

const TableIcon = ({ color = "#6C63FF" }) => (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path d="M3 6h18M3 10h18M6 10v8M18 10v8M10 10v8M14 10v8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
            d={open ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}
            stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        />
    </Svg>
);

// ── Status config ─────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "done";

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; border: string; text: string }> = {
    pending:   { label: "Pending",   bg: "#FEF9E7", border: "#F7D060", text: "#92400E" },
    confirmed: { label: "Confirmed", bg: "#EFF6FF", border: "#BFDBFE", text: "#1E3A8A" },
    preparing: { label: "Preparing", bg: "#EDE9FE", border: "#C4B5FD", text: "#5B21B6" },
    ready:     { label: "Ready",     bg: "#F0FDF4", border: "#BBF7D0", text: "#16A34A" },
    done:      { label: "Done",      bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280" },
};

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "done"];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SellerOrder {
    _id: string;
    tableId: string;
    tableName?: string;
    items: { name: string; price: number; quantity: number }[];
    total: number;
    status: OrderStatus;
    createdAt: string;
}

interface Props {
    order: SellerOrder;
    onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SellerOrderCard({ order, onStatusChange }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [updating, setUpdating] = useState(false);

    const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
    const currentIdx = STATUS_FLOW.indexOf(order.status);
    const nextStatus = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

    const time = new Date(order.createdAt).toLocaleTimeString([], {
        hour: "2-digit", minute: "2-digit",
    });

    const handleAdvance = async () => {
        if (!nextStatus || updating) return;
        setUpdating(true);
        try {
            await onStatusChange(order._id, nextStatus);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <View style={[styles.card, { borderColor: cfg.border, borderLeftWidth: 4, borderLeftColor: cfg.border }]}>
            {/* ── Header row ── */}
            <TouchableOpacity
                style={styles.header}
                onPress={() => setExpanded(e => !e)}
                activeOpacity={0.7}
            >
                {/* Table pill */}
                <View style={styles.tablePill}>
                    <TableIcon color="#6C63FF" />
                    <Text style={styles.tableName}>{order.tableName ?? `Table`}</Text>
                </View>

                {/* Time */}
                <Text style={styles.time}>{time}</Text>

                {/* Status badge */}
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                    <Text style={[styles.statusText, { color: cfg.text }]}>{cfg.label}</Text>
                </View>

                <ChevronIcon open={expanded} />
            </TouchableOpacity>

            {/* ── Expanded items ── */}
            {expanded && (
                <View style={styles.body}>
                    <View style={styles.divider} />
                    {order.items.map((item, i) => (
                        <View key={i} style={styles.itemRow}>
                            <Text style={styles.itemQty}>×{item.quantity}</Text>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₹{order.total}</Text>
                    </View>
                </View>
            )}

            {/* ── Advance status button ── */}
            {order.status !== "done" && (
                <TouchableOpacity
                    style={[styles.advanceBtn, updating && styles.advanceBtnDisabled]}
                    onPress={handleAdvance}
                    disabled={updating}
                    activeOpacity={0.8}
                >
                    {updating ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.advanceBtnText}>
                            Mark as {nextStatus ? STATUS_CONFIG[nextStatus].label : ""}
                        </Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 8,
    },
    tablePill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "#F5F3FF",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    tableName: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6C63FF",
    },
    time: {
        flex: 1,
        fontSize: 12,
        color: "#9CA3AF",
        fontWeight: "500",
        marginLeft: 4,
    },
    statusBadge: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "700",
    },
    body: {
        paddingHorizontal: 14,
        paddingBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginVertical: 8,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    itemQty: {
        fontSize: 13,
        fontWeight: "700",
        color: "#6C63FF",
        width: 28,
    },
    itemName: {
        flex: 1,
        fontSize: 13,
        color: "#374151",
        fontWeight: "500",
    },
    itemPrice: {
        fontSize: 13,
        fontWeight: "600",
        color: "#111827",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6B7280",
    },
    totalValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
    },
    advanceBtn: {
        backgroundColor: "#6C63FF",
        marginHorizontal: 14,
        marginBottom: 12,
        marginTop: 4,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    advanceBtnDisabled: {
        opacity: 0.6,
    },
    advanceBtnText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
    },
});
