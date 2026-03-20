import { Fonts } from "@/hooks/useFont";
import React from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type DataFactoryProps = {
  schema: any;
  dataset: Record<string, any>;
};

export function DataFactory({ schema, dataset }: DataFactoryProps) {
  const [multiIndex, setMultiIndex] = React.useState<string>("1");

 const getAllMultiKeys = () => {
    let max = 1;

    Object.entries(schema).forEach(([key, config]: any) => {
      if (config.type !== "MultiBento") return;

      const val = dataset[`DataSet${key}`];
      if (!val) return;

      try {
        const parsed = JSON.parse(val);
        if (typeof parsed === "object") {
          const keys = Object.keys(parsed).map(Number);
          const localMax = Math.max(...keys, 1);
          if (localMax > max) max = localMax;
        }
      } catch {}
    });

    return Array.from({ length: max }, (_, i) => String(i + 1));
  };

  const multiKeys = getAllMultiKeys();

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

      case "MultiBento": {
        let parsed: Record<string, any> = {};

        try {
          parsed = JSON.parse(String(value || "{}"));
        } catch {}

        const selected = parsed[multiIndex];

        return (
          <View
            key={key}
            className="p-4 bg-gray-800 rounded-2xl shadow-md my-2"
          >
            <Text
              className="text-gray-400 text-sm mb-2"
              style={{ fontFamily: Fonts.Shrikhand }}
            >
              {config.name}
            </Text>

            <Text className="text-white text-xl font-bold">
              {selected?.value ?? selected ?? "—"}
            </Text>

            {typeof selected === "object" && selected?.match && (
              <Text className="text-gray-400 text-sm mt-1">
                Match: {selected.match}
              </Text>
            )}
          </View>
        );
      }

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
            <Text
              className="text-red-500 text-xl font-bold"
              style={{ fontFamily: Fonts.Shrikhand }}
            >
              {config.addons?.right === "$data"
                ? value
                : config.addons?.right}
            </Text>
          </View>
        );

      case "line":
        return (
          <View key={key} className="border-b border-gray-600 my-2">
            <Text className="text-white text-lg">
              {config.name}:{" "}
              <Text
                className="text-red-500"
                style={{ fontFamily: Fonts.Shrikhand }}
              >
                {value}
              </Text>
            </Text>
          </View>
        );

      case "$FinalNotes":
        let notesObj = {};
        try {
          notesObj = JSON.parse(String(dataset["FinalNotes"] || "{}"));
        } catch {}

        return (
          <View
            key={key}
            className="p-4 bg-gray-800 rounded-2xl shadow-md my-2"
          >
            <Text className="text-white text-lg font-bold mb-2">
              Final Notes:
            </Text>
            {Object.entries(notesObj).map(([noteKey, noteValue]) => (
              <View key={noteKey} className="flex-row items-start mb-1">
                <Text
                  className="text-red-500 mr-2"
                  style={{ fontFamily: Fonts.Shrikhand }}
                >
                  {noteKey}.
                </Text>
                <Text className="text-white text-base">
                  {String(noteValue)}
                </Text>
              </View>
            ))}
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

      {/* 🔹 Global Multi Selector */}
      <View className="bg-gray-800 p-3 rounded-xl mb-4">
        <Text className="text-white mb-1">Select Entry</Text>
        <Picker
          selectedValue={multiIndex}
          onValueChange={(val) => setMultiIndex(val)}
          dropdownIconColor="white"
          style={{ color: "#ef4444", borderColor: "#000000" }}
          className="font-bold bg-gray-700 text-xl"
        >
          {multiKeys.map((k) => (
            <Picker.Item key={k} label={`Entry ${k}`} value={k} />
          ))}
        </Picker>
      </View>

      {Object.entries(schema).map(([key, config]: any) =>
        renderWidget(config, key)
      )}
    </View>
  );
}