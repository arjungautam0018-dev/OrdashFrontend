import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Alert } from "react-native";

// ── Handler — call once at app startup ───────────────────────────────────────
export function setupNotificationHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
}

// ── Request OS permission ─────────────────────────────────────────────────────
export async function requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
        Alert.alert("Permission required", "Please allow notifications to receive order updates.");
        return false;
    }
    return true;
}

// ── Core fire immediately ─────────────────────────────────────────────────────
export async function sendNotification(title: string, body: string): Promise<void> {
    const ok = await requestPermissions();
    if (!ok) return;
    await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger: {
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
        },
    });
}

// ── Customer: order placed successfully ──────────────────────────────────────
export async function notifyOrderPlaced(): Promise<void> {
    await sendNotification(
        "🛒 Order Placed!",
        "Your order has been received. We'll notify you when it's ready."
    );
}

// ── Seller: new order arrived ─────────────────────────────────────────────────
export async function notifyNewOrder(tableName: string, total: number): Promise<void> {
    await sendNotification(
        "🛎️ New Order!",
        `${tableName} placed an order for ₹${total}`
    );
}

// ── Seller: bill requested by customer ───────────────────────────────────────
export async function notifyBillRequested(tableName: string): Promise<void> {
    await sendNotification(
        "🧾 Bill Requested",
        `${tableName} has requested the bill`
    );
}

// ── Customer: order confirmed by seller ──────────────────────────────────────
export async function notifyOrderConfirmed(): Promise<void> {
    await sendNotification(
        "👍 Order Confirmed",
        "The restaurant has confirmed your order."
    );
}

// ── Customer: order is being prepared ────────────────────────────────────────
export async function notifyOrderPreparing(): Promise<void> {
    await sendNotification(
        "👨‍🍳 Preparing Your Order",
        "Your order is being prepared. Sit tight!"
    );
}

// ── Customer: order is ready ──────────────────────────────────────────────────
export async function notifyOrderReady(): Promise<void> {
    await sendNotification(
        "✅ Order Ready!",
        "Your order is ready. Enjoy your meal!"
    );
}

// ── Customer: order is being finalized (done) ─────────────────────────────────
export async function notifyOrderDone(): Promise<void> {
    await sendNotification(
        "🙏 Order Complete",
        "Your order has been finalized. Thank you!"
    );
}

// ── Init (call once in App.js) ────────────────────────────────────────────────
export async function initializeNotification(): Promise<void> {
    setupNotificationHandler();
    await requestPermissions();
}
