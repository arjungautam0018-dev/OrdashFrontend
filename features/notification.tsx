import { Alert } from "react-native";

// Native notification imports — only used in production builds
// In Expo Go (DEV), all notification calls are no-ops or alerts
let Notifications: any = null;
let SchedulableTriggerInputTypes: any = null;

if (!__DEV__) {
    const mod = require("expo-notifications");
    Notifications = mod;
    SchedulableTriggerInputTypes = mod.SchedulableTriggerInputTypes;
}

export function setupNotificationHandler() {
    if (__DEV__ || !Notifications) return;
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
}

export async function requestPermissions(): Promise<boolean> {
    if (__DEV__ || !Notifications) return true;
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
        Alert.alert("Permission required", "Please allow notifications to receive order updates.");
        return false;
    }
    return true;
}

async function sendNotification(title: string, body: string): Promise<void> {
    if (__DEV__ || !Notifications) return;
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

export async function initializeNotification(): Promise<void> {
    if (__DEV__) return;
    setupNotificationHandler();
    await requestPermissions();
}

export async function notifyOrderPlaced(): Promise<void> {
    await sendNotification("🛒 Order Placed!", "Your order has been received. We'll notify you when it's ready.");
}

export async function notifyNewOrder(tableName: string, total: number): Promise<void> {
    await sendNotification("🛎️ New Order!", `${tableName} placed an order for ₹${total}`);
}

export async function notifyBillRequested(tableName: string): Promise<void> {
    await sendNotification("🧾 Bill Requested", `${tableName} has requested the bill`);
}

export async function notifyOrderConfirmed(): Promise<void> {
    await sendNotification("👍 Order Confirmed", "The restaurant has confirmed your order.");
}

export async function notifyOrderPreparing(): Promise<void> {
    await sendNotification("👨‍🍳 Preparing Your Order", "Your order is being prepared. Sit tight!");
}

export async function notifyOrderReady(): Promise<void> {
    await sendNotification("✅ Order Ready!", "Your order is ready. Enjoy your meal!");
}

export async function notifyOrderDone(): Promise<void> {
    await sendNotification("🙏 Order Complete", "Your order has been finalized. Thank you!");
}
