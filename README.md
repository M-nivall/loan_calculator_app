# LoanCalc — EMI & Amortization Planner

A React Native (Expo) mobile app for calculating loan repayments and viewing detailed amortization schedules. Built with NativeWind for styling and follows MVVM architecture.

---

## How to Run the App

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode + iOS Simulator (macOS only)
- For Android: Android Studio + AVD Emulator **or** the Expo Go app on a physical device

### Steps

```bash
# 1. Clone / unzip the project
cd LoanCalcApp

# 2. Install dependencies
npm install

# 3. Start the Expo dev server
npm start

# 4. Run on a platform
npm run ios        # iOS Simulator (macOS)
npm run android    # Android Emulator
npm run web        # Browser (limited native feel)
```

Scan the QR code in the terminal with the **Expo Go** app (iOS / Android) to run on a physical device instantly.

---

## Architecture Overview

The app follows **MVVM (Model–View–ViewModel)** with a clean separation of concerns:

```
src/
├── models/          # Pure TypeScript types (LoanInput, LoanResult, SavedLoan)
├── utils/           # EMI calculation logic, currency formatting, validation, ThemeContext
├── viewmodels/      # Custom hooks (useCalculatorViewModel, useSavedLoansViewModel)
│                    # — own all state and business logic
├── storage/         # AsyncStorage persistence layer (CRUD for saved loans)
├── components/      # Reusable, theme-aware UI components (ThemedInput, SummaryCard, etc.)
├── screens/         # Full-page views (CalculatorScreen, SavedLoansScreen, LoanOptionsScreen)
└── navigation/      # Bottom-tab navigator (AppNavigator)
```

### Layer responsibilities

| Layer | Responsibility |
|---|---|
| **Model** | Defines data shapes; zero logic |
| **Utils / loanCalculations** | Pure functions: EMI formula, amortization builder, validation |
| **ViewModel** | React hooks that own form state, trigger calculations, call storage |
| **Storage** | AsyncStorage wrapper; isolated from business logic |
| **Components** | Stateless / lightly stateful presentational pieces |
| **Screens** | Wire ViewModels to Components; own navigation-level state only |

---

## EMI Formula

Standard reducing-balance EMI formula:

```
EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
```

Where:
- **P** = Principal loan amount
- **r** = Monthly interest rate (annual rate ÷ 12 ÷ 100)
- **n** = Total number of monthly payments

**Edge case — 0% interest:** EMI = P / n (simple equal division).

All monetary values are rounded to 2 decimal places. The final payment is adjusted to clear any rounding residual so the schedule always closes to zero.

---

## Assumptions Made

1. **Currency is KES (Kenyan Shillings).** The formatter uses `en-KE` locale. Swap `currency: "KES"` in `loanCalculations.ts` to adapt to other markets.
2. **Annual interest rate input.** The user enters the nominal annual rate (e.g. 15.57). The app divides by 12 for monthly compounding.
3. **Tenure is whole months or years only.** Fractional tenure (e.g. 2.5 years) is not supported.
4. **No prepayment or balloon payment modelling.** The schedule assumes constant EMI throughout.
5. **No account for fees or insurance.** Only principal + interest are considered.
6. **Persistence is device-local.** Saved loans are stored in AsyncStorage; they do not sync across devices.
7. **Shared ViewModel across tabs.** Opening a saved loan from the Saved tab auto-populates the Calculator tab using a shared ViewModel ref passed through the navigator. This avoids prop-drilling through navigation params.

---

## Trade-offs & Limitations

| Area | Decision | Trade-off |
|---|---|---|
| **State sharing** | Single ViewModel ref held in the navigator via `useRef` | Simple but couples navigator to ViewModel; a global state library (Zustand/Redux) would scale better |
| **Persistence** | AsyncStorage (key-value JSON) | Easy to set up; not suitable for complex querying — SQLite would be better at 1000+ saved entries |
| **Amortization pagination** | Client-side, 12 rows/page | Avoids large FlatList renders; a virtualized single list would give smoother scrolling |
| **NativeWind v2** | Used for Tailwind-style classes | v4 has improved tree-shaking; v2 is stable and widely adopted for Expo 51 |
| **No tests** | Out of scope for this deliverable | The pure functions in `loanCalculations.ts` are well-isolated and straightforward to unit-test with Jest |
| **Web support** | Expo web works but tab bar UX is desktop-awkward | App is designed for mobile-first; web is a convenience preview only |
| **Dark mode toggle** | Manual button in the header | Could be driven purely by `useColorScheme` system setting; manual toggle gives the user explicit control |

---

## Key Files at a Glance

| File | Purpose |
|---|---|
| `src/utils/loanCalculations.ts` | EMI formula, amortization builder, validation, currency formatter |
| `src/viewmodels/useCalculatorViewModel.ts` | All calculator state + save logic |
| `src/storage/loanStorage.ts` | AsyncStorage get / save / delete |
| `src/components/AmortizationTable.tsx` | Paginated schedule table |
| `src/navigation/AppNavigator.tsx` | Bottom tab navigator + shared ViewModel wiring |
