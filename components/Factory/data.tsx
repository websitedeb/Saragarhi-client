import { Fonts } from "@/hooks/useFont";
import React from "react";
import { Text, View } from "react-native";

type DataFactoryProps = {
  schema: any;
  dataset: Record<string, any>;
};

export function DataFactory({ schema, dataset }: DataFactoryProps) {
  const renderWidget = (config: any, key: string) => {
    const value = dataset[`DataSet${key}`] ?? "—";

    switch (config.type) {
      case "Bento":
        return (
          <View
            key={key}
            className="p-4 bg-gray-800 rounded-2xl shadow-md my-2"
          >
            <Text
              className="text-gray-400 text-sm mb-1"
              style={{ fontFamily: Fonts.Shrikhand }}
            >
              {config.name}
            </Text>
            <Text className="text-white text-xl font-bold">{value}</Text>
          </View>
        );

      case "Ratio":
        return (
          <View
            key={key}
            className="flex-row items-center justify-between bg-gray-800 rounded-2xl shadow-md p-4 my-2"
          >
            <Text className="text-white text-lg font-medium">
              {config.addons?.left || config.name}
            </Text>
            <Text className="text-white text-lg">|</Text>
            <Text className="text-red-500 text-xl font-bold" style={{ fontFamily : Fonts.Shrikhand }}>
              {config.addons?.right === "$data" ? value : config.addons?.right}
            </Text>
          </View>
        );

      case "line":
        return (
          <View key={key} className="border-b border-gray-600 my-2">
            <Text className="text-white text-lg">{config.name}: <Text className="text-red-500" style={{ fontFamily: Fonts.Shrikhand }}>{value}</Text></Text>
          </View>
        );

      default:
        return (
          <View key={key} className="my-2 p-3 bg-gray-800 rounded-lg">
            <Text className="text-gray-400 text-sm">{config.name}</Text>
            <Text className="text-white">{String(value)}</Text>
          </View>
        );
    }
  };

  return (
    <View className="p-4 bg-gray-900 min-h-screen space-y-3">
      <Text
        className="text-center text-3xl text-red-600 border-b-2 border-red-600 mb-4"
        style={{ fontFamily: Fonts.Shrikhand }}
      >
        Data Dashboard
      </Text>

      {Object.entries(schema).map(([key, config]: any) =>
        renderWidget(config, key)
      )}
    </View>
  );
}
