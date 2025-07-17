import React from "react";
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";

type Props = {
  onClick?: ((event: GestureResponderEvent) => void) | undefined;
  title?: any
};

export const Button: React.FC<Props> = ({ title, onClick }) => {
    return(
        <TouchableOpacity
            onPress={onClick}
            className="bg-red-600 rounded-3xl px-32 py-2"
        >
            <Text className="text-white text-center font-bold text-2xl pl-5 pr-5" style={{ fontFamily: "Inter"}}>{title}</Text>
        </TouchableOpacity>
    )
};
