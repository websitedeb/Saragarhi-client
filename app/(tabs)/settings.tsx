import { Button } from "@/components/Forms/button";
import { DB_URL } from "@/constants/constants";
import { clearSession, getSession, protectRoute, saveSession } from "@/hooks/session";
import { Fonts, preloadIconFonts } from "@/hooks/useFont";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Colors = {
  primary: "#ed1c24", 
  background: "#111827", 
  card: "#141A23",
  border: "rgba(239, 68, 68, 0.45)",
  text: "#ffffff",
  placeholder: "#ef4444",
};

export default function Settings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [origUsername, setOrigUsername] = useState("");
  const [origEmail, setOrigEmail] = useState("");

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    protectRoute();
    preloadIconFonts();

    (async () => {
      const session = await getSession();
      if (!session) {
        router.replace("/signin");
        return;
      }

      setSession(session);
      setUsername(session.Name);
      setEmail(session.Email);
      setOrigUsername(session.Name);
      setOrigEmail(session.Email);
    })();
  }, []);

  const handleSaveField = async (
    key: "Name" | "Email" | "Password",
    value: string
  ) => {
    try {
      let res: Response;

      switch (key) {
        case "Name":
          res = await fetch(
            `${DB_URL}/updateMemberName`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                old: origUsername,
                new: value,
                email: origEmail,
              }),
            }
          );

          if (!res.ok) throw new Error(await res.text());

          setOrigUsername(value);
          await saveSession({ ...session, Name: value });
          setSession({ ...session, Name: value });
          Alert.alert("Success", "Username updated!");
          router.replace("/settings");
          break;

        case "Email":
          res = await fetch(
            `${DB_URL}/updateMemberEmail`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                oldEmail: origEmail,
                new: value,
                name: origUsername,
              }),
            }
          );

          if (!res.ok) throw new Error(await res.text());

          setOrigEmail(value);
          await saveSession({ ...session, Email: value });
          setSession({ ...session, Email: value });
          Alert.alert("Success", "Email updated!");
          router.replace("/settings");
          break;

        case "Password":
          res = await fetch(
            `${DB_URL}/updateMemberPass`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: origEmail,
                password: value,
              }),
            }
          );

          if (!res.ok) throw new Error(await res.text());

          setPass("");
          await saveSession({ ...session, Password: value });
          setSession({ ...session, Password: value });
          Alert.alert("Success", "Password updated!");
          router.replace("/settings");
          break;
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Update failed");
    }
  };

  async function deleteSession() {
    await clearSession();
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <MaterialIcons name="settings" size={30} color={Colors.primary} />
        <Text style={styles.headerText}>Your Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Account Card */}
        <View style={styles.card}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholderTextColor={Colors.placeholder}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSaveField("Name", username)}
            >
              <Text style={styles.buttonText}>Save Username</Text>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor={Colors.placeholder}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSaveField("Email", email)}
            >
              <Text style={styles.buttonText}>Save Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerCard}>
          <View style={styles.dangerHeader}>
            <MaterialIcons name="dangerous" size={24} color={Colors.primary} />
            <Text style={styles.dangerHeaderText}>Danger Zone</Text>
          </View>

          <Button
            onClick={deleteSession}
            title={<Text style={styles.buttonText}>Exit</Text>}
            style={styles.dangerButton}
          />

          {/* Password */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="New Password"
              value={pass}
              onChangeText={setPass}
              secureTextEntry
              style={styles.input}
              placeholderTextColor={Colors.placeholder}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSaveField("Password", pass)}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.card,
  },
  headerText: {
    color: Colors.primary,
    fontFamily: Fonts.Shrikhand,
    fontSize: 26,
  },
  card: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: Colors.text,
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  dangerCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 15,
  },
  dangerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  dangerHeaderText: {
    color: Colors.primary,
    fontFamily: Fonts.Shrikhand,
    fontSize: 24,
  },
  dangerButton: {
    backgroundColor: Colors.border,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
});
