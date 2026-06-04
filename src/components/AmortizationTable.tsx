import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { AmortizationRow } from "../models/LoanModels";
import { formatCurrency } from "../utils/loanCalculations";
import { useTheme } from "../utils/ThemeContext";

interface AmortizationTableProps {
  schedule: AmortizationRow[];
}

const PAGE_SIZE = 12;

const HeaderCell = ({ label, isDark }: { label: string; isDark: boolean }) => (
  <Text
    className={`flex-1 text-center text-xs font-bold uppercase tracking-wider ${
      isDark ? "text-slate-400" : "text-slate-500"
    }`}
    numberOfLines={1}
  >
    {label}
  </Text>
);

const RowCell = ({
  value,
  isDark,
  highlight,
}: {
  value: string;
  isDark: boolean;
  highlight?: boolean;
}) => (
  <Text
    className={`flex-1 text-center text-xs ${
      highlight
        ? "text-sky-500 font-semibold"
        : isDark
        ? "text-slate-300"
        : "text-slate-700"
    }`}
    numberOfLines={1}
  >
    {value}
  </Text>
);

export const AmortizationTable = ({ schedule }: AmortizationTableProps) => {
  const { isDark } = useTheme();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(schedule.length / PAGE_SIZE);
  const pageData = schedule.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <View>
      <Text
        className={`text-xs font-semibold uppercase tracking-widest mb-3 ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Amortization Schedule
      </Text>

      <View
        className={`rounded-2xl overflow-hidden border ${
          isDark ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <View
          className={`flex-row px-2 py-3 ${
            isDark ? "bg-slate-800" : "bg-slate-50"
          }`}
        >
          <HeaderCell label="#" isDark={isDark} />
          <HeaderCell label="EMI" isDark={isDark} />
          <HeaderCell label="Interest" isDark={isDark} />
          <HeaderCell label="Principal" isDark={isDark} />
          <HeaderCell label="Balance" isDark={isDark} />
        </View>

        {pageData.map((row, index) => (
          <View
            key={row.paymentNumber}
            className={`flex-row px-2 py-2.5 ${
              index % 2 === 0
                ? isDark
                  ? "bg-slate-900"
                  : "bg-white"
                : isDark
                ? "bg-slate-800/50"
                : "bg-slate-50/50"
            }`}
          >
            <RowCell value={String(row.paymentNumber)} isDark={isDark} />
            <RowCell value={formatCurrency(row.emi)} isDark={isDark} highlight />
            <RowCell value={formatCurrency(row.interestComponent)} isDark={isDark} />
            <RowCell value={formatCurrency(row.principalComponent)} isDark={isDark} />
            <RowCell value={formatCurrency(row.remainingBalance)} isDark={isDark} />
          </View>
        ))}
      </View>

      {totalPages > 1 && (
        <View className="flex-row justify-between items-center mt-4">
          <TouchableOpacity
            disabled={page === 0}
            onPress={() => setPage((p) => p - 1)}
            className={`px-5 py-2 rounded-xl ${
              page === 0
                ? isDark
                  ? "bg-slate-800"
                  : "bg-slate-100"
                : "bg-sky-500"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                page === 0
                  ? isDark
                    ? "text-slate-600"
                    : "text-slate-400"
                  : "text-white"
              }`}
            >
              ← Prev
            </Text>
          </TouchableOpacity>

          <Text className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Page {page + 1} of {totalPages}
          </Text>

          <TouchableOpacity
            disabled={page === totalPages - 1}
            onPress={() => setPage((p) => p + 1)}
            className={`px-5 py-2 rounded-xl ${
              page === totalPages - 1
                ? isDark
                  ? "bg-slate-800"
                  : "bg-slate-100"
                : "bg-sky-500"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                page === totalPages - 1
                  ? isDark
                    ? "text-slate-600"
                    : "text-slate-400"
                  : "text-white"
              }`}
            >
              Next →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
