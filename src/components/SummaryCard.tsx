import React from "react";
import { View, Text } from "react-native";
import { LoanResult } from "../models/LoanModels";
import { formatCurrency } from "../utils/loanCalculations";
import { useTheme } from "../utils/ThemeContext";

interface SummaryCardProps {
  result: LoanResult;
}

const MetricTile = ({
  label,
  value,
  accent,
  isDark,
}: {
  label: string;
  value: string;
  accent?: boolean;
  isDark: boolean;
}) => (
  <View
    className={`flex-1 rounded-2xl p-4 mx-1 ${
      accent
        ? "bg-sky-500"
        : isDark
        ? "bg-slate-800"
        : "bg-white border border-slate-100"
    }`}
  >
    <Text
      className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
        accent ? "text-sky-100" : isDark ? "text-slate-400" : "text-slate-500"
      }`}
    >
      {label}
    </Text>
    <Text
      className={`text-lg font-bold ${
        accent ? "text-white" : isDark ? "text-white" : "text-slate-900"
      }`}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {value}
    </Text>
  </View>
);

export const SummaryCard = ({ result }: SummaryCardProps) => {
  const { isDark } = useTheme();
  return (
    <View className="mb-6">
      <Text
        className={`text-xs font-semibold uppercase tracking-widest mb-3 ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Loan Summary
      </Text>
      <View className="flex-row -mx-1">
        <MetricTile
          label="Monthly EMI"
          value={formatCurrency(result.monthlyEMI)}
          accent
          isDark={isDark}
        />
        <MetricTile
          label="Total Interest"
          value={formatCurrency(result.totalInterestPayable)}
          isDark={isDark}
        />
        <MetricTile
          label="Total Payable"
          value={formatCurrency(result.totalAmountPayable)}
          isDark={isDark}
        />
      </View>
    </View>
  );
};
