import { Button } from "@/components/Forms/Data/button";
import { Frame } from "@/components/Forms/Data/frame";
import { Input } from '@rneui/themed';
import { useState } from "react";
import { Image, Text, View } from "react-native";

export default function SignIn(){
    const [emailErr, setEmailErr] = useState("");
    const [passErr, setPassErr] = useState("");

    return(
        <View className="flex-1 bg-gray-700 justify-center items-center">
            <View id="image" className="h-60 -mt-24">
                <Image source={require("../assets/images/red_alert.png")} style={{height: 300, width: 300, resizeMode: "contain"}} />
            </View>
            <Text className="pb-2 font-semibold text-white" style={{ fontFamily: "Inter" }}>Complete the Login to Proceed</Text>
            <Frame isVisible={false}>
                <Input
                    id="email"
                    textContentType="emailAddress"
                    placeholder='Email'
                    errorStyle={{ color: 'red' }}
                    errorMessage={emailErr}
                    style={{ fontFamily: "Inter", color: "white", fontWeight: "medium" }}
                />
                <Input
                    id="pass"
                    textContentType="password"
                    placeholder='Password'
                    errorStyle={{ color: 'red' }}
                    errorMessage={passErr}
                    style={{ fontFamily: "Inter", color: "white", fontWeight: "medium" }}
                />
                <Button title={"Login"} onClick={() => {}} />
            </Frame>
        </View>
    )
}