import { getSession, protectRoute } from "@/hooks/session";
import { Fonts, preloadIconFonts } from "@/hooks/useFont";
import { useMembers } from "@/hooks/useMembers";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignStore } from '@/hooks/store';

export default function Teams() {
  const [session, setSession] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const { sign } = useSignStore();

  useEffect(() => {
    protectRoute();
    preloadIconFonts();
    (async () => {
      const sess = await getSession();
      if (!sess) {
        router.push("/signin");
        return;
      }
      setSession(sess);
    })();
  }, []);

  const { data: members, isLoading, isError, error } = useMembers(
    session?.TeamCode, sign as string
  );

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return members.filter((m: any) => 
      m.Name.toLowerCase().includes(search.toLowerCase()) && m.Role !== session.Role
    ); 
  }, [members, search]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-gray-900">
      <View style={styles.headerContainer}>
        <MaterialIcons name="people-alt" size={30} color="red" />
        <Text style={styles.headerText}>Your Team</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredMembers}
        keyExtractor={(item, index) => `${item.Name}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {router.push({
            pathname: "/memberlookup/[name]",
            params: {
              name: encodeURIComponent(JSON.stringify(item))
            }
          });}}>
            <LinearGradient
              colors={["#ed1c24", "#000000"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View>
                <Text style={styles.nameText}>{item.Name}</Text>
                <Text style={styles.roleText}>{item.Role}</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="#9ca3af"
              />
            </LinearGradient>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading
                ? "Loading members..."
                : isError
                ? `Error: ${error.message}`
                : "No members found."}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#4b5563",
  },
  headerText: {
    color: "red",
    fontFamily: Fonts.Shrikhand,
    fontSize: 26,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2937",
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchInput: {
    color: "white",
    flex: 1,
    marginLeft: 8,
    fontFamily: Fonts.Inter,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#374151",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  nameText: {
    color: "#f9fafb",
    fontSize: 20,
    fontFamily: Fonts.Inter,
  },
  roleText: {
    color: "#9ca3af",
    fontSize: 15,
    fontFamily: Fonts.Shrikhand,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
    fontFamily: Fonts.Inter,
  },
});
