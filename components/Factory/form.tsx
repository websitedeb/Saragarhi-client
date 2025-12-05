import { DataSetsType } from "@/hooks/store";
import { Fonts } from "@/hooks/useFont";
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "@rneui/base";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
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

  const binders = useMemo(() => {
    const list: Array<[string, string, number, string]> = [];
    pageOrder.forEach((pageKey) => {
      const page = schema[pageKey];
      if (!page) return;
      Object.entries(page).forEach(([fieldKey, config]: any) => {
        if (config?.binding) {
          list.push([`${pageKey}.${config.binding.uuid}`, `${config.binding.uuid}`, config.binding.with, `${config.binding.type}`]);
        }
      });
    });
    return list;
  }, [schema]);

  const getFieldKey = (config: any, fallback: string) =>
    config?.binding?.uuid ?? fallback;
  
  function getByPath(obj : Object, path : string) {
    return path.split(".").reduce((acc : any, key : any) => acc?.[key], obj);
  }

  function handleSubmit() {
    let dataset: DataSetsType & { [key: string]: any } = {
      TeamNumber: 0,
      NumberOfDataSets: 1,
      One: []
    }; 

    function convert(number : any) : string | undefined {
      switch (number) {
        case 1: 
          return "One";
        case 2:
          return "Two";
        case 3:
          return "Three";
        case 4:
          return "Four";
        case 5:
          return "Five";
        case 6:
          return "Six";
        case 7:
          return "Seven";
        case 8:
          return "Eight";
        case 9:
          return "Nine";
        case 10:
          return "Ten";
      }
    }

    let prev_connector = 0;

    binders.forEach(arrs => {
      const [path, name, connector, typ] = arrs;
      const value = getByPath(formData, path);

      if (prev_connector < connector){
        prev_connector = connector
      }

      if (name != "TEAM_NUMBER"){
        const key = convert(connector);
        if (key !== undefined) {
          dataset[key] = [typ, value];
        }
      }
      else{
        dataset["TeamNumber"] = value;
      }
    });

    dataset["NumberOfDataSets"] = prev_connector;

    fetch("https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/addReport",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataset)
      }
    ).then(async res => {
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Not valid JSON:", err);
        return;
      }

      if (data.success) {
        router.push("/complete");
      }
    }).catch(err => {
      console.error(err, dataset);
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [currentPageKey]: {
        ...prev[currentPageKey],
        [field]: value,
      },
    }));
  };

  const renderField = (fieldType: string, config: any) => {
    const fieldKey = getFieldKey(config, fieldType);

    switch (fieldType.replaceAll("$", "")) {
      case "input":
        return (
          <TextInput
            key={fieldKey}
            placeholder={config.name}
            keyboardType={config.type === "number" ? "numeric" : "default"}
            onChangeText={(value) => handleChange(fieldKey, value)}
            className="border border-red-500 rounded-md p-3 my-2 text-white bg-transparent text-xl"
            placeholderTextColor={"#ef4444"}
            multiline={config.type === "multi" ? true : false}
          />
        );

      case "check":
        return (
          <View key={fieldKey} className="my-2">
            <Text className="text-white text-2xl font-medium mb-1">{config.name}</Text>
            {(Array.isArray(config.options) ? config.options : Object.entries(config.options)).map(
              (entry: any) => {
                const [label, value] = Array.isArray(config.options) ? [entry, entry] : entry;
                return (
                  <CheckBox
                    key={label}
                    title={<Text className="ml-2 text-red-500 font-bold text-xl">{label}</Text>}
                    containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0 }}
                    checked={formData[currentPageKey]?.[fieldKey]?.[value] ?? false}
                    onPress={() =>
                      handleChange(fieldKey, {
                        ...formData[currentPageKey]?.[fieldKey],
                        [value]: !formData[currentPageKey]?.[fieldKey]?.[value],
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
          <View key={fieldKey} className="my-2">
            <Text className="text-white font-medium mb-1 text-2xl">{config.name}</Text>
            {Object.entries(config.options).map(([label, value]) => (
              <TouchableOpacity
                key={label}
                onPress={() => handleChange(fieldKey, value)}
                className="flex-row items-center space-x-2 my-2"
              >
                <View className="w-5 h-5 rounded-full border-2 border-red-900 justify-center items-center">
                  {formData[currentPageKey]?.[fieldKey] === value && (
                    <View className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  )}
                </View>
                <Text className="text-red-500 ml-2 text-xl">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "dropdown":
        return (
          <View key={fieldKey} className="my-2">
            <Text className="text-white text-2xl font-medium mb-1">{config.name}</Text>
            {config.type === "multi" ? (
              config.options.map((opt: any) => (
                <CheckBox
                  key={opt}
                  title={<Text className="ml-2 text-red-500 font-bold text-xl">{opt}</Text>}
                  containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0 }}
                  checked={formData[currentPageKey]?.[fieldKey]?.[opt] ?? false}
                  onPress={() =>
                    handleChange(fieldKey, {
                      ...formData[currentPageKey]?.[fieldKey],
                      [opt]: !formData[currentPageKey]?.[fieldKey]?.[opt],
                    })
                  }
                />
              ))
            ) : (
              <View className="border border-white rounded-md">
                <Picker
                  selectedValue={formData[currentPageKey]?.[fieldKey]}
                  onValueChange={(val) => handleChange(fieldKey, val || formData[currentPageKey]?.[fieldKey])}
                  dropdownIconColor="white"
                  style={{ color: "#ef4444" }}
                  className="font-bold bg-gray-800 text-xl"
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
          <View key={fieldKey} className="flex-row items-center space-x-3 my-2">
            <Text className="text-white font-medium mr-2 text-2xl">{config.name}</Text>
            <Text className="text-red-500 font-extrabold text-3xl mr-2 border p-2 rounded-xl border-red-500">
              {formData[currentPageKey]?.[fieldKey] || 0}
            </Text>
            <TouchableOpacity
              onPress={() =>
                handleChange(fieldKey, (formData[currentPageKey]?.[fieldKey] || 0) - 1)
              }
              className="bg-red-500 px-3 py-1 rounded"
            >
              <Text className="text-white font-bold text-2xl">-</Text>
            </TouchableOpacity>
            <Text className="mr-1 ml-1"></Text>
            <TouchableOpacity
              onPress={() =>
                handleChange(fieldKey, (formData[currentPageKey]?.[fieldKey] || 0) + 1)
              }
              className="bg-green-500 px-3 py-1 rounded"
            >
              <Text className="text-white font-bold text-2xl">+</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="p-4 space-y-4 bg-gray-900">
      <Text
        className="text-center text-3xl text-red-600 border-b-2 border-b-red-600"
        style={{ fontFamily: Fonts.Shrikhand }}
      >
        {currentPageKey.toUpperCase()}
      </Text>

      {Object.entries(currentPage).map(([key, value]) => renderField(key, value))}

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
            className="bg-red-600 px-4 py-2 rounded ml-auto"
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
    </ScrollView>
  );
}