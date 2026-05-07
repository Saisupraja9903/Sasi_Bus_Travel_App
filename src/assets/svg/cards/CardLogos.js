import React from "react";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, Text as SvgText } from "react-native-svg";

export const VisaLogo = ({ width = 58, height = 24, color = "#1434CB" }) => (
  <Svg width={width} height={height} viewBox="0 0 116 48" fill="none">
    <SvgText x="4" y="34" fill={color} fontSize="30" fontWeight="900" fontFamily="Arial">VISA</SvgText>
    <Path d="M82 13H108" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.35" />
  </Svg>
);

export const MastercardLogo = ({ width = 54, height = 34 }) => (
  <Svg width={width} height={height} viewBox="0 0 92 58" fill="none">
    <Circle cx="35" cy="29" r="23" fill="#EB001B" />
    <Circle cx="57" cy="29" r="23" fill="#F79E1B" opacity="0.95" />
    <Path d="M46 12C51.3 16.2 54.7 22.2 54.7 29C54.7 35.8 51.3 41.8 46 46C40.7 41.8 37.3 35.8 37.3 29C37.3 22.2 40.7 16.2 46 12Z" fill="#FF5F00" />
  </Svg>
);

export const RupayLogo = ({ width = 62, height = 28 }) => (
  <Svg width={width} height={height} viewBox="0 0 124 56" fill="none">
    <SvgText x="3" y="36" fill="#1F2937" fontSize="27" fontWeight="900" fontFamily="Arial">RuPay</SvgText>
    <Path d="M95 12L116 28L95 44L102 28L95 12Z" fill="#F97316" />
    <Path d="M88 12L105 28L88 44L94 28L88 12Z" fill="#16A34A" />
  </Svg>
);

export const CardChip = ({ width = 48, height = 38 }) => (
  <Svg width={width} height={height} viewBox="0 0 96 76" fill="none">
    <Defs>
      <LinearGradient id="chipGrad" x1="14" y1="8" x2="82" y2="70">
        <Stop offset="0" stopColor="#FDE68A" />
        <Stop offset="0.5" stopColor="#D97706" />
        <Stop offset="1" stopColor="#FEF3C7" />
      </LinearGradient>
    </Defs>
    <Rect x="12" y="10" width="72" height="56" rx="12" fill="url(#chipGrad)" />
    <Path d="M12 30H35M12 46H35M61 30H84M61 46H84M36 10V66M60 10V66" stroke="#92400E" strokeWidth="3" opacity="0.55" />
    <Rect x="35" y="25" width="26" height="26" rx="6" stroke="#92400E" strokeWidth="3" opacity="0.7" />
  </Svg>
);

export const ContactlessIcon = ({ width = 28, height = 28, color = "#FFFFFF" }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <Path d="M9 9C12.8 12.8 12.8 19.2 9 23" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    <Path d="M14 6C19.5 11.5 19.5 20.5 14 26" stroke={color} strokeWidth="2.6" strokeLinecap="round" opacity="0.78" />
    <Path d="M19 3C26.2 10.2 26.2 21.8 19 29" stroke={color} strokeWidth="2.6" strokeLinecap="round" opacity="0.52" />
  </Svg>
);
