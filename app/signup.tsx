import { Button } from "@/components/Forms/button";
import { Frame } from "@/components/Forms/frame";
import { PasswordInput } from "@/components/Forms/password";
import { Input } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function SignIn() {
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [codeErr, setCodeErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [passCheckErr, setPassCheckErr] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [pass, setPass] = useState("");
  const [passCheck, setPassCheck] = useState("");

  const data = {
    email,
    name,
    teamCode: code,
    Password: pass,
  };

  const signupMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        "https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/addUser",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const status = res.status;
        const json = await res.json();
        throw { status, message: json.error || "Login failed" };
      }

      return res.json();
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (err: any) => {
      if (err.status === 400) {
        setEmailErr("Fill in all fields");
        setCodeErr("Fill in all fields");
        setPassErr("Fill in all fields");
        setNameErr("Fill in all fields");
        setPassCheckErr("Fill in all fields");
      } else if (err.status === 409) {
        setEmailErr("Email already exists, use another one");
      } else if (err.status === 500) {
        setEmailErr("Failed to create account, please try again later");
      } else if (err.status === 404) {
        setCodeErr("Team code not found");
      } else {
        setEmailErr("An unexpected error occurred: " + err.message);
      }
    },
  });

  function handleSignIn() {
    setEmailErr("");
    setPassErr("");
    setNameErr("");
    setCodeErr("");
    setPassCheckErr("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailErr("Please enter a valid email address");
      return;
    }

    if (pass !== passCheck) {
      setPassCheckErr("Passwords do not match");
      return;
    }

    signupMutation.mutate();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#374151" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View id="image" style={{ height: 240, marginTop: -96 }}>
          <Image
            source={require("../assets/images/red_alert.png")}
            style={{
              height: 300,
              width: 300,
              resizeMode: "contain",
            }}
          />
        </View>
        <Text
          style={{
            paddingBottom: 8,
            fontWeight: "600",
            color: "white",
            fontFamily: "Inter",
          }}
        >
          Complete the Sign-up to Proceed
        </Text>
        <Frame isVisible={false}>
          <Input
            id="email"
            textContentType="emailAddress"
            placeholder="Email"
            errorStyle={{ color: "red" }}
            errorMessage={emailErr}
            style={{
              fontFamily: "Inter",
              color: "white",
              fontWeight: "500",
            }}
            autoCapitalize="none"
            autoComplete="email"
            onChangeText={setEmail}
          />
          <Input
            id="name"
            textContentType="username"
            placeholder="Name (Yes, your real one)"
            style={{
              fontFamily: "Inter",
              color: "white",
              fontWeight: "500",
            }}
            autoCapitalize="words"
            autoComplete="username"
            errorStyle={{ color: "red" }}
            errorMessage={nameErr}
            onChangeText={setName}
          />
          <Input
            id="code"
            textContentType="password"
            placeholder="Team Code"
            errorStyle={{ color: "red" }}
            errorMessage={codeErr}
            style={{
              fontFamily: "Inter",
              color: "white",
              fontWeight: "500",
            }}
            autoCapitalize="none"
            autoComplete="off"
            onChangeText={setCode}
          />
          <PasswordInput
            value={pass}
            onChangeText={setPass}
            errorMessage={passErr}
            style={{
              fontFamily: "Inter",
              color: "white",
              fontWeight: "500",
            }}
          />
          <PasswordInput
            value={passCheck}
            onChangeText={setPassCheck}
            errorMessage={passCheckErr}
            style={{
              fontFamily: "Inter",
              color: "white",
              fontWeight: "500",
            }}
            placeholder="Confirm Password"
          />
          <Button
            title={
              signupMutation.isPending ? (
                <ActivityIndicator size="small" color="#b91c1c" />
              ) : (
                "Sign Up"
              )
            }
            onClick={handleSignIn}
            className="text-lg"
          />
          <Link
            href="/signin"
            className="mt-12 text-red-700 underline text-xl"
          >
            Already have an Account?
          </Link>
        </Frame>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
