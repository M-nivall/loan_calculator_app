export type TenureUnit = "years" | "months";

export interface LoanInput {
  loanAmount: number;
  annualInterestRate: number;
  tenure: number;
  tenureUnit: TenureUnit;
}

export interface AmortizationRow {
  paymentNumber: number;
  emi: number;
  interestComponent: number;
  principalComponent: number;
  remainingBalance: number;
}

export interface LoanResult {
  monthlyEMI: number;
  totalInterestPayable: number;
  totalAmountPayable: number;
  amortizationSchedule: AmortizationRow[];
}

export interface SavedLoan {
  id: string;
  label: string;
  savedAt: string;
  input: LoanInput;
  result: LoanResult;
}
