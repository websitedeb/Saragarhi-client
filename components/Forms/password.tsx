import { useShowStore } from "@/hooks/store";
import { InputProps } from "@rneui/base";
import { Icon, Input } from "@rneui/themed";

interface PasswordInputProps extends InputProps {
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  placeholder?: string;
}

export function PasswordInput({
  value,
  onChangeText,
  errorMessage,
  placeholder = "Password",
  ...props
}: PasswordInputProps) {
  const { show, setShow } = useShowStore() as {
    show: boolean;
    setShow: (show: boolean) => void;
  };

  return (
    <Input
      {...props}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!show}
      autoCapitalize="none"
      textContentType="password"
      errorMessage={errorMessage}
      rightIcon={
        <Icon
          name={show ? "eye-off" : "eye"}
          type="feather"
          color="#aaa"
          onPress={() => setShow(!show)}
        />
      }
    />
  );
}
