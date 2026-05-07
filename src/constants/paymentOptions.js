import { IMAGES } from "./images";

export const UPI_APPS = [
  { id: "phonepe", label: "PhonePe", image: IMAGES.PHONEPAY },
  { id: "gpay", label: "Google Pay", image: IMAGES.GOOGLEPAY },
  { id: "amazonpay", label: "Amazon Pay", image: IMAGES.AMAZONPAY },
  { id: "paytmupi", label: "Paytm UPI", image: IMAGES.PAYTM },
];

export const BANKS = [
  { id: "sbi", label: "SBI", name: "State Bank of India", image: IMAGES.SBI },
  { id: "canara", label: "Canara", name: "Canara Bank", image: IMAGES.CANARA },
  { id: "icici", label: "ICICI", name: "ICICI Bank", image: IMAGES.ICICI },
  { id: "hdfc", label: "HDFC", name: "HDFC Bank", image: IMAGES.HDFC },
];

export const WALLETS = [
  { id: "w_phonepe", label: "PhonePe Wallet", image: IMAGES.PHONEPAY },
  { id: "w_paytm", label: "Paytm Wallet", image: IMAGES.PAYTM },
  { id: "w_mobikwik", label: "Mobikwik", image: IMAGES.MOBIKWIK },
  { id: "w_amazon", label: "Amazon Pay Balance", image: IMAGES.AMAZONPAY },
];

export const formatINR = (amount = 0) =>
  `Rs ${Number(amount || 0).toLocaleString("en-IN")}`;

export const getCardType = (number = "") => {
  const clean = number.replace(/\D/g, "");
  if (/^4/.test(clean)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(clean)) return "mastercard";
  if (/^(60|65|81|82|508|353|356)/.test(clean)) return "rupay";
  return "generic";
};

export const formatCardNumber = (value = "") =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const formatExpiry = (value = "") => {
  const clean = value.replace(/\D/g, "").slice(0, 4);
  if (clean.length <= 2) return clean;
  return `${clean.slice(0, 2)}/${clean.slice(2)}`;
};
