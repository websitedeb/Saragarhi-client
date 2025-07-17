import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children?: React.ReactNode;
  isVisible?: boolean;
  nonVisibleColor?: string;
};

export const Frame: React.FC<Props> = ({
  children,
  isVisible = false,
  nonVisibleColor = "#374151",
}) => {
  const borderColor = isVisible ? "#ed1c24" : nonVisibleColor;

  return (
    <View style={[styles.frame, { borderColor }]} className="justify-center items-center">
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    borderRadius: 8,
    borderWidth: 2,
    width: 350,
    padding: 8,
  },
});
