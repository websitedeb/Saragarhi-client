import * as SecureStore from "expo-secure-store";

export async function saveSession(data: Record<string, any>, expiresInMinutes = 60) {
  const expiry = Date.now() + expiresInMinutes * 60 * 1000;
  await SecureStore.setItemAsync("session_data", JSON.stringify(data));
  await SecureStore.setItemAsync("session_expiry", expiry.toString());
}

export async function getSession(): Promise<null | Record<string, any>> {
  const expiry = await SecureStore.getItemAsync("session_expiry");
  const rawData = await SecureStore.getItemAsync("session_data");

  if (!expiry || !rawData) return null;
  if (Date.now() > parseInt(expiry)) {
    await clearSession();
    return null;
  }

  return JSON.parse(rawData);
}

export async function clearSession() {
  await SecureStore.deleteItemAsync("session_token");
  await SecureStore.deleteItemAsync("session_expiry");
}