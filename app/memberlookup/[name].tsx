import EditableList from '@/components/Forms/spreadsheet';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MemberPage() {
  const { name } = useLocalSearchParams();
  const item = name ? JSON.parse(decodeURIComponent(name as string)) : null;
  
  const initialData = JSON.parse(item["Time Table"] || "[]").length > 0
    ? JSON.parse(item["Time Table"])
    : [{ id: "1", Team: 0, Time: "00:00", Date: new Date().toISOString().slice(0, 10) }];


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
                <Text
                    style={{
                    color: 'white',
                    fontSize: 28,
                    fontFamily: 'Shrikhand',
                    marginBottom: 2,
                    }}
                >
                    {item?.Name}
                </Text>
                <Text
                    style={{
                    color: '#ed1c24',
                    fontSize: 18,
                    fontWeight: '600',
                    marginBottom: 4,
                    }}
                >
                    {item?.Role}
                </Text>
                <Text
                    style={{
                    color: '#9ca3af',
                    fontSize: 16,
                    fontFamily: 'Inter',
                    }}
                >
                    {item?.Email}
                </Text>
            </View>
        </View>
        <SafeAreaView className='h-96'>
          <EditableList
            data={initialData}
            onSave={(updated) => {
              console.log(updated)
            }}
            targetName={item?.Name}
          />
        </ SafeAreaView>
      </SafeAreaView>
    </>
  );
}
