import { Alert, Platform } from "react-native";
import Constants from "expo-constants";

// expo-notifications is a native module available in Expo Go, development
// builds and production builds. Local (scheduled) notifications work in all of
// them; only *remote* push requires a custom dev client. We load the module
// defensively so the app still renders on platforms where the native module
// is missing (e.g. web), and we no longer gate everything behind __DEV__ — that
// guard was silently disabling all notifications during dev/Expo Go testing.
let Notifications: any = null;
let SchedulableTriggerInputTypes: any = null;
try {
    const mod = require("expo-notifications");
    Notifications = mod;
    SchedulableTriggerInputTypes = mod.SchedulableTriggerInputTypes;
} catch {
    Notifications = null;
}

// Android notification channel — created once. Required on Android 8+ for
// notifications to display. expo-notifications' config plugin creates a default
// channel, but we set our own so sound/importance are predictable.
const CHANNEL_ID = "orders";
let channelReady = false;

export function setupNotificationHandler() {
    if (!Notifications) return;
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            // Note: in this expo-notifications version shouldShowBanner and
            // shouldShowList are the required fields (shouldShowAlert is the
            // deprecated one), so these are intentionally NOT replaced.
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            priority: Notifications.AndroidNotificationPriority?.HIGH,
        }),
    });
}

async function ensureChannel() {
    if (!Notifications || channelReady) return;
    channelReady = true;
    if (Platform.OS === "android") {
        try {
            await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
                name: "Order Updates",
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#6C63FF",
                showBadge: true,
            });
        } catch (e) {
            console.warn("[notifications] channel setup failed:", e);
        }
    }
}

// Returns true if we may post a notification. Prompts the user only when we can
// still ask again — avoids spamming an alert on every order once denied.
async function canNotify(): Promise<boolean> {
    if (!Notifications) return false;
    try {
        const current = await Notifications.getPermissionsAsync();
        if (current.status === "granted") return true;
        if (current.canAskAgain) {
            const res = await Notifications.requestPermissionsAsync();
            if (res.status !== "granted") {
                Alert.alert(
                    "Permission required",
                    "Please allow notifications to receive order updates."
                );
                return false;
            }
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

export async function requestPermissions(): Promise<boolean> {
    if (!Notifications) return false;
    try {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === "granted";
    } catch {
        return false;
    }
}

async function sendNotification(title: string, body: string): Promise<void> {
    if (!Notifications) return;
    try {
        await ensureChannel();
        if (!(await canNotify())) return;

        const trigger: any = {
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
        };
        if (Platform.OS === "android") trigger.channelId = CHANNEL_ID;

        await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: true },
            trigger,
        });
    } catch (e) {
        console.warn("[notifications] send failed:", e);
    }
}

export async function initializeNotification(): Promise<void> {
    if (!Notifications) return;
    setupNotificationHandler();
    await ensureChannel();
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

/**
 * Obtain the Expo push token for this device.
 *
 * Must be called from inside a dashboard (not at module-load time) so that
 * the permission dialog has proper context and the channel is ready.
 *
 * Returns null when:
 *  - permission is denied
 *  - the device/emulator has no push support (simulator, web, etc.)
 *  - expo-notifications is unavailable
 *
 * The caller is responsible for POSTing the token to the right backend endpoint.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (!Notifications) return null;

    // Push only works on physical devices (not simulators / emulators).
    const isDevice = Constants.isDevice ?? true;
    if (!isDevice) {
        if (__DEV__) console.warn("[push] Expo push tokens are not available on emulators/simulators.");
        return null;
    }

    // Ensure the Android channel exists before requesting the token.
    await ensureChannel();

    // Request / check permission.
    let granted = false;
    try {
        const { status: existing } = await Notifications.getPermissionsAsync();
        if (existing === "granted") {
            granted = true;
        } else if (existing === "undetermined") {
            const { status } = await Notifications.requestPermissionsAsync();
            granted = status === "granted";
        }
    } catch {
        return null;
    }

    if (!granted) {
        if (__DEV__) console.warn("[push] notification permission not granted");
        return null;
    }

    // Retrieve the Expo push token.  projectId is required for SDK 49+.
    try {
        const projectId =
            Constants.expoConfig?.extra?.eas?.projectId ??
            Constants.easConfig?.projectId;

        const { data: token } = await Notifications.getExpoPushTokenAsync(
            projectId ? { projectId } : undefined
        );
        return token ?? null;
    } catch (e) {
        console.warn("[push] getExpoPushTokenAsync failed:", e);
        return null;
    }
}
