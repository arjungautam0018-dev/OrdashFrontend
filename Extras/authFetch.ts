import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "./navigationRef";

/**
 * Drop-in replacement for fetch() on authenticated seller routes.
 * Reads the JWT from AsyncStorage and attaches it as Authorization header.
 * On 401 → clears the session and navigates to SellerLogin.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    let token: string | null = null;
    try {
        const raw = await AsyncStorage.getItem("session");
        if (raw) token = JSON.parse(raw)?.token ?? null;
    } catch {}

    const headers = new Headers(options.headers as HeadersInit);
    if (token) headers.set("Authorization", `Bearer ${token}`);

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }
    if (options.body instanceof FormData) {
        headers.delete("Content-Type");
    }

    const response = await fetch(url, { ...options, headers });

    // Token expired or invalid — clear local session and redirect to login
    if (response.status === 401) {
        await AsyncStorage.removeItem("session");
        if (navigationRef.isReady()) {
            navigationRef.reset({ index: 0, routes: [{ name: "SellerLogin" }] });
        }
    }

    return response;
}
