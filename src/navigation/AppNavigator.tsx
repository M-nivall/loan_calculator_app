import React, { useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { CalculatorScreen } from "../screens/CalculatorScreen";
import { SavedLoansScreen } from "../screens/SavedLoansScreen";
import { LoanOptionsScreen } from "../screens/LoanOptionsScreen";
import { useTheme } from "../utils/ThemeContext";
import { SavedLoan } from "../models/LoanModels";
import { useCalculatorViewModel } from "../viewmodels/useCalculatorViewModel";

const Tab = createBottomTabNavigator();

const TabIcon = ({
  emoji,
  label,
  focused,
  isDark,
}: {
  emoji: string;
  label: string;
  focused: boolean;
  isDark: boolean;
}) => (
  <View className="items-center pt-1">
    <Text className={`text-xl ${focused ? "opacity-100" : "opacity-40"}`}>{emoji}</Text>
    <Text
      className={`text-xs mt-0.5 font-semibold ${
        focused ? "text-sky-500" : isDark ? "text-slate-500" : "text-slate-400"
      }`}
    >
      {label}
    </Text>
  </View>
);

export const AppNavigator = () => {
  const { isDark } = useTheme();
  const vmRef = useRef(useCalculatorViewModel());
  const vm = vmRef.current;

  const tabBarBg = isDark ? "#0f172a" : "#ffffff";
  const tabBarBorder = isDark ? "#1e293b" : "#f1f5f9";

  const handleOpenSaved = (loan: SavedLoan) => {
    vm.loadSavedLoan(loan.input, loan.result);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopColor: tabBarBorder,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
          },
        }}
      >
        <Tab.Screen
          name="Calculator"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🧮" label="Calculate" focused={focused} isDark={isDark} />
            ),
          }}
        >
          {() => <CalculatorScreen vmOverride={vm} />}
        </Tab.Screen>

        <Tab.Screen
          name="Saved"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="💾" label="Saved" focused={focused} isDark={isDark} />
            ),
          }}
        >
          {() => <SavedLoansScreen onOpen={handleOpenSaved} />}
        </Tab.Screen>

        <Tab.Screen
          name="Options"
          component={LoanOptionsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="📊" label="Options" focused={focused} isDark={isDark} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
