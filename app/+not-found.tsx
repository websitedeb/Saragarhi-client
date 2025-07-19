import { Button } from "@/components/Forms/button";
import { Fonts } from "@/hooks/useFont";
import { router } from "expo-router";
import { Text, View } from "react-native";

function moto() {
  const mots = [
    "Woah, Woah, Woah",
    "OI, OI, OI",
    "BALA, BALA, BALA",
    "Wait A Second...",
    "Wait A Minute...",
    "O_o",
    "Oh, hello...",
    "Hm?",
    ">_>",
    ">_<",
    "O>O",
    "UWU",
    "Huh?",
    "GUH",
    "...",
    "Woah!"
  ];

  return mots[Math.floor(Math.random() * mots.length)];
}

export default function NotFoundScreen() {
  return (
    <View className="flex-1 bg-gray-900 justify-center items-center">
      <View className="justify-center items-center" style={{ transform: [{ rotate: "13.5deg" }] }}>
        <Text className="text-white font-semibold text-6xl" style={{ fontFamily: Fonts.Fun }}>
          {moto()}
        </Text>
        <Text className="text-white font-semibold text-4xl" style={{ fontFamily: Fonts.Fun }}>
          What are <Text className="underline text-red-700">YOU</Text> doing here?
        </Text>
      </View>
      <Text className="text-white font-semibold text-lg mt-20 text-center mx-5" style={{ fontFamily: Fonts.Inter }}>
        Seems like you stumbled upon a page that either doesn't exist, or is being worked on...
      </Text>
      <Text className="text-red-700 font-semibold text-2xl mt-1 mb-20 text-center" style={{ fontFamily: Fonts.Inter }}>
        You are not supposed to be here.
      </Text>
      <Button
        onClick={() => {
          router.back();
        }}
        title="Head Back Now"
        className="text-lg pr-0 pl-0 pb-3 pt-3"
      />
    </View>
  );
}
