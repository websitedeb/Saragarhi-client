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
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeamSignUp() {
  const [teamCodeErr, setTeamCodeErr] = useState("");
  const [teamNumErr, setTeamNumErr] = useState("");
  const [teamNameErr, setTeamNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [passCheckErr, setPassCheckErr] = useState("");
  const [nameErr, setNameErr] = useState("");

  const [teamCode, setTeamCode] = useState("");
  const [teamNum, setTeamNum] = useState("");
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [passCheck, setPassCheck] = useState("");

  const createTeamMutation = useMutation({
    mutationFn: async () => {
      const checkRes = await fetch(
        "https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/getTeam",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamNum }),
        }
      );
      if (checkRes.ok) {
        throw { status: 409, message: "Team already exists" };
      }

      const parsedTC = parseInt(teamCode, 10);
      const parsedTN = parseInt(teamNum, 10);

      const teamRes = await fetch(
        "https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/addTeam",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamCode: parsedTC, teamNum: parsedTN, teamName }),
        }
      );

      if (!teamRes.ok) {
        const status = teamRes.status;
        const json = await teamRes.json();
        throw { status, message: json.error || "Failed to create team" };
      } 

      const userRes = await fetch(
        "https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/addUser",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            teamCode: parsedTC,
            Password: pass,
            Role: "Organizer"
          }),
        }
      );

      if (!userRes.ok) {
        const status = userRes.status;
        const json = await userRes.json();
        throw { status, message: json.error || "Failed to create account" };
      }

      return userRes.json();
    },
    onSuccess: ($) => {
      router.push("/signin");
    },
    onError: (err: any) => {
      if (err.status === 400) {
        setTeamCodeErr("Fill in all fields");
        setTeamNumErr("Fill in all fields");
        setTeamNameErr("Fill in all fields");
        setEmailErr("Fill in all fields");
        setPassErr("Fill in all fields");
        setPassCheckErr("Fill in all fields");
        setNameErr("Fill in all fields");
      } else if (err.status === 409) {
        setTeamNumErr("Team already exists");
      } else if (err.status === 500) {
        setTeamCodeErr("Server error, try again later");
      } else {
        setTeamCodeErr("Unexpected error: " + err.message);
        console.log(teamCodeErr)
      }
    },
  });

  function handleTeamSignUp() {
    setTeamCodeErr("");
    setTeamNumErr("");
    setTeamNameErr("");
    setEmailErr("");
    setPassErr("");
    setPassCheckErr("");
    setNameErr("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!teamCode || !teamNum || !teamName || !email || !pass || !passCheck || !name) {
      setTeamCodeErr("All fields required");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailErr("Please enter a valid email address.");
      return;
    }

    if (pass !== passCheck) {
      setPassCheckErr("Passwords do not match.");
      return;
    }

    if (pass.includes(" ")) {
      setPassErr("Password should not contain spaces.");
      return;
    }

    createTeamMutation.mutate();
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
        <View id="image" style={{ height: 240, marginTop: -60 }}>
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
          Team Sign-up
        </Text>
        <Frame isVisible={false}>
          <Input
            placeholder="Team Code"
            value={teamCode}
            onChangeText={setTeamCode}
            errorMessage={teamCodeErr}
            errorStyle={{ color: "red" }}
            style={{ fontFamily: "Inter", color: "white", fontWeight: "500" }}
            keyboardType="numeric"
          />
          <Input
            placeholder="Team Number"
            value={teamNum}
            onChangeText={setTeamNum}
            errorMessage={teamNumErr}
            errorStyle={{ color: "red" }}
            style={{ fontFamily: "Inter", color: "white", fontWeight: "500" }}
            keyboardType="numeric"
          />
          <Input
            placeholder="Team Name"
            value={teamName}
            onChangeText={setTeamName}
            errorMessage={teamNameErr}
            errorStyle={{ color: "red" }}
            style={{ fontFamily: "Inter", color: "white", fontWeight: "500" }}
          />

          <Input
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            errorMessage={emailErr}
            errorStyle={{ color: "red" }}
            autoCapitalize="none"
            autoComplete="email"
            style={{ fontFamily: "Inter", color: "white", fontWeight: "500" }}
            keyboardType="email-address"
          />
          <Input
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
            errorMessage={nameErr}
            errorStyle={{ color: "red" }}
            style={{ fontFamily: "Inter", color: "white", fontWeight: "500" }}
          />
          <PasswordInput
            value={pass}
            onChangeText={setPass}
            errorMessage={passErr}
            style={{ fontFamily: "Inter", color: "white", fontWeight: "500" }}
            placeholder="Password"
          />
          <PasswordInput
            value={passCheck}
            onChangeText={setPassCheck}
            errorMessage={passCheckErr}
            style={{ fontFamily: "Inter", color: "white", fontWeight: "500" }}
            placeholder="Confirm Password"
          />

          <Button
            title={
              createTeamMutation.isPending ? (
                <ActivityIndicator size="small" color="#b91c1c" />
              ) : (
                "Create Team"
              )
            }
            onClick={handleTeamSignUp}
            className="text-lg"
          />

          <SafeAreaView className="items-center">
            <Link href="/signup" className="text-red-700 underline text-xl">
              Don't have an Account?
            </Link>
            <Link href="/signin" className="mt-4 text-red-700 underline text-xl">
              Already have an Account?
            </Link>
          </SafeAreaView>
        </Frame>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
