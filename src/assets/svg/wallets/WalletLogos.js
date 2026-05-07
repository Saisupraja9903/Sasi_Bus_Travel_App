import React from "react";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, Text as SvgText } from "react-native-svg";
import { AmazonPayLogo, PaytmLogo, PhonePeLogo } from "../upi/UpiLogos";

const GlowCircle = ({ width, height, active, colors = ["#1A73E8", "#22D3EE"], children }) => (
  <Svg width={width} height={height} viewBox="0 0 72 72" fill="none">
    <Defs>
      <LinearGradient id="walletShell" x1="8" y1="7" x2="64" y2="66">
        <Stop offset="0" stopColor={colors[0]} />
        <Stop offset="1" stopColor={colors[1]} />
      </LinearGradient>
    </Defs>
    <Circle cx="36" cy="36" r={active ? "32" : "29"} fill="url(#walletShell)" opacity={active ? "1" : "0.9"} />
    <Circle cx="36" cy="36" r="24" fill="#FFFFFF" opacity="0.96" />
    {children}
  </Svg>
);

export const PhonePeWalletLogo = (props) => <PhonePeLogo {...props} />;
export const PaytmWalletLogo = (props) => <PaytmLogo {...props} />;
export const AmazonPayBalanceLogo = (props) => <AmazonPayLogo {...props} />;

export const MobikwikLogo = ({ width = 56, height = 56, active = false }) => (
  <GlowCircle width={width} height={height} active={active} colors={["#0066B3", "#00AEEF"]}>
    <Path d="M21 29H51L45 48H15L21 29Z" fill="#F97316" />
    <Path d="M26 24L40 17L51 29H21L26 24Z" fill="#0EA5E9" />
    <SvgText x="22" y="43" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="Arial">Mobi</SvgText>
  </GlowCircle>
);
