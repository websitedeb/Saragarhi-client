import { Button } from "@/components/Forms/button";
import { Frame } from "@/components/Forms/frame";
import { PasswordInput } from "@/components/Forms/password";
import { getSession, saveSession } from "@/hooks/session";
import { Input } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function SignIn() {
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const data = {
    email: email,
    Password: password.trim(),
  };

  useEffect(() => {
  (async () => {
      const token = await getSession();
      if (token) {
        router.push("/dashboard");
      }
    })();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const status = res.status;
        const json = await res.json();
        throw { status, message: json.error || "Login failed" };
      }

      return res.json();
    },
    onSuccess: async (output) => {
      await saveSession(output.data, 1440);
      router.push(`/dashboard`);
      setEmailErr("");
    },
    onError: (err: any) => {
      if (err.status === 404) {
        setEmailErr("Email not found");
      } else if (err.status === 401) {
        setPassErr("Incorrect password");
      } else if (err.status === 400) {
        setEmailErr("Please fill in all fields");
      } else {
        setEmailErr("An unexpected error occurred: " + err.message);
      }
    },
  });

  function handleLogin() {
    setEmailErr("");
    setPassErr("");
    loginMutation.mutate();
  }

  return (
    <View className="flex-1 bg-gray-700 justify-center items-center">
      <View id="image" className="h-60 -mt-24">
        <Image
          source={require("../assets/images/red_alert.png")}
          style={{ height: 300, width: 300, resizeMode: "contain" }}
        />
      </View>
      <Text className="pb-2 font-semibold text-white" style={{ fontFamily: "Inter" }}>
        Complete the Login to Proceed
      </Text>
      <Frame isVisible={false}>
        <Input
          id="email"
          value={email}
          onChangeText={setEmail}
          textContentType="emailAddress"
          placeholder="Email"
          errorStyle={{ color: "red" }}
          errorMessage={emailErr}
          style={{ fontFamily: "Inter", color: "white", fontWeight: "500" }}
          autoCapitalize={"none"}
          autoComplete="email"
        />
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          errorMessage={passErr}
          style={{ fontFamily: "Inter", color: "white", fontWeight: "500" }}
        />
        <Button
          title={loginMutation.isPending ? <ActivityIndicator size="small" color="#b91c1c" /> : "Login"}
          onClick={handleLogin}
        />
        <Link href="/signup" className="mt-40 text-red-700 underline text-xl">
          Don't have an Account?
        </Link>
      </Frame>
    </View>
  );
}
