import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { useTheme } from "../utils/ThemeContext";

interface ThemedInputProps extends TextInputProps {
  label: string;
  suffix?: string;
  error?: boolean;
}

export const ThemedInput = ({ label, suffix, error, ...props }: ThemedInputProps) => {
  const { isDark } = useTheme();

  return (
    <View className="mb-4">
      <Text
        className={`text-xs font-semibold uppercase tracking-widest mb-1.5 ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-xl border px-4 ${
          error
            ? "border-red-400"
            : isDark
            ? "border-slate-600 bg-slate-800"
            : "border-slate-200 bg-white"
        }`}
      >
        <TextInput
          className={`flex-1 py-3.5 text-base ${
            isDark ? "text-white" : "text-slate-900"
          }`}
          placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
          keyboardType="numeric"
          {...props}
        />
        {suffix ? (
          <Text
            className={`text-sm font-medium ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {suffix}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
