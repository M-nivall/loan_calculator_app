import { LoanInput, LoanResult, AmortizationRow } from "../models/LoanModels";

const roundTwo = (value: number): number => Math.round(value * 100) / 100;

const getTotalMonths = (tenure: number, unit: "years" | "months"): number =>
  unit === "years" ? tenure * 12 : tenure;

const calculateEMI = (
  principal: number,
  monthlyRate: number,
  totalMonths: number
): number => {
  if (monthlyRate === 0) {
    return roundTwo(principal / totalMonths);
  }
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
  const denominator = Math.pow(1 + monthlyRate, totalMonths) - 1;
  return roundTwo(numerator / denominator);
};

const buildAmortizationSchedule = (
  principal: number,
  monthlyRate: number,
  totalMonths: number,
  emi: number
): AmortizationRow[] => {
  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let period = 1; period <= totalMonths; period++) {
    const interestComponent = roundTwo(balance * monthlyRate);
    let principalComponent = roundTwo(emi - interestComponent);

    if (period === totalMonths) {
      principalComponent = roundTwo(balance);
    }

    const remainingBalance = roundTwo(Math.max(0, balance - principalComponent));

    schedule.push({
      paymentNumber: period,
      emi: period === totalMonths ? roundTwo(principalComponent + interestComponent) : emi,
      interestComponent,
      principalComponent,
      remainingBalance,
    });

    balance = remainingBalance;
  }

  return schedule;
};

export const calculateLoan = (input: LoanInput): LoanResult => {
  const { loanAmount, annualInterestRate, tenure, tenureUnit } = input;
  const totalMonths = getTotalMonths(tenure, tenureUnit);
  const monthlyRate = annualInterestRate / 100 / 12;

  const monthlyEMI = calculateEMI(loanAmount, monthlyRate, totalMonths);
  const amortizationSchedule = buildAmortizationSchedule(
    loanAmount,
    monthlyRate,
    totalMonths,
    monthlyEMI
  );

  const totalAmountPayable = roundTwo(
    amortizationSchedule.reduce((sum, row) => sum + row.emi, 0)
  );
  const totalInterestPayable = roundTwo(totalAmountPayable - loanAmount);

  return {
    monthlyEMI,
    totalInterestPayable,
    totalAmountPayable,
    amortizationSchedule,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const validateLoanInput = (
  loanAmount: string,
  annualInterestRate: string,
  tenure: string
): string | null => {
  const amount = parseFloat(loanAmount);
  const rate = parseFloat(annualInterestRate);
  const tenureVal = parseFloat(tenure);

  if (!loanAmount.trim() || isNaN(amount) || amount <= 0) {
    return "Loan amount must be a positive number.";
  }
  if (!annualInterestRate.trim() || isNaN(rate) || rate < 0 || rate > 100) {
    return "Interest rate must be between 0 and 100.";
  }
  if (!tenure.trim() || isNaN(tenureVal) || tenureVal <= 0 || !Number.isInteger(tenureVal)) {
    return "Tenure must be a positive whole number.";
  }
  return null;
};
