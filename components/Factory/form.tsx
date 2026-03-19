import { getSession } from "@/hooks/session";
import { DataSetsType, useSignStore } from "@/hooks/store";
import { Fonts } from "@/hooks/useFont";
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "@rneui/base";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useStopwatch } from 'react-timer-hook';
import Slider from '@react-native-community/slider';
import { Image } from "react-native";
import { useWindowDimensions } from "react-native";

import NetInfo from "@react-native-community/netinfo";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DB_URL } from "@/constants/constants";

const pageOrder = ["auto", "tele", "end"];
const OFFLINE_KEY = "offline_submissions";

async function saveOffline(dataset: string) {
  const existing = await AsyncStorage.getItem(OFFLINE_KEY);
  const parsed = existing ? JSON.parse(existing) : [];
  parsed.push(dataset);
  await AsyncStorage.setItem(OFFLINE_KEY, JSON.stringify(parsed));
}

async function getOffline() {
  const data = await AsyncStorage.getItem(OFFLINE_KEY);
  return data ? JSON.parse(data) : [];
}

async function clearOffline() {
  await AsyncStorage.removeItem(OFFLINE_KEY);
}

function isWithinFiveMinutesBefore(date: string, time: string) {
  const now = new Date();
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const match = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const fiveMinutesBefore = new Date(match.getTime() - 5 * 60 * 1000);
  return now >= fiveMinutesBefore && now <= match;
}

