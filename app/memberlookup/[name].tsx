import getImageIcon from '@/hooks/useIconImage';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MemberPage() {
  const { name } = useLocalSearchParams();
  const item = name ? JSON.parse(decodeURIComponent(name as string)) : null;

  const { data: imageUri, isLoading, error } = useQuery({
    queryKey: ['member-image', item?.Name],
    queryFn: async () => {
      if (!item?.Name) return undefined;
      return await getImageIcon(item.Name);
    },
    enabled: !!item?.Name,
    staleTime: 1000 * 60 * 60 * 24,
  });

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

      <SafeAreaView className="bg-gray-900 w-screen h-screen">
        {isLoading && (
          <Text style={{ color: 'white', fontSize: 16 }}>Loading image...</Text>
        )}

        {error && (
          <Text style={{ color: 'red', fontSize: 16 }}>Failed to load image</Text>
        )}

        <View className="bg-gray-700 items-center w-screen p-4 rounded-b-3xl" style={{ alignSelf: 'flex-start' }}>
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={{
                    width: 180,
                    height: 180,
                    borderRadius: 90,
                    marginBottom: 8,
                    }}
                />
            )}

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
      </SafeAreaView>
    </>
  );
}
