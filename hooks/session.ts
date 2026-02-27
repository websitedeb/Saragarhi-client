import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const setItem = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export const deleteItem = async (key: string) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export async function saveSession(data: Record<string, any>, expiresInMinutes = 60) {
  const expiry = Date.now() + expiresInMinutes * 60 * 1000;
  await setItem("session_data", JSON.stringify(data));
  await setItem("session_expiry", expiry.toString());
}

export async function getSession(): Promise<Record<string, any> | null> {
  const expiry = await getItem("session_expiry");
  const rawData = await getItem("session_data");

  if (!expiry || !rawData) return null;

  if (Date.now() > parseInt(expiry)) {
    await clearSession();
    return null;
  }

  try {
    return JSON.parse(rawData);
  } catch (e) {
    console.warn("Failed to parse session:", e);
    return null;
  }
}

export async function clearSession() {
  await deleteItem("session_data");
  await deleteItem("session_expiry");
}

export async function protectRoute() {
  const session = await getSession();
  if (!session) {
    router.replace("/signin");
    return false;
  }
  return true;
}
