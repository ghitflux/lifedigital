import React from "react";
import { View, Text, ViewProps, TextProps } from "react-native";
import { tokens } from "@life/tokens";
export const Box: React.FC<ViewProps> = ({ style, ...p }) => <View {...p} style={[{ backgroundColor: "transparent" }, style]} />;
export const Txt: React.FC<TextProps & { variant?: keyof typeof tokens.typography }> = ({ variant="body", style, children, ...p }) => {
  const t = tokens.typography[variant];
  return <Text {...p} style={[{ color: tokens.colors.text, fontSize: t.size, lineHeight: t.lh, fontWeight: t.weight as any }, style]}>{children}</Text>;
};
