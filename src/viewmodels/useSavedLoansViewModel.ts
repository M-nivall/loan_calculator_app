import { useState, useCallback } from "react";
import { SavedLoan } from "../models/LoanModels";
import { getSavedLoans, deleteLoan } from "../storage/loanStorage";

export const useSavedLoansViewModel = () => {
  const [savedLoans, setSavedLoans] = useState<SavedLoan[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLoans = useCallback(async () => {
    setLoading(true);
    const loans = await getSavedLoans();
    setSavedLoans(loans);
    setLoading(false);
  }, []);

  const removeLoand = useCallback(async (id: string) => {
    await deleteLoan(id);
    setSavedLoans((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { savedLoans, loading, loadLoans, removeLoand };
};
