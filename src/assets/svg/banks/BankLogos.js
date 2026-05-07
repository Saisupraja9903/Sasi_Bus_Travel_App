import React from "react";
import Svg, { Circle, Defs, G, LinearGradient, Path, Polygon, Rect, Stop, Text as SvgText } from "react-native-svg";

const BankShell = ({ width = 58, height = 58, active, bg = "#FFFFFF", stroke = "#CBD5E1", children }) => (
  <Svg width={width} height={height} viewBox="0 0 72 72" fill="none">
    <Rect x="5" y="5" width="62" height="62" rx="18" fill={bg} />
    <Rect x="6" y="6" width="60" height="60" rx="17" stroke={active ? "#1A73E8" : stroke} strokeWidth={active ? "2.4" : "1.4"} />
    {children}
  </Svg>
);

export const SbiLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#F1F7FF">
    <Circle cx="36" cy="31" r="18" fill="#00A2E0" />
    <Circle cx="36" cy="31" r="6" fill="#F1F7FF" />
    <Path d="M36 37V55" stroke="#00A2E0" strokeWidth="7" strokeLinecap="round" />
  </BankShell>
);

export const IciciLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#FFF7ED">
    <Circle cx="36" cy="36" r="21" fill="#B91C1C" />
    <Circle cx="36" cy="36" r="15" fill="#F97316" />
    <Path d="M25 42C35 22 47 24 50 29C42 27 35 33 31 47" fill="#FFFFFF" opacity="0.9" />
  </BankShell>
);

export const HdfcLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#EFF6FF">
    <Rect x="18" y="18" width="36" height="36" fill="#ED1C24" />
    <Rect x="24" y="24" width="24" height="24" fill="#FFFFFF" />
    <Rect x="29" y="29" width="14" height="14" fill="#004B93" />
  </BankShell>
);

export const AxisLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#FFF1F2">
    <Path d="M18 54L36 16L54 54H44L36 35L28 54H18Z" fill="#A50034" />
    <Path d="M36 16L43 54H35L32 36L36 16Z" fill="#7A0026" opacity="0.75" />
  </BankShell>
);

export const KotakLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#F8FAFC">
    <Circle cx="36" cy="36" r="21" fill="#003A8C" />
    <Circle cx="36" cy="36" r="13" fill="#FFFFFF" />
    <Circle cx="36" cy="36" r="8" fill="#E31E24" />
  </BankShell>
);

export const CanaraLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#EFF6FF">
    <Path d="M18 23H48C39 28 34 34 31 49H18V23Z" fill="#0B5CAB" />
    <Path d="M28 23H54C45 29 40 36 37 49H28C31 38 36 30 45 23H28Z" fill="#FACC15" />
  </BankShell>
);

export const PnbLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#FEF2F2">
    <Rect x="17" y="17" width="38" height="38" rx="4" fill="#A20E20" />
    <Path d="M25 45C30 28 42 24 49 30C41 31 35 37 32 47" stroke="#F5C542" strokeWidth="5" strokeLinecap="round" />
  </BankShell>
);

export const IndianBankLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#FFF7ED">
    <Circle cx="36" cy="36" r="22" fill="#F58220" />
    <Path d="M25 24H47V30H39V48H33V30H25V24Z" fill="#1E3A8A" />
  </BankShell>
);

export const UnionBankLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#FEF2F2">
    <Path d="M18 20H37C47 20 54 27 54 37C54 47 47 54 37 54H18V20Z" fill="#D71920" />
    <Path d="M26 28H38C43 28 46 31.5 46 36C46 41 42.8 45 37 45H26V28Z" fill="#FFFFFF" />
  </BankShell>
);

export const BobLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#FFF7ED">
    <Circle cx="36" cy="36" r="23" fill="#F97316" />
    <Path d="M22 39C31 23 45 22 52 31C43 29 35 35 31 48C28 45 25 42 22 39Z" fill="#FFFFFF" />
  </BankShell>
);

export const YesBankLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#EFF6FF">
    <SvgText x="12" y="41" fill="#004C97" fontSize="19" fontWeight="900" fontFamily="Arial">YES</SvgText>
    <Path d="M50 17L57 25L47 35L40 27L50 17Z" fill="#E31B23" />
  </BankShell>
);

export const IndusIndLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#FEFCE8">
    <Circle cx="36" cy="34" r="20" fill="#8A1538" />
    <Path d="M20 35H52M25 25H47M25 45H47" stroke="#F8D34A" strokeWidth="4" strokeLinecap="round" />
  </BankShell>
);

export const FederalLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#EFF6FF">
    <Defs><LinearGradient id="fed" x1="18" y1="18" x2="54" y2="54"><Stop offset="0" stopColor="#0067B1" /><Stop offset="1" stopColor="#00A651" /></LinearGradient></Defs>
    <Path d="M18 54V18H54V27H30V34H50V43H30V54H18Z" fill="url(#fed)" />
  </BankShell>
);

export const IdfcLogo = ({ width, height, active }) => (
  <BankShell width={width} height={height} active={active} bg="#FFF1F2">
    <Polygon points="36,14 56,36 36,58 16,36" fill="#9D1D26" />
    <Polygon points="36,24 46,36 36,48 26,36" fill="#FFFFFF" />
  </BankShell>
);

export const BANK_LOGOS = {
  sbi: SbiLogo,
  icici: IciciLogo,
  hdfc: HdfcLogo,
  axis: AxisLogo,
  kotak: KotakLogo,
  canara: CanaraLogo,
  pnb: PnbLogo,
  indian: IndianBankLogo,
  union: UnionBankLogo,
  bob: BobLogo,
  yes: YesBankLogo,
  indusind: IndusIndLogo,
  federal: FederalLogo,
  idfc: IdfcLogo,
};