export function FormFactory({ schema }: { schema: any }) {
  const { sign } = useSignStore() as { sign: string };

  const [pageIndex, setPageIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [offlineCount, setOfflineCount] = useState(0);

  const [debouncedData, setDebouncedData] = useState("{}");

  const { width } = useWindowDimensions();

  const {
    milliseconds,
    seconds,
    minutes,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false, interval: 20 });

  const currentPageKey = pageOrder[pageIndex];
  const currentPage = schema[currentPageKey];

  // NETWORK SYNC
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      setIsOnline(state.isConnected);

      if (state.isConnected) {
        const offlineData = await getOffline();
        setOfflineCount(offlineData.length);

        if (offlineData.length === 0) return;

        for (const datasetString of offlineData) {
          try {
            const parsed = JSON.parse(datasetString);

            await fetch(`${DB_URL}/addReport?sign=${sign}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(parsed),
            });
          } catch (err) {
            console.error("Failed to resend:", err);
            return;
          }
        }

        await clearOffline();
        setOfflineCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  // AUTO TEAM FILL
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session?.TimeTable) return;

      if (formData?.auto?.TEAM_NUMBER) return;

      let timetable;
      try {
        timetable =
          typeof session.TimeTable === "string"
            ? JSON.parse(session.TimeTable)
            : session.TimeTable;
      } catch {
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      const upcoming = timetable.find((entry: any) =>
        entry.Date === today &&
        isWithinFiveMinutesBefore(entry.Date, entry.Time)
      );

      if (!upcoming) return;

      setFormData((prev) => ({
        ...prev,
        auto: {
          ...prev.auto,
          TEAM_NUMBER: upcoming.Team,
        },
      }));
    })();
  }, []);

  // BINDERS
  const binders = useMemo(() => {
    const list: Array<[string, string, number, string]> = [];
    pageOrder.forEach((pageKey) => {
      const page = schema[pageKey];
      if (!page) return;
      Object.entries(page).forEach(([fieldKey, config]: any) => {
        if (config?.binding) {
          list.push([
            `${pageKey}.${config.binding.uuid}`,
            `${config.binding.uuid}`,
            config.binding.with,
            `${config.binding.type}`
          ]);
        }
      });
    });
    return list;
  }, [schema]);

  function getByPath(obj: any, path: string) {
    return path.split(".").reduce((acc: any, key: any) => acc?.[key], obj);
  }

  const getFieldKey = (config: any, fallback: string) =>
    config?.binding?.uuid ?? fallback;

  const handleChange = (pageKey: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [field]: value,
      },
    }));
  };

  // 🔥 LIVE DATASET (updates constantly)
  const liveDatasetString = useMemo(() => {
    let dataset: DataSetsType & { [key: string]: any } = {
      TeamNumber: 0,
      NumberOfDataSets: 1,
      FinalNotes: "",
      One: []
    };

    function convert(number: any): string | undefined {
      const words = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
      return words[number - 1];
    }

    let prev_connector = 0;

    binders.forEach(arrs => {
      const [path, name, connector, typ] = arrs;
      const value = getByPath(formData, path);

      if (prev_connector < connector) prev_connector = connector;

      switch (name) {
        case "FINAL_NOTES":
          dataset["FinalNotes"] = `${value ?? ""}`;
          break;
        case "TEAM_NUMBER":
          dataset["TeamNumber"] = value ?? 0;
          break;
        default:
          const key = convert(connector);
          if (key) dataset[key] = [typ, value ?? 0];
      }
    });

    dataset["NumberOfDataSets"] = prev_connector;
    return JSON.stringify(dataset);
  }, [formData, binders]);

  // 🔥 debounce QR updates
  useEffect(() => {
    const t = setTimeout(() => setDebouncedData(liveDatasetString), 200);
    return () => clearTimeout(t);
  }, [liveDatasetString]);

  async function handleSubmit() {
    if (!isOnline) {
      await saveOffline(debouncedData);
      setOfflineCount((c) => c + 1);
      return;
    }

    router.replace({
      pathname: "/complete",
      params: { dataset: debouncedData },
    });
  }

  const renderField = (pageKey: string, fieldType: string, config: any) => {
    const fieldKey = getFieldKey(config, fieldType);
    const errorKey = `${pageKey}.${fieldKey}`;
    const fieldError = errors[errorKey];

    switch (fieldType.replaceAll("$", "")) {
      case "input":
        return (
          <View key={errorKey} className="my-2">
            <TextInput
              placeholder={config.name}
              value={formData[pageKey]?.[fieldKey] ?? ""}
              keyboardType={config.type === "number" ? "numeric" : "default"}
              onChangeText={(value) => handleChange(pageKey, fieldKey, value)}
              className={`border rounded-md p-3 text-white bg-transparent text-xl ${
                fieldError ? "border-red-500" : "border-gray-500"
              }`}
              placeholderTextColor={"#ef4444"}
              multiline={config.type === "multi"}
            />
          </View>
        );

      case "check":
        return (
          <View key={errorKey} className="my-2">
            <Text className="text-white text-2xl font-medium mb-1">{config.name}</Text>
            {(Array.isArray(config.options) ? config.options : Object.entries(config.options)).map(
              (entry: any) => {
                const [label, value] = Array.isArray(config.options) ? [entry, entry] : entry;
                return (
                  <CheckBox
                    key={label}
                    title={<Text className="ml-2 text-red-500 font-bold text-xl">{label}</Text>}
                    containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0 }}
                    checked={formData[pageKey]?.[fieldKey]?.[value] ?? false}
                    onPress={() =>
                      handleChange(pageKey, fieldKey, {
                        ...formData[pageKey]?.[fieldKey],
                        [value]: !formData[pageKey]?.[fieldKey]?.[value],
                      })
                    }
                  />
                );
              }
            )}
            {fieldError && <Text className="text-red-500 text-lg mt-1">{fieldError}</Text>}
          </View>
        );

      case "radio":
        return (
          <View key={errorKey} className="my-2">
            <Text className="text-white font-medium mb-1 text-2xl">{config.name}</Text>
            {Object.entries(config.options).map(([label, value]) => (
              <TouchableOpacity
                key={label}
                onPress={() => handleChange(pageKey, fieldKey, value)}
                className="flex-row items-center space-x-2 my-2"
              >
                <View className="w-5 h-5 rounded-full border-2 border-red-900 justify-center items-center">
                  {formData[pageKey]?.[fieldKey] === value && (
                    <View className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  )}
                </View>
                <Text className="text-red-500 ml-2 text-xl">{label}</Text>
              </TouchableOpacity>
            ))}
            {fieldError && <Text className="text-red-500 text-lg mt-1">{fieldError}</Text>}
          </View>
        );

      case "dropdown":
        return (
          <View key={errorKey} className="my-2">
            <Text className="text-white text-2xl font-medium mb-1">{config.name}</Text>
            {config.type === "multi" ? (
              config.options.map((opt: any) => (
                <CheckBox
                  key={opt}
                  title={<Text className="ml-2 text-red-500 font-bold text-xl">{opt}</Text>}
                  containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0 }}
                  checked={formData[pageKey]?.[fieldKey]?.[opt] ?? false}
                  onPress={() =>
                    handleChange(pageKey, fieldKey, {
                      ...formData[pageKey]?.[fieldKey],
                      [opt]: !formData[pageKey]?.[fieldKey]?.[opt],
                    })
                  }
                />
              ))
            ) : (
              <View className="rounded-md">
                <Picker
                  selectedValue={formData[currentPageKey]?.[fieldKey]}
                  onValueChange={(val) => handleChange(pageKey, fieldKey, val)}
                  dropdownIconColor="white"
                  style={{ color: "#ef4444", borderColor: fieldError ? "#ef4444" : "#000000" }}
                  className="font-bold bg-gray-800 text-xl"
                >
                  <Picker.Item label="Select an option..." value="N/A" key="def"/>
                  {config.options.map((opt: any) => (
                    <Picker.Item key={opt} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            )}
            {fieldError && <Text className="text-red-500 text-lg mt-1">{fieldError}</Text>}
          </View>
        );

      case "increment":
        const value = formData[config.binding.uuid] || 0;

        return (
          <View key={config.binding.uuid} className="flex-row items-center space-x-3 my-2">
            <Text className="text-white font-medium mr-2 text-2xl">{config.name}</Text>
            
            <Text className="text-red-500 font-extrabold text-3xl mr-2 border p-2 rounded-xl border-red-500">
              {formData[pageKey]?.[fieldKey] || 0}
            </Text>
            
            <TouchableOpacity
              onPress={() =>
                handleChange(pageKey, fieldKey, (formData[pageKey]?.[fieldKey] || 0) - 1)
              }
              className="bg-red-500 px-3 py-1 rounded"
            >
              <Text className="text-white font-bold text-2xl">-</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleChange(pageKey, fieldKey, (formData[pageKey]?.[fieldKey] || 0) + 1)
              }
              className="bg-green-500 px-3 py-1 rounded"
            >
              <Text className="text-white font-bold text-2xl">+</Text>
            </TouchableOpacity>

            {fieldError && <Text className="text-red-500 text-lg mt-1">{fieldError}</Text>}
          </View>
        );

      case "timer":
        return(
          <View className="flex">
            <View className="flex-row items-center space-x-2">
              <Text className="text-white font-medium mr-2 text-2xl">{config.name}</Text>

              <Text className="text-red-600 text-2xl">{minutes}</Text>
              <Text className="text-red-600 text-2xl">:</Text>
              <Text className="text-red-600 text-2xl">{seconds}</Text>
              <Text className="text-red-600 text-2xl">:</Text>
              <Text className="text-red-600 text-2xl">{milliseconds}</Text>
            </View>

            <View className="mt-3 space-y-3 flex-row gap-x-3">
              <TouchableOpacity
                onPress={start}
                className="bg-green-600 px-4 py-2 rounded-lg items-center w-28 h-fit flex-1 mt-3"
              >
                <Text className="text-white text-2xl font-semibold">Start</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  pause();
                  handleChange(pageKey, fieldKey, `${minutes}:${seconds}:${milliseconds}`);
                }}
                className="bg-yellow-500 px-4 py-2 rounded-lg items-center w-28 h-fit flex-1"
              >
                <Text className="text-white text-2xl font-semibold">Pause</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => reset(new Date())}
                className="bg-red-600 px-4 py-2 rounded-lg items-center w-28 h-fit flex-1"
              >
                <Text className="text-white text-2xl font-semibold">Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      
      case "slider":
        return (
          <View className="my-4" key={errorKey}>
            <Text className="text-white text-2xl font-medium mb-1">{config.name}</Text>
            <Slider
              minimumValue={config.min}
              maximumValue={config.max}
              step={config.step}
              value={formData[pageKey]?.[fieldKey] ?? config.min}
              onValueChange={(value) => handleChange(pageKey, fieldKey, value)}
              minimumTrackTintColor="#ef4444"
              maximumTrackTintColor="#ffffff"
              thumbTintColor="#ef4444"
            />
            <Text className="text-red-500 text-xl mt-1">{formData[pageKey]?.[fieldKey] ?? config.min}</Text>
            {fieldError && <Text className="text-red-500 text-lg mt-1">{fieldError}</Text>}
          </View>
        );

      case "image":
        return (
          <View key={fieldType} className="my-4 items-center">
            <Text className="text-white text-2xl font-medium mb-2">{config.name}</Text>
            <Image
              source={
                { uri: config.url }
              }
              style={{ width: width * config.scale.widthScale, height: width * config.scale.heightScale, borderRadius: 12 }}
              resizeMode="contain"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="p-4 bg-gray-900">
      <Text className="text-center text-3xl text-red-600 mb-3" style={{ fontFamily: Fonts.Shrikhand }}>
        {currentPageKey.toUpperCase()}
      </Text>

      {/* 🔥 ALWAYS VISIBLE QR */}
      <View className="items-center my-4">
        <Text className="text-white mb-2">Live QR</Text>
        <QRCode value={`https://saragarhi.pages.dev/complete?dataset=${typeof debouncedData === "string" ? debouncedData : JSON.stringify(debouncedData)}`} size={250} />
        {!isOnline && (
          <Text className="text-yellow-400 mt-2">
            Offline — scan this instead
          </Text>
        )}
      </View>

      {offlineCount > 0 && (
        <Text className="text-yellow-400 text-center">
          {offlineCount} waiting to sync
        </Text>
      )}

      {Object.entries(currentPage).map(([key, value]) =>
        renderField(currentPageKey, key, value)
      )}

      <View className="flex-row justify-between mt-6">
        {pageIndex > 0 && (
          <TouchableOpacity onPress={() => setPageIndex(i => i - 1)} className="bg-gray-700 px-4 py-2 rounded">
            <Text className="text-white font-medium">Back</Text>
          </TouchableOpacity>
        )}

        {pageIndex < pageOrder.length - 1 ? (
          <TouchableOpacity onPress={() => setPageIndex(i => i + 1)} className="bg-red-600 px-4 py-2 rounded ml-auto">
            <Text className="text-white font-medium">Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSubmit} className="bg-green-600 px-4 py-2 rounded ml-auto">
            <Text className="text-white font-medium">Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}