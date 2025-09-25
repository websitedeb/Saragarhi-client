import React from "react";
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";

type Props = {
  onClick?: ((event: GestureResponderEvent) => void) | undefined;
  title?: any;
  className?: string;
  style?: any;
};

function concat(t1 : string | undefined, t2 : string | undefined) : string{
    const n = t1 + " " + t2;
    return n;
}

export const Button: React.FC<Props> = ({ title, onClick, className, style = {} }) => {
    return(
        <TouchableOpacity
            onPress={onClick}
            className="bg-red-600 rounded-3xl px-32 py-2 border-red-500"
            style={style}
        >
            <Text className={concat("text-white text-center font-bold text-2xl pl-5 pr-5", className)} style={{ fontFamily: "Inter"}}>{title}</Text>
        </TouchableOpacity>
    )
};
