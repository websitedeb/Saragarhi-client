import EditableList from '@/components/Forms/spreadsheet';
import { Picker } from "@react-native-picker/picker";
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MemberPage() {
  const { name } = useLocalSearchParams();
  const item = name ? JSON.parse(decodeURIComponent(name as string)) : null;
  
  const initialData = JSON.parse(item["Time Table"] || "[]").length > 0
    ? JSON.parse(item["Time Table"])
    : [{ id: "1", Team: 0, Time: "00:00", Date: new Date().toISOString().slice(0, 10) }];

  const [username, setUsername] = useState(item?.Name || "");
  const [email, setEmail] = useState(item?.Email || "");
  const [role, setRole] = useState(item?.Role || "Member");

  const handleSaveField = async (key: string, value: any) => {
    switch (key) {
      case "Name":
        await fetch(`https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/updateMemberName`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ old: item?.Name, new: value, email: item?.Email  }),
        }).then((res) => Alert.alert("Success", "Username updated successfully!"));
        break;
      case "Email":
        await fetch(`https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/updateMemberEmail`, {    // add he new body points to all of these, open the backend to figure it out
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldEmail: item?.Email, new: value, name: item?.Name  }),
        }).then((res) => Alert.alert("Success", "Username updated successfully!"));
        break;
      case "Role":
        await fetch(`https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/updateMemberRole`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: item?.Name, new: value, email: item?.Email, old: item?.Role  }),
        }).then((res) => Alert.alert("Success", "Username updated successfully!"));
        break;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `${item?.Name ?? ""} ⋅ ${item?.Role ?? ""}`,
          headerTitleAlign: 'center',
          headerTintColor: '#ed1c24',
          headerTitleStyle: { fontFamily: 'Shrikhand' },
          headerStyle: { backgroundColor: '#111827' },
          headerShadowVisible: true,
        }}
      />

      <SafeAreaView className="bg-gray-900 w-screen h-screen gap-7">
        <View className="bg-gray-800 items-center w-screen p-4 rounded-b-3xl" style={{ alignSelf: 'flex-start' }}>  
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 28, fontFamily: 'Shrikhand', marginBottom: 2 }}>
              {item?.Name}
            </Text>
            <Text style={{ color: '#ed1c24', fontSize: 18, fontWeight: '600', marginBottom: 4 }}>
              {item?.Role}
            </Text>
            <Text style={{ color: '#9ca3af', fontSize: 16, fontFamily: 'Inter' }}>
              {item?.Email}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40, marginBottom: 50 }}>
          <SafeAreaView className='items-center gap-y-5'>

            {/* USERNAME */}
            <View className="w-96">
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                className="border border-red-500 rounded-md p-3 text-white bg-transparent text-xl"
                placeholderTextColor="#ef4444"
              />
              <TouchableOpacity
                onPress={() => handleSaveField("Name", username)}
                className="bg-red-600 p-2 rounded-md mt-2"
              >
                <Text className="text-white font-bold text-center">Save Username</Text>
              </TouchableOpacity>
            </View>

            {/* EMAIL */}
            <View className="w-96">
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                className="border border-red-500 rounded-md p-3 text-white bg-transparent text-xl"
                placeholderTextColor="#ef4444"
              />
              <TouchableOpacity
                onPress={() => handleSaveField("Email", email)}
                className="bg-red-600 p-2 rounded-md mt-2"
              >
                <Text className="text-white font-bold text-center">Save Email</Text>
              </TouchableOpacity>
            </View>

            {/* ROLE PICKER */}
            <View className="w-96">
              <Picker
                selectedValue={role}
                onValueChange={(value) => setRole(value)}
                dropdownIconColor="white"
                style={{ color: "#ef4444" }}
                className="bg-gray-800 text-xl"
              >
                <Picker.Item label="Scouter" value="Scouter" />
                <Picker.Item label="Captain" value="Captain" />
                <Picker.Item label="Organizer" value="Organizer" />
              </Picker>
              <TouchableOpacity
                onPress={() => handleSaveField("Role", role)}
                className="bg-red-600 p-2 rounded-md mt-2"
              >
                <Text className="text-white font-bold text-center">Save Role</Text>
              </TouchableOpacity>
            </View>

            {/* TIME TABLE */}
            <EditableList
              data={initialData}
              onSave={(updated) => {}}
              targetName={item?.Name}
            />

          </SafeAreaView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
