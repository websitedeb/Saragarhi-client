import Checklist from '@/components/Forms/checklist';
import EventSelector from '@/components/Forms/eventSelector';
import { useAllTeams } from '@/hooks/getTeams';
import { protectRoute } from '@/hooks/session';
import { useEvent, useTickedTeam } from '@/hooks/store';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from 'react-native';

const TEAMS_PER_PAGE = 100;

export default function TeamList() {

  useEffect(() => {
    protectRoute();
  }, []);

  const {event, setEvent} = useEvent() as unknown as {
    event: String,
    setEvent: (event: String) => void
  }

  const { data: teams, isLoading, isError, error } = useAllTeams();
  const { teamsSelected } = useTickedTeam();

  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');

  const filteredTeams = useMemo(() => {
    if (!teams) return [];

    const uniqueTeams = Array.from(
      new Map(teams.map((team) => [team.team_number, team])).values()
    );

    const lower = query.toLowerCase();
    return uniqueTeams.filter(
      (team) =>
        team.nickname?.toLowerCase().includes(lower) ||
        team.team_number.toString().includes(lower)
    );
  }, [teams, query]);


  const { selected, unselected } = useMemo(() => {
    const selected = filteredTeams.filter((team) =>
      teamsSelected.includes(team.team_number)
    );
    const unselected = filteredTeams.filter(
      (team) => !teamsSelected.includes(team.team_number)
    );
    return { selected, unselected };
  }, [filteredTeams, teamsSelected]);

  const paginatedTeams = useMemo(() => {
    if (page === 0) {
      return [...selected, ...unselected].slice(0, TEAMS_PER_PAGE);
    } else {
      const offset = TEAMS_PER_PAGE * (page - 1);
      const start = selected.length + offset;
      const end = start + TEAMS_PER_PAGE;
      return unselected.slice(start, end);
    }
  }, [page, selected, unselected]);

  const totalPages = useMemo(() => {
    const restCount = unselected.length - Math.max(0, TEAMS_PER_PAGE - selected.length);
    const additionalPages = Math.ceil(Math.max(0, restCount) / TEAMS_PER_PAGE);
    return 1 + additionalPages;
  }, [selected.length, unselected.length]);

  const handleSearch = (text: string) => {
    setQuery(text);
    setPage(0);
  };

  return (
    <View className="bg-gray-900 flex-1 px-4 py-2">
      <TextInput
        className="bg-white rounded px-3 py-2 mb-3"
        placeholder="Search by team number or nickname..."
        value={query}
        onChangeText={handleSearch}
      />
      <EventSelector />

      {isLoading && <ActivityIndicator size="large" />}
      {isError && (
        <Text className="text-white text-center mt-6">
          Error: {(error as Error).message}
        </Text>
      )}

      {!isLoading && !isError && (
        <FlatList
          className='mt-4'
          data={paginatedTeams}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <Checklist
              id={item.team_number}
              label={`${item.team_number} ${item.nickname}`}
            />
          )}
          ListEmptyComponent={
            <Text className="text-white text-center mt-6">
              No teams found.
            </Text>
          }
          ListFooterComponent={
            filteredTeams.length > TEAMS_PER_PAGE && (
              <View className="flex-row justify-between items-center py-4 mb-16">
                <Button
                  title="Prev"
                  onPress={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                />
                <Text className="text-white">
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
            )
          }
        />
      )}
    </View>
  );
}
