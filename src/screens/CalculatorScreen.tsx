import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCalculatorViewModel } from "../viewmodels/useCalculatorViewModel";
import { ThemedInput } from "../components/ThemedInput";
import { SummaryCard } from "../components/SummaryCard";
import { AmortizationTable } from "../components/AmortizationTable";
import { SaveModal } from "../components/SaveModal";
import { useTheme } from "../utils/ThemeContext";
import { TenureUnit } from "../models/LoanModels";

type ViewModel = ReturnType<typeof useCalculatorViewModel>;

interface Props {
  vmOverride?: ViewModel;
}

export const CalculatorScreen = ({ vmOverride }: Props) => {
  const { isDark, toggleTheme } = useTheme();
  const localVm = useCalculatorViewModel();
  const vm = vmOverride ?? localVm;
  const [showSaveModal, setShowSaveModal] = useState(false);

  const bg = isDark ? "bg-slate-900" : "bg-slate-50";
  const text = isDark ? "text-white" : "text-slate-900";
  const sub = isDark ? "text-slate-400" : "text-slate-500";

  const TenureToggle = ({ unit }: { unit: TenureUnit }) => (
    <TouchableOpacity
      onPress={() => vm.setTenureUnit(unit)}
      className={`flex-1 py-3 rounded-xl ${
        vm.tenureUnit === unit
          ? "bg-sky-500"
          : isDark
          ? "bg-slate-800"
          : "bg-white border border-slate-200"
      }`}
    >
      <Text
        className={`text-center font-semibold capitalize ${
          vm.tenureUnit === unit ? "text-white" : sub
        }`}
      >
        {unit}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className={`flex-1 ${bg}`}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingTop: 60 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-start mb-8">
          <View>
            <Text className={`text-3xl font-black ${text}`}>LoanCalc</Text>
            <Text className={`text-sm mt-0.5 ${sub}`}>EMI & Amortization Planner</Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          >
            <Text className="text-lg">{isDark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>

        <ThemedInput
          label="Loan Amount (KES)"
          value={vm.loanAmount}
          onChangeText={vm.setLoanAmount}
          placeholder="e.g. 500000"
          error={!!vm.validationError}
        />

        <ThemedInput
          label="Annual Interest Rate"
          value={vm.annualInterestRate}
          onChangeText={vm.setAnnualInterestRate}
          placeholder="e.g. 15.57"
          suffix="%"
          error={!!vm.validationError}
        />

        <View className="mb-4">
          <Text className={`text-xs font-semibold uppercase tracking-widest mb-1.5 ${sub}`}>
            Loan Tenure
          </Text>
          <View className="flex-row gap-3 mb-2">
            <TenureToggle unit="years" />
            <TenureToggle unit="months" />
          </View>
          <ThemedInput
            label=""
            value={vm.tenure}
            onChangeText={vm.setTenure}
            placeholder={vm.tenureUnit === "years" ? "e.g. 5" : "e.g. 60"}
            suffix={vm.tenureUnit === "years" ? "yrs" : "mo"}
            error={!!vm.validationError}
          />
        </View>

        {vm.validationError ? (
          <View className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 mb-4">
            <Text className="text-red-400 text-sm">{vm.validationError}</Text>
          </View>
        ) : null}

        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity
            onPress={vm.calculate}
            className="flex-1 bg-sky-500 py-4 rounded-2xl"
          >
            <Text className="text-white text-center font-bold text-base">
              Calculate EMI
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={vm.reset}
            className={`px-5 py-4 rounded-2xl ${
              isDark ? "bg-slate-800" : "bg-slate-200"
            }`}
          >
            <Text className={`font-semibold ${sub}`}>Reset</Text>
          </TouchableOpacity>
        </View>

        {vm.result ? (
          <>
            <SummaryCard result={vm.result} />

            <TouchableOpacity
              onPress={() => setShowSaveModal(true)}
              className={`flex-row items-center justify-center py-3 rounded-2xl mb-5 border ${
                isDark ? "border-sky-500/40 bg-sky-500/10" : "border-sky-400/30 bg-sky-50"
              }`}
            >
              <Text className="text-sky-500 font-semibold">💾  Save this calculation</Text>
            </TouchableOpacity>

            {vm.saveSuccess && (
              <View className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl px-4 py-3 mb-4">
                <Text className="text-emerald-400 text-sm text-center">
                  ✓ Loan calculation saved!
                </Text>
              </View>
            )}

            <AmortizationTable schedule={vm.result.amortizationSchedule} />
          </>
        ) : null}

        <View className="h-16" />
      </ScrollView>

      <SaveModal
        visible={showSaveModal}
        onSave={(label) => {
          vm.saveCurrentLoan(label);
          setShowSaveModal(false);
        }}
        onClose={() => setShowSaveModal(false)}
      />
    </KeyboardAvoidingView>
  );
};
