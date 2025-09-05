import EventSelector from "@/components/Forms/eventSelector";
import { useDistrictRankings } from "@/hooks/getTeams";
import { protectRoute } from "@/hooks/session";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  View
} from "react-native";

const TEAMS_PER_PAGE = 100;

export default function Ranks() {
  useEffect(() => {
    protectRoute();
  }, []);

  const { data, isLoading, isError, error } = useDistrictRankings();

  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const lower = query.toLowerCase();

    return data
        .filter(
        (t) =>
            t.team_key.toLowerCase().includes(lower) ||
            t.rank?.toString().includes(lower)
        )
        .sort((a, b) => {
        if (a.rank === null) return 1;
        if (b.rank === null) return -1;
        return a.rank - b.rank;
        });
    }, [data, query]);

  const paginated = useMemo(() => {
    const start = page * TEAMS_PER_PAGE;
    return filtered.slice(start, start + TEAMS_PER_PAGE);
  }, [filtered, page]);

  const totalPages = useMemo(() => {
    return Math.ceil(filtered.length / TEAMS_PER_PAGE) || 1;
  }, [filtered.length]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Loading Rankings...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <View className="bg-gray-900 flex-1 px-4 py-2">
      <TextInput
        className="bg-white rounded px-3 py-2 mb-3"
        placeholder="Search by team number or rank..."
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          setPage(0);
        }}
      />
      <EventSelector />

      <FlatList
        className="mt-4"
        data={paginated}
        keyExtractor={(item) => item.team_key}
        renderItem={({ item }) => (
          <View className="p-3 border-b border-gray-700">
            <Text className="text-white font-bold">
              #{item.rank ?? "-"} – {item.team_key.replace("frc", "")}
            </Text>
            <Text className="text-gray-300">
              Matches: {item.matches_played} | Avg: {item.qual_average.toFixed(2)}
            </Text>
            <Text className="text-gray-400 text-xs">
              Record {item.record.wins}-{item.record.losses}-{item.record.ties}
            </Text>
            {item.overall_status ? (
              <Text className="text-gray-500 text-xs">
                {item.overall_status.replace("")}
              </Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-white text-center mt-6">No rankings found.</Text>
        }
        ListFooterComponent ={
            <View className="flex-row justify-between items-center py-4 mb-16">
                <Button
                    title="Prev"
                    onPress={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                />
                <Text style={{ color: "white" }}>
                    Page {page + 1} of {totalPages}
                </Text>
                <Button
                    title="Next"
                    onPress={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages - 1))
                    }
                    disabled={page >= totalPages - 1}
                />
            </View>
        }
      />
    </View>
  );
}
