import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../utils/ThemeContext";

interface SaveModalProps {
  visible: boolean;
  onSave: (label: string) => void;
  onClose: () => void;
}

export const SaveModal = ({ visible, onSave, onClose }: SaveModalProps) => {
  const { isDark } = useTheme();
  const [label, setLabel] = useState("");

  const handleSave = () => {
    const trimmed = label.trim();
    onSave(trimmed || `Loan — ${new Date().toLocaleDateString()}`);
    setLabel("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <View
          className={`w-80 rounded-2xl p-6 ${
            isDark ? "bg-slate-800" : "bg-white"
          }`}
        >
          <Text
            className={`text-lg font-bold mb-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Save Calculation
          </Text>
          <Text
            className={`text-sm mb-4 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Give this calculation a name to find it later.
          </Text>

          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="e.g. Car Loan 2024"
            placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
            className={`rounded-xl border px-4 py-3 text-base mb-5 ${
              isDark
                ? "border-slate-600 bg-slate-700 text-white"
                : "border-slate-200 bg-slate-50 text-slate-900"
            }`}
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className={`flex-1 py-3 rounded-xl border ${
                isDark ? "border-slate-600" : "border-slate-200"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 py-3 rounded-xl bg-sky-500"
            >
              <Text className="text-center font-semibold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
