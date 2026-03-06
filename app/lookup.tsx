import { DataFactory } from "@/components/Factory/data";
import { DisplaySchema } from "@/constants/constants";
import { useTeamData } from "@/hooks/getTeams";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignStore } from '@/hooks/store';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Lookup() {
  const [teamNumber, setTeamNumber] = useState("");
  const [tempTeam, setTempTeam] = useState("");

  const { sign } = useSignStore();
  const { data: teamData, isLoading, error } = useTeamData(teamNumber, sign || "");

  return (
    <View className="flex-1 bg-gray-900">
      {/* Input */}
      <View className="p-4 flex-row">
        <TextInput
          placeholder="Team Number"
          keyboardType="numeric"
          value={tempTeam}
          onChangeText={setTempTeam}
          className="border border-red-500 rounded-md p-3 text-white bg-transparent text-xl flex-1 border-r-0 rounded-r-none"
          placeholderTextColor="#ef4444"
        />

        <TouchableOpacity
          onPress={() => setTeamNumber(tempTeam)}
          className="bg-red-600 px-3 py-3 rounded-l-none items-center rounded-full text-center"
        >
          <MaterialCommunityIcons name="magnify" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {!teamNumber && (
          <View className="p-4">
            <Text className="text-gray-400 text-center">
              Enter a team number to begin
            </Text>
          </View>
        )}

        {isLoading && (
          <View className="p-4">
            <Text className="text-gray-300 text-center">Loading...</Text>
          </View>
        )}

        {error && (
          <View className="p-4">
            <Text className="text-red-500 text-center">
              Error: {(error as Error).message}
            </Text>
          </View>
        )}

        {teamData && (
            <View>
                <DataFactory schema={DisplaySchema} dataset={teamData} />
                <Text>e</Text>
            </View>
        )}
      </ScrollView>
    </View>
  );
}
