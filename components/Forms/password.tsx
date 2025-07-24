import { InputProps } from "@rneui/base";
import { Icon, Input } from "@rneui/themed";
import { useState } from "react";

interface PasswordInputProps extends InputProps {
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
}

export function PasswordInput({
  value,
  onChangeText,
  errorMessage,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Input
      {...props}
      value={value}
      onChangeText={onChangeText}
      placeholder="Password"
      secureTextEntry={!showPassword}
      autoCapitalize="none"
      textContentType="password"
      errorMessage={errorMessage}
      rightIcon={
        <Icon
          name={showPassword ? "eye-off" : "eye"}
          type="feather"
          color="#aaa"
          onPress={() => setShowPassword((prev) => !prev)}
        />
      }
    />
  );
}
