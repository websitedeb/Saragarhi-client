import { protectRoute } from "@/hooks/session";
import { useEffect } from "react";
import { View } from "react-native";

export default function Complete(){

    useEffect(() => {
        protectRoute();
    }, [])

    return (
        <View>
            
        </View>
    );
}