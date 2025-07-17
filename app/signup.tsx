import { Button } from "@/components/Forms/button";
import { Frame } from "@/components/Forms/frame";
import { Input } from '@rneui/themed';
import { Link, router } from "expo-router";
import { useState } from "react";
import { Image, Text, View } from "react-native";

export default function SignIn(){
    const [emailErr, setEmailErr] = useState("");
    const [passErr, setPassErr] = useState("");
    const [codeErr, setCodeErr] = useState("");

    return(
        <View className="flex-1 bg-gray-700 justify-center items-center">
            <View id="image" className="h-60 -mt-24">
                <Image source={require("../assets/images/red_alert.png")} style={{height: 300, width: 300, resizeMode: "contain"}} />
            </View>
            <Text className="pb-2 font-semibold text-white" style={{ fontFamily: "Inter" }}>Complete the Sign-up to Proceed</Text>
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
                    id="name"
                    textContentType="username"
                    placeholder='Name (Yes, your real one)'
                    style={{ fontFamily: "Inter", color: "white", fontWeight: "medium" }}
                />
                <Input
                    id="code"
                    textContentType="password"
                    placeholder='Team Code'
                    errorStyle={{ color: 'red' }}
                    errorMessage={codeErr}
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
                <Button title={"Sign-up"} onClick={() => {router.navigate("/dashboard")}} className="text-lg"/>
                <Link href="/signin" className="mt-12 text-red-700 underline text-xl">Already have an Account?</Link>
            </Frame>
        </View>
    )
}