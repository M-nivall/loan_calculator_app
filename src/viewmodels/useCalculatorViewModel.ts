import { useState, useCallback } from "react";
import { LoanInput, LoanResult, TenureUnit } from "../models/LoanModels";
import { calculateLoan, validateLoanInput } from "../utils/loanCalculations";
import { saveLoan } from "../storage/loanStorage";

const generateId = (): string =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const useCalculatorViewModel = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const calculate = useCallback(() => {
    const error = validateLoanInput(loanAmount, annualInterestRate, tenure);
    if (error) {
      setValidationError(error);
      setResult(null);
      return;
    }
    setValidationError(null);

    const input: LoanInput = {
      loanAmount: parseFloat(loanAmount),
      annualInterestRate: parseFloat(annualInterestRate),
      tenure: parseInt(tenure, 10),
      tenureUnit,
    };

    const loanResult = calculateLoan(input);
    setResult(loanResult);
  }, [loanAmount, annualInterestRate, tenure, tenureUnit]);

  const saveCurrentLoan = useCallback(
    async (label: string) => {
      if (!result) return;
      const input: LoanInput = {
        loanAmount: parseFloat(loanAmount),
        annualInterestRate: parseFloat(annualInterestRate),
        tenure: parseInt(tenure, 10),
        tenureUnit,
      };
      await saveLoan({
        id: generateId(),
        label,
        savedAt: new Date().toISOString(),
        input,
        result,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    },
    [result, loanAmount, annualInterestRate, tenure, tenureUnit]
  );

  const loadSavedLoan = useCallback(
    (input: LoanInput, loanResult: LoanResult) => {
      setLoanAmount(String(input.loanAmount));
      setAnnualInterestRate(String(input.annualInterestRate));
      setTenure(String(input.tenure));
      setTenureUnit(input.tenureUnit);
      setResult(loanResult);
      setValidationError(null);
    },
    []
  );

  const reset = useCallback(() => {
    setLoanAmount("");
    setAnnualInterestRate("");
    setTenure("");
    setTenureUnit("years");
    setResult(null);
    setValidationError(null);
  }, []);

  return {
    loanAmount,
    setLoanAmount,
    annualInterestRate,
    setAnnualInterestRate,
    tenure,
    setTenure,
    tenureUnit,
    setTenureUnit,
    result,
    validationError,
    saveSuccess,
    calculate,
    saveCurrentLoan,
    loadSavedLoan,
    reset,
  };
};
