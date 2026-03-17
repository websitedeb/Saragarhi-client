import { useEffect } from "react";
import { DB_URL } from "@/constants/constants";
import { protectRoute } from "@/hooks/session";
import { useSignStore } from "@/hooks/store";
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from "recharts";
import { TextInput, Text, StyleSheet, View, Touchable, TouchableOpacity } from "react-native";
import { Fonts } from "@/hooks/useFont";

export default function Predict() {
    const { sign } = useSignStore() as { sign: string };

    useEffect(() => {
        protectRoute();
    }, []);

    const data = [
        { name: "Team 1", "Weighted Performance Score": 4000 },
        { name: "Team 2", "Weighted Performance Score": 4000 },
        { name: "Team 3", "Weighted Performance Score": 4000 },
        { name: "Team 4", "Weighted Performance Score": 4000 },
        { name: "Team 5", "Weighted Performance Score": 4000 },
        { name: "Team 6", "Weighted Performance Score": 4000 },
    ];

    const data1 = [
        { name: "Red Alliance", "Weighted Performance Score": 4000 },
        { name: "Blue Alliance", "Weighted Performance Score": 4000 },
    ];

    const data2 = [
        { name: "Red Alliance", ELO: 4000 },
        { name: "Blue Alliance", ELO: 4000 },
    ];

    return (
        <View className="flex-1 bg-gray-950 items-center overflow-y-scroll justify-center pt-96">

            {/* ALLIANCE INPUTS */}
            <View className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 mt-96">

                {/* RED ALLIANCE */}
                <view className="bg-gray-900 rounded-2xl p-5 border border-red-500/40">
                    <Text className="text-red-400 text-xl font-bold mb-4">
                        Red Alliance
                    </Text>

                    <View className="!gap-y-3">
                        <TextInput
                            placeholder="Red 1 Team Number"
                            keyboardType="numeric"
                            className="border border-red-500 rounded-xl px-4 py-3 text-white bg-gray-950 text-lg"
                            placeholderTextColor="#ef4444"
                        />
                        <TextInput
                            placeholder="Red 2 Team Number"
                            keyboardType="numeric"
                            className="border border-red-500 rounded-xl px-4 py-3 text-white bg-gray-950 text-lg"
                            placeholderTextColor="#ef4444"
                        />
                        <TextInput
                            placeholder="Red 3 Team Number"
                            keyboardType="numeric"
                            className="border border-red-500 rounded-xl px-4 py-3 text-white bg-gray-950 text-lg"
                            placeholderTextColor="#ef4444"
                        />
                    </View>
                </view>

                {/* BLUE ALLIANCE */}
                <view className="bg-gray-900 rounded-2xl p-5 border border-blue-500/40">
                    <Text className="text-blue-400 text-xl font-bold mb-4">
                        Blue Alliance
                    </Text>

                    <View className="gap-y-3">
                        <TextInput
                            placeholder="Blue 1 Team Number"
                            keyboardType="numeric"
                            className="border border-blue-500 rounded-xl px-4 py-3 text-white bg-gray-950 text-lg"
                            placeholderTextColor="#3b82f6"
                        />
                        <TextInput
                            placeholder="Blue 2 Team Number"
                            keyboardType="numeric"
                            className="border border-blue-500 rounded-xl px-4 py-3 text-white bg-gray-950 text-lg"
                            placeholderTextColor="#3b82f6"
                        />
                        <TextInput
                            placeholder="Blue 3 Team Number"
                            keyboardType="numeric"
                            className="border border-blue-500 rounded-xl px-4 py-3 text-white bg-gray-950 text-lg"
                            placeholderTextColor="#3b82f6"
                        />
                    </View>
                </view>
                <Text></Text>
                <TouchableOpacity className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-red-600 hover:to-blue-600 transition-colors" style={{ fontFamily: Fonts.Shrikhand }}>
                    Predict
                </TouchableOpacity>
            </View>

            {/* TEAM PERFORMANCE CHART */}
            <view className="p-6 mb-10 w-full max-w-5xl">
                <Text className="text-white text-xl font-bold mb-4 text-center">
                    Team Performance
                </Text>

                <BarChart style={styles.chart} responsive data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                    <XAxis dataKey="name" stroke="#9ca3af"/>
                    <YAxis width="auto" stroke="#9ca3af"/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Weighted Performance Score" fill="#ef4444" />
                </BarChart>
            </view>

            {/* ALLIANCE CHARTS */}
            <view className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                {/* WPS */}
                <view className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                    <Text className="text-white text-lg font-semibold mb-4">
                        Alliance Performance
                    </Text>

                    <BarChart style={styles.smChart} responsive data={data1}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                        <XAxis dataKey="name" stroke="#9ca3af"/>
                        <YAxis width="auto" stroke="#9ca3af"/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Weighted Performance Score" fill="#ef4444" />
                    </BarChart>
                </view>

                {/* ELO */}
                <view className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                    <Text className="text-white text-lg font-semibold mb-4">
                        Alliance ELO
                    </Text>

                    <BarChart style={styles.smChart} responsive data={data2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                        <XAxis dataKey="name" stroke="#9ca3af"/>
                        <YAxis width="auto" stroke="#9ca3af"/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ELO" fill="#3b82f6" />
                    </BarChart>
                </view>

            </view>

            {/* WINNER PANEL */}
            <view className="bg-gray-900 border border-gray-800 rounded-2xl px-10 py-6">
                <Text className="text-gray-400 text-center text-sm mb-1">
                    Predicted Winner
                </Text>

                <Text className="text-white text-4xl font-extrabold text-center">
                    Team []
                </Text>
            </view>

        </View>
    );
}

const styles = StyleSheet.create({
    chart: {
        width: "100%",
        height: 350,
    },
    smChart: {
        width: "100%",
        height: 300,
    },
});