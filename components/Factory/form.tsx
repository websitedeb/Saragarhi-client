import { Fonts } from "@/hooks/useFont";
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "@rneui/base";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const pageOrder = ["auto", "tele", "end"];

export function FormFactory({ schema }: { schema: any }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const currentPageKey = pageOrder[pageIndex];
  const currentPage = schema[currentPageKey];

  function handleSubmit(){
  
  }

  const handleChange = (key: any, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [currentPageKey]: {
        ...prev[currentPageKey],
        [key]: value,
      },
    }));
  };

  const renderField = (key: any, config: any) => {
    switch (key) {
      case "input":
        return (
          <TextInput
            key={key}
            placeholder={config.name}
            keyboardType={config.type === "number" ? "numeric" : "default"}
            onChangeText={(value) => handleChange("input", value)}
            className="border border-red-500 rounded-md p-3 my-2 text-white bg-transparent"
            placeholderTextColor={"#ef4444"}
          />
        );

      case "check":
        return (
          <View key={key} className="my-2">
            <Text className="text-white text-base font-medium mb-1">{config.name}</Text>
            {(Array.isArray(config.options) ? config.options : Object.entries(config.options)).map(
              (entry: any) => {
                const [label, value] = Array.isArray(config.options) ? [entry, entry] : entry;
                return (
                  <CheckBox
                    key={label}
                    title={<Text className="ml-2 text-red-500 font-bold">{label}</Text>}
                    containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0 }}
                    checked={formData[currentPageKey]?.check?.[value] ?? false}
                    onPress={() =>
                      handleChange("check", {
                        ...formData[currentPageKey]?.check,
                        [value]: !formData[currentPageKey]?.check?.[value],
                      })
                    }
                  />
                );
              }
            )}
          </View>
        );

      case "radio":
        return (
          <View key={key} className="my-2">
            <Text className="text-white text-base font-medium mb-1">{config.name}</Text>
            {Object.entries(config.options).map(([label, value]) => (
              <TouchableOpacity
                key={label}
                onPress={() => handleChange("radio", value)}
                className="flex-row items-center space-x-2 my-2"
              >
                <View className="w-5 h-5 rounded-full border-2 border-red-900 justify-center items-center">
                  {formData[currentPageKey]?.radio === value && (
                    <View className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  )}
                </View>
                <Text className="text-red-500 ml-2">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "dropdown":
        return (
          <View key={key} className="my-2">
            <Text className="text-white text-base font-medium mb-1">{config.name}</Text>
            {config.type === "multi" ? (
              config.options.map((opt: any) => (
                <CheckBox
                  key={opt}
                  title={<Text className="ml-2 text-red-500 font-bold">{opt}</Text>}
                  containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0 }}
                  checked={formData[currentPageKey]?.dropdown?.[opt] ?? false}
                  onPress={() =>
                    handleChange("dropdown", {
                      ...formData[currentPageKey]?.dropdown,
                      [opt]: !formData[currentPageKey]?.dropdown?.[opt],
                    })
                  }
                />
              ))
            ) : (
              <View className="border border-white rounded-md">
                <Picker
                  selectedValue={formData[currentPageKey]?.dropdown}
                  onValueChange={(val) => handleChange("dropdown", val)}
                  dropdownIconColor="white"
                  style={{ color: "black" }}
                >
                  {config.options.map((opt: any) => (
                    <Picker.Item key={opt} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            )}
          </View>
        );

      case "increment":
        return (
          <View key={key} className="flex-row items-center space-x-3 my-2">
            <Text className="text-white font-medium mr-2">{config}</Text>
            <Text className="text-red-500 font-extrabold text-2xl mr-2 border p-2 rounded-xl border-red-500">
              {formData[currentPageKey]?.increment || 0}
            </Text>
            <TouchableOpacity
              onPress={() =>
                handleChange(
                  "increment",
                  (formData[currentPageKey]?.increment || 0) - 1
                )
              }
              className="bg-red-500 px-3 py-1 rounded"
            >
              <Text className="text-white font-bold">-</Text>
            </TouchableOpacity>
            <Text className="mr-1 ml-1"></Text>
            <TouchableOpacity
              onPress={() =>
                handleChange(
                  "increment",
                  (formData[currentPageKey]?.increment || 0) + 1
                )
              }
              className="bg-green-500 px-3 py-1 rounded"
            >
              <Text className="text-white font-bold">+</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="p-4 space-y-4 bg-gray-900 min-h-screen">
      <Text className="text-center text-3xl text-red-600 border-b-2 border-b-red-600" style={{ fontFamily: Fonts.Shrikhand }}>
        {currentPageKey.toUpperCase()}
      </Text>

      {Object.entries(currentPage).map(([key, value]) => {
        return renderField(key, value);
      })}

      <View className="flex-row justify-between pt-6">
        {pageIndex > 0 && (
          <TouchableOpacity
            onPress={() => setPageIndex((i) => i - 1)}
            className="bg-gray-700 px-4 py-2 rounded"
          >
            <Text className="text-white font-medium">Back</Text>
          </TouchableOpacity>
        )}

        {pageIndex < pageOrder.length - 1 ? (
          <TouchableOpacity
            onPress={() => setPageIndex((i) => i + 1)}
            className="bg-blue-600 px-4 py-2 rounded ml-auto"
          >
            <Text className="text-white font-medium">Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-green-600 px-4 py-2 rounded ml-auto"
          >
            <Text className="text-white font-medium">Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
