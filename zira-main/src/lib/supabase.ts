import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Kenyan tax calculations
export const calculatePAYE = (grossPay: number): number => {
  let tax = 0;
  
  if (grossPay <= 24000) {
    tax = grossPay * 0.1;
  } else if (grossPay <= 32333) {
    tax = 2400 + (grossPay - 24000) * 0.25;
  } else if (grossPay <= 500000) {
    tax = 2400 + 2083.25 + (grossPay - 32333) * 0.3;
  } else if (grossPay <= 800000) {
    tax = 2400 + 2083.25 + 140300.1 + (grossPay - 500000) * 0.325;
  } else {
    tax = 2400 + 2083.25 + 140300.1 + 97500 + (grossPay - 800000) * 0.35;
  }
  
  return Math.max(0, tax - 2400); // Personal relief
};

export const calculateNHIF = (grossPay: number): number => {
  if (grossPay <= 5999) return 150;
  if (grossPay <= 7999) return 300;
  if (grossPay <= 11999) return 400;
  if (grossPay <= 14999) return 500;
  if (grossPay <= 19999) return 600;
  if (grossPay <= 24999) return 750;
  if (grossPay <= 29999) return 850;
  if (grossPay <= 34999) return 900;
  if (grossPay <= 39999) return 950;
  if (grossPay <= 44999) return 1000;
  if (grossPay <= 49999) return 1100;
  if (grossPay <= 59999) return 1200;
  if (grossPay <= 69999) return 1300;
  if (grossPay <= 79999) return 1400;
  if (grossPay <= 89999) return 1500;
  if (grossPay <= 99999) return 1600;
  return 1700;
};

export const calculateNSSF = (grossPay: number): number => {
  const pensionablePay = Math.min(grossPay, 18000);
  return pensionablePay * 0.06;
};