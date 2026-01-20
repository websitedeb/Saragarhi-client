import { DataFactory } from "@/components/Factory/data";
import { DisplaySchema } from "@/constants/constants";
import { useTeamData } from "@/hooks/getTeams";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useSignStore } from '@/hooks/store';

export default function Lookup() {
  const [teamNumber, setTeamNumber] = useState("");
  const { sign } = useSignStore();
  const { data: teamData, isLoading, error } = useTeamData(teamNumber, sign || "");

  return (
    <View className="flex-1 bg-gray-900">
      {/* Input */}
      <View className="p-4">
        <TextInput
          placeholder="Team Number"
          keyboardType="numeric"
          onChangeText={setTeamNumber}
          className="border border-red-500 rounded-md p-3 my-2 text-white bg-transparent text-xl"
          placeholderTextColor={"#ef4444"}
        />
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
