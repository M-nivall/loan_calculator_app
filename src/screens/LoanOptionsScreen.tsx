import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "../utils/ThemeContext";

const loanOptions = [
  {
    title: "Personal Loan",
    emoji: "👤",
    rateRange: "12% – 24%",
    typical: "1 – 5 years",
    notes: "Unsecured; quick disbursement; higher rates due to no collateral.",
  },
  {
    title: "Home / Mortgage Loan",
    emoji: "🏠",
    rateRange: "11% – 16%",
    typical: "10 – 25 years",
    notes: "Secured against property; lower rate; longest tenure option.",
  },
  {
    title: "Car / Asset Loan",
    emoji: "🚗",
    rateRange: "13% – 20%",
    typical: "1 – 5 years",
    notes: "Secured against the vehicle; moderate rates.",
  },
  {
    title: "Business / SME Loan",
    emoji: "💼",
    rateRange: "14% – 28%",
    typical: "1 – 7 years",
    notes: "Rates vary by lender and credit score; may require guarantor.",
  },
  {
    title: "Logbook Loan",
    emoji: "📄",
    rateRange: "24% – 36%",
    typical: "6 – 36 months",
    notes: "Secured against vehicle logbook; fast approval.",
  },
  {
    title: "Mobile / Digital Loan",
    emoji: "📱",
    rateRange: "6% – 15% / month",
    typical: "7 – 90 days",
    notes: "M-Pesa, Fuliza, Tala etc. Very short tenure; high effective APR.",
  },
];

const tipItems = [
  "Lower EMI ≠ cheaper loan — a longer tenure means more total interest paid.",
  "Compare the Total Amount Payable, not just the monthly EMI.",
  "A 0.5% rate reduction on KES 1 M over 5 years saves ~KES 15,000+ in interest.",
  "Early repayments can significantly cut total interest — ask your lender about penalties.",
  "Your credit score directly affects the rate you're offered.",
];

export const LoanOptionsScreen = () => {
  const { isDark } = useTheme();
  const bg = isDark ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const text = isDark ? "text-white" : "text-slate-900";
  const sub = isDark ? "text-slate-400" : "text-slate-500";
  const border = isDark ? "border-slate-700" : "border-slate-100";

  return (
    <ScrollView
      className={`flex-1 ${bg}`}
      contentContainerStyle={{ padding: 20, paddingTop: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-8">
        <Text className={`text-3xl font-black ${text}`}>Loan Options</Text>
        <Text className={`text-sm mt-0.5 ${sub}`}>Common loan types in Kenya</Text>
      </View>

      {loanOptions.map((option) => (
        <View
          key={option.title}
          className={`${cardBg} rounded-2xl p-4 mb-3 border ${border}`}
        >
          <View className="flex-row items-center mb-2">
            <Text className="text-2xl mr-3">{option.emoji}</Text>
            <Text className={`text-base font-bold ${text}`}>{option.title}</Text>
          </View>
          <View className="flex-row mb-2">
            <View className="flex-1">
              <Text className={`text-xs ${sub}`}>Typical Rate</Text>
              <Text className="text-sky-500 font-semibold text-sm">{option.rateRange}</Text>
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${sub}`}>Tenure</Text>
              <Text className={`font-semibold text-sm ${text}`}>{option.typical}</Text>
            </View>
          </View>
          <Text className={`text-xs leading-5 ${sub}`}>{option.notes}</Text>
        </View>
      ))}

      <View className="mt-6 mb-2">
        <Text className={`text-base font-bold mb-3 ${text}`}>💡 Smart Borrowing Tips</Text>
        {tipItems.map((tip, i) => (
          <View key={i} className="flex-row mb-2">
            <Text className="text-sky-500 mr-2 text-sm">•</Text>
            <Text className={`flex-1 text-sm leading-5 ${sub}`}>{tip}</Text>
          </View>
        ))}
      </View>

      <View className="h-16" />
    </ScrollView>
  );
};
