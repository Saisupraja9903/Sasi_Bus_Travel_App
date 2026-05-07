import React from "react";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

export const BackIcon = ({ width = 24, height = 24, color = "#FFFFFF" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M15 5L8 12L15 19" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SearchIcon = ({ width = 24, height = 24, color = "#0F172A" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="10.8" cy="10.8" r="6.8" stroke={color} strokeWidth="2.2" />
    <Path d="M16 16L21 21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

export const CheckIcon = ({ width = 22, height = 22, color = "#FFFFFF" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12.5L9.4 17L19 7" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const LockIcon = ({ width = 36, height = 36, active = false, color = "#1A73E8" }) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
    <Defs>
      <LinearGradient id="lockGrad" x1="12" y1="8" x2="54" y2="58">
        <Stop offset="0" stopColor={active ? "#34D399" : color} />
        <Stop offset="1" stopColor={active ? "#0F766E" : "#6EA8FF"} />
      </LinearGradient>
    </Defs>
    <Rect x="13" y="27" width="38" height="28" rx="10" fill="url(#lockGrad)" />
    <Path d="M22 27V22C22 13.7 26.8 9 32 9C37.2 9 42 13.7 42 22V27" stroke={active ? "#BFF8E7" : "#D7E8FF"} strokeWidth="4" strokeLinecap="round" />
    <Circle cx="32" cy="40" r="4" fill="#FFFFFF" />
    <Path d="M32 43V48" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

export const ShieldIcon = ({ width = 40, height = 40, active = false, color = "#1A73E8" }) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
    <Defs>
      <LinearGradient id="shieldGrad" x1="10" y1="6" x2="55" y2="58">
        <Stop offset="0" stopColor={active ? "#22C55E" : color} />
        <Stop offset="1" stopColor={active ? "#0284C7" : "#7C3AED"} />
      </LinearGradient>
    </Defs>
    <Path d="M32 6L52 14V29C52 42.6 43.9 53 32 58C20.1 53 12 42.6 12 29V14L32 6Z" fill="url(#shieldGrad)" />
    <Path d="M23 31L29 37L42 23" stroke="#FFFFFF" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SecurePaymentIcon = ({ width = 54, height = 54, active = false }) => (
  <Svg width={width} height={height} viewBox="0 0 72 72" fill="none">
    <Defs>
      <LinearGradient id="securePayGrad" x1="8" y1="8" x2="64" y2="64">
        <Stop offset="0" stopColor={active ? "#2DD4BF" : "#60A5FA"} />
        <Stop offset="1" stopColor={active ? "#2563EB" : "#1D4ED8"} />
      </LinearGradient>
    </Defs>
    <Rect x="8" y="14" width="56" height="42" rx="14" fill="url(#securePayGrad)" />
    <Rect x="15" y="25" width="23" height="5" rx="2.5" fill="#FFFFFF" opacity="0.82" />
    <Rect x="15" y="37" width="18" height="4" rx="2" fill="#FFFFFF" opacity="0.5" />
    <G transform="translate(41 30)">
      <Path d="M10 0L20 4V11C20 18 15.9 23.1 10 26C4.1 23.1 0 18 0 11V4L10 0Z" fill="#FFFFFF" opacity="0.95" />
      <Path d="M6 12L9 15L15 8" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  </Svg>
);

export const CreditCardIcon = ({ width = 44, height = 44, active = false }) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
    <Defs>
      <LinearGradient id="cardIconGrad" x1="8" y1="12" x2="58" y2="54">
        <Stop offset="0" stopColor={active ? "#111827" : "#2563EB"} />
        <Stop offset="1" stopColor={active ? "#475569" : "#06B6D4"} />
      </LinearGradient>
    </Defs>
    <Rect x="8" y="14" width="48" height="36" rx="10" fill="url(#cardIconGrad)" />
    <Rect x="8" y="23" width="48" height="6" fill="#FFFFFF" opacity="0.32" />
    <Rect x="16" y="37" width="15" height="4" rx="2" fill="#FFFFFF" opacity="0.9" />
    <Rect x="36" y="37" width="10" height="4" rx="2" fill="#FFFFFF" opacity="0.55" />
  </Svg>
);

export const UpiIcon = ({ width = 44, height = 44, active = false }) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
    <Path d="M15 10L34 32L15 54L25 32L15 10Z" fill={active ? "#22C55E" : "#1A73E8"} />
    <Path d="M31 10L50 32L31 54L41 32L31 10Z" fill={active ? "#F97316" : "#60A5FA"} />
  </Svg>
);

export const NetBankingIcon = ({ width = 44, height = 44, active = false }) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
    <Path d="M32 8L56 22H8L32 8Z" fill={active ? "#111827" : "#1A73E8"} />
    <Rect x="12" y="26" width="8" height="22" rx="2" fill={active ? "#334155" : "#93C5FD"} />
    <Rect x="28" y="26" width="8" height="22" rx="2" fill={active ? "#334155" : "#93C5FD"} />
    <Rect x="44" y="26" width="8" height="22" rx="2" fill={active ? "#334155" : "#93C5FD"} />
    <Rect x="8" y="50" width="48" height="6" rx="3" fill={active ? "#111827" : "#2563EB"} />
  </Svg>
);

export const WalletIcon = ({ width = 44, height = 44, active = false }) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
    <Defs>
      <LinearGradient id="walletGrad" x1="8" y1="13" x2="57" y2="53">
        <Stop offset="0" stopColor={active ? "#A855F7" : "#1A73E8"} />
        <Stop offset="1" stopColor={active ? "#EC4899" : "#22D3EE"} />
      </LinearGradient>
    </Defs>
    <Path d="M13 20H48C52.4 20 56 23.6 56 28V46C56 50.4 52.4 54 48 54H16C11.6 54 8 50.4 8 46V25C8 22.2 10.2 20 13 20Z" fill="url(#walletGrad)" />
    <Path d="M16 20L42 10C45.1 8.8 48 11.1 48 14.4V20H16Z" fill="#FFFFFF" opacity="0.35" />
    <Rect x="39" y="32" width="17" height="13" rx="6.5" fill="#FFFFFF" opacity="0.9" />
    <Circle cx="45" cy="38.5" r="2.5" fill={active ? "#A855F7" : "#1A73E8"} />
  </Svg>
);
