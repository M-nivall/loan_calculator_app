import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedLoan } from "../models/LoanModels";

const STORAGE_KEY = "saved_loans";

export const getSavedLoans = async (): Promise<SavedLoan[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as SavedLoan[];
};

export const saveLoan = async (loan: SavedLoan): Promise<void> => {
  const existing = await getSavedLoans();
  const updated = [loan, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteLoan = async (id: string): Promise<void> => {
  const existing = await getSavedLoans();
  const updated = existing.filter((l) => l.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
