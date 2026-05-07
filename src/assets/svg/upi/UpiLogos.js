import React from "react";
import { Animated } from "react-native";
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Shell = ({ width, height, active, children }) => (
  <AnimatedSvg width={width} height={height} viewBox="0 0 72 72" fill="none">
    <Defs>
      <LinearGradient id="upiShell" x1="8" y1="6" x2="64" y2="66">
        <Stop offset="0" stopColor={active ? "#FFFFFF" : "#F8FAFC"} />
        <Stop offset="1" stopColor={active ? "#EEF6FF" : "#E2E8F0"} />
      </LinearGradient>
    </Defs>
    <Rect x="5" y="5" width="62" height="62" rx="20" fill="url(#upiShell)" />
    <Rect x="6" y="6" width="60" height="60" rx="19" stroke={active ? "#1A73E8" : "#CBD5E1"} strokeWidth="2" />
    {children}
  </AnimatedSvg>
);

export const PhonePeLogo = ({ width = 56, height = 56, active = false }) => (
  <Shell width={width} height={height} active={active}>
    <Circle cx="36" cy="32" r="19" fill={active ? "#5F259F" : "#6D38B5"} />
    <SvgText x="27" y="41" fill="#FFFFFF" fontSize="25" fontWeight="900" fontFamily="Arial">पे</SvgText>
    <Path d="M24 54H48" stroke="#5F259F" strokeWidth="4" strokeLinecap="round" opacity={active ? "1" : "0.55"} />
  </Shell>
);

export const GooglePayLogo = ({ width = 56, height = 56, active = false }) => (
  <Shell width={width} height={height} active={active}>
    <Path d="M29 20C23 22 19 28 19 35C19 43.5 25.5 50 34 50C41.5 50 47.2 45.5 49 39H35V32H57C57.4 34.3 57.3 37.5 56.6 40C53.8 50.2 45.2 58 34 58C20.8 58 10 47.2 10 34C10 20.8 20.8 10 34 10C40.5 10 45.8 12.4 50 16.2L43.8 22.1C41.3 19.8 38 18.6 34 18.6C32.2 18.6 30.5 19.1 29 20Z" fill="#4285F4" />
    <Path d="M12.4 25.5L20.1 31.2C21.8 26.1 26.4 22.1 32 20.6L29 12.4C21.5 14 15.3 19.1 12.4 25.5Z" fill="#FBBC04" />
    <Path d="M34 58C40.5 58 46.3 55.8 50.7 52L43.4 46.3C40.9 48 37.8 49.1 34 49.1C28.5 49.1 23.8 45.6 21.8 40.8L13.9 46.4C17.8 53.3 25.2 58 34 58Z" fill="#34A853" />
    <Path d="M56.6 40C57.2 37.7 57.4 34.6 57 32H35V39H48.9C48 42.1 46 44.6 43.4 46.3L50.7 52C54.2 48.8 55.8 44.4 56.6 40Z" fill="#4285F4" />
    <Path d="M50 16.2C45.8 12.4 40.5 10 34 10C32.2 10 30.5 10.2 28.9 10.6L32 18.8C32.7 18.7 33.3 18.6 34 18.6C38 18.6 41.3 19.8 43.8 22.1L50 16.2Z" fill="#EA4335" />
  </Shell>
);

export const AmazonPayLogo = ({ width = 56, height = 56, active = false }) => (
  <Shell width={width} height={height} active={active}>
    <SvgText x="13" y="34" fill="#111827" fontSize="16" fontWeight="800" fontFamily="Arial">amazon</SvgText>
    <SvgText x="24" y="49" fill="#00A8E1" fontSize="15" fontWeight="900" fontFamily="Arial">pay</SvgText>
    <Path d="M18 39C29 48 43 47 54 39" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" />
    <Path d="M49 38L57 37L52 44" stroke="#FF9900" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Shell>
);

export const PaytmLogo = ({ width = 56, height = 56, active = false }) => (
  <Shell width={width} height={height} active={active}>
    <G transform="translate(12 25)">
      <SvgText x="0" y="16" fill="#002E6E" fontSize="17" fontWeight="900" fontFamily="Arial">Pay</SvgText>
      <SvgText x="31" y="16" fill="#00B9F1" fontSize="17" fontWeight="900" fontFamily="Arial">tm</SvgText>
    </G>
    <Rect x="16" y="45" width="40" height="5" rx="2.5" fill="#00B9F1" opacity={active ? "1" : "0.55"} />
  </Shell>
);

export const UpiMark = ({ width = 38, height = 22 }) => (
  <Svg width={width} height={height} viewBox="0 0 76 44" fill="none">
    <Path d="M4 4L26 22L4 40L13 22L4 4Z" fill="#138808" />
    <Path d="M28 4L50 22L28 40L37 22L28 4Z" fill="#F97316" />
    <SvgText x="50" y="29" fill="#111827" fontSize="15" fontWeight="900" fontFamily="Arial">UPI</SvgText>
  </Svg>
);
