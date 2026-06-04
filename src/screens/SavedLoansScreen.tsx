import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSavedLoansViewModel } from "../viewmodels/useSavedLoansViewModel";
import { useCalculatorViewModel } from "../viewmodels/useCalculatorViewModel";
import { formatCurrency } from "../utils/loanCalculations";
import { useTheme } from "../utils/ThemeContext";
import { SavedLoan } from "../models/LoanModels";

interface Props {
  onOpen: (loan: SavedLoan) => void;
}

export const SavedLoansScreen = ({ onOpen }: Props) => {
  const { isDark } = useTheme();
  const vm = useSavedLoansViewModel();

  useFocusEffect(
    useCallback(() => {
      vm.loadLoans();
    }, [])
  );

  const bg = isDark ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const text = isDark ? "text-white" : "text-slate-900";
  const sub = isDark ? "text-slate-400" : "text-slate-500";
  const border = isDark ? "border-slate-700" : "border-slate-100";

  const handleDelete = (id: string, label: string) => {
    Alert.alert("Delete", `Remove "${label}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => vm.removeLoand(id) },
    ]);
  };

  const renderItem = ({ item }: { item: SavedLoan }) => (
    <TouchableOpacity
      onPress={() => onOpen(item)}
      className={`${cardBg} rounded-2xl p-4 mb-3 border ${border}`}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className={`font-bold text-base ${text}`} numberOfLines={1}>
            {item.label}
          </Text>
          <Text className={`text-xs mt-0.5 ${sub}`}>
            {new Date(item.savedAt).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.label)}
          className={`w-8 h-8 rounded-full items-center justify-center ${
            isDark ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <Text className="text-red-400 text-sm">✕</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row">
        <View className="flex-1">
          <Text className={`text-xs ${sub}`}>Principal</Text>
          <Text className={`text-sm font-semibold ${text}`}>
            {formatCurrency(item.input.loanAmount)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className={`text-xs ${sub}`}>Rate</Text>
          <Text className={`text-sm font-semibold ${text}`}>
            {item.input.annualInterestRate}% p.a.
          </Text>
        </View>
        <View className="flex-1">
          <Text className={`text-xs ${sub}`}>Tenure</Text>
          <Text className={`text-sm font-semibold ${text}`}>
            {item.input.tenure} {item.input.tenureUnit}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text className={`text-xs ${sub}`}>Monthly EMI</Text>
          <Text className="text-sm font-bold text-sky-500">
            {formatCurrency(item.result.monthlyEMI)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${bg}`}>
      <FlatList
        data={vm.savedLoans}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingTop: 60 }}
        ListHeaderComponent={
          <View className="mb-6">
            <Text className={`text-3xl font-black ${text}`}>Saved</Text>
            <Text className={`text-sm mt-0.5 ${sub}`}>
              {vm.savedLoans.length} saved calculation{vm.savedLoans.length !== 1 ? "s" : ""}
            </Text>
          </View>
        }
        ListEmptyComponent={
          !vm.loading ? (
            <View className="items-center mt-24">
              <Text className="text-4xl mb-4">📋</Text>
              <Text className={`text-base font-semibold ${text}`}>No saved loans</Text>
              <Text className={`text-sm mt-1 ${sub}`}>
                Calculate a loan and tap "Save" to see it here.
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
