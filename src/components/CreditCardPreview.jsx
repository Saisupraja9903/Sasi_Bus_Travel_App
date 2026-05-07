import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from "react-native-svg";
import { CardChip, ContactlessIcon, MastercardLogo, RupayLogo, VisaLogo } from "../assets/svg/cards/CardLogos";
import { getCardType } from "../constants/paymentOptions";

const CardLogo = ({ type }) => {
  if (type === "visa") return <VisaLogo width={66} height={28} color="#FFFFFF" />;
  if (type === "mastercard") return <MastercardLogo width={58} height={36} />;
  if (type === "rupay") return <RupayLogo width={70} height={30} />;
  return (
    <Svg width={64} height={30} viewBox="0 0 128 60">
      <SvgText x="0" y="38" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="Arial">CARD</SvgText>
    </Svg>
  );
};

const Front = ({ number, holder, expiry, type }) => (
  <Svg width="100%" height="100%" viewBox="0 0 340 214" fill="none">
    <Defs>
      <LinearGradient id="cardBg" x1="0" y1="0" x2="340" y2="214">
        <Stop offset="0" stopColor="#111827" />
        <Stop offset="0.48" stopColor="#1A73E8" />
        <Stop offset="1" stopColor="#14B8A6" />
      </LinearGradient>
      <LinearGradient id="glass" x1="36" y1="20" x2="290" y2="190">
        <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.32" />
        <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.04" />
      </LinearGradient>
    </Defs>
    <Rect width="340" height="214" rx="26" fill="url(#cardBg)" />
    <Circle cx="306" cy="12" r="92" fill="#FFFFFF" opacity="0.14" />
    <Circle cx="40" cy="214" r="92" fill="#FFFFFF" opacity="0.08" />
    <Path d="M31 33C86 12 144 53 200 31C248 12 288 18 322 42V188H31V33Z" fill="url(#glass)" />
    <SvgText x="26" y="36" fill="#FFFFFF" opacity="0.78" fontSize="12" fontWeight="800" fontFamily="Arial">SASI BUS PAY</SvgText>
    <G transform="translate(252 24)"><CardLogo type={type} /></G>
    <G transform="translate(24 62)"><CardChip width={50} height={40} /></G>
    <G transform="translate(88 67)"><ContactlessIcon width={28} height={28} /></G>
    <SvgText x="25" y="124" fill="#FFFFFF" fontSize="22" fontWeight="700" letterSpacing="2" fontFamily="Arial">
      {number || "4242 4242 4242 4242"}
    </SvgText>
    <SvgText x="25" y="160" fill="#BFDBFE" fontSize="9" fontWeight="800" fontFamily="Arial">CARD HOLDER</SvgText>
    <SvgText x="25" y="182" fill="#FFFFFF" fontSize="15" fontWeight="800" fontFamily="Arial">
      {(holder || "YOUR NAME").toUpperCase()}
    </SvgText>
    <SvgText x="244" y="160" fill="#BFDBFE" fontSize="9" fontWeight="800" fontFamily="Arial">VALID THRU</SvgText>
    <SvgText x="244" y="182" fill="#FFFFFF" fontSize="15" fontWeight="800" fontFamily="Arial">{expiry || "MM/YY"}</SvgText>
  </Svg>
);

const Back = ({ cvv }) => (
  <Svg width="100%" height="100%" viewBox="0 0 340 214" fill="none">
    <Defs>
      <LinearGradient id="cardBack" x1="0" y1="0" x2="340" y2="214">
        <Stop offset="0" stopColor="#0F172A" />
        <Stop offset="1" stopColor="#334155" />
      </LinearGradient>
    </Defs>
    <Rect width="340" height="214" rx="26" fill="url(#cardBack)" />
    <Rect x="0" y="42" width="340" height="42" fill="#020617" opacity="0.86" />
    <Rect x="28" y="108" width="230" height="34" rx="7" fill="#E2E8F0" />
    <Rect x="258" y="108" width="54" height="34" rx="7" fill="#FFFFFF" />
    <SvgText x="273" y="131" fill="#0F172A" fontSize="15" fontWeight="900" fontFamily="Arial">{cvv || "***"}</SvgText>
    <SvgText x="28" y="168" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="Arial">Encrypted card verification</SvgText>
  </Svg>
);

export default function CreditCardPreview({ number, holder, expiry, cvv, focusedField }) {
  const rotate = useRef(new Animated.Value(0)).current;
  const type = getCardType(number);

  useEffect(() => {
    Animated.spring(rotate, {
      toValue: focusedField === "cvv" ? 1 : 0,
      friction: 8,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [focusedField, rotate]);

  const frontRotate = rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const backRotate = rotate.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });
  const frontOpacity = rotate.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const backOpacity = rotate.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.face, { opacity: frontOpacity, transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}>
        <Front number={number} holder={holder} expiry={expiry} type={type} />
      </Animated.View>
      <Animated.View style={[styles.face, styles.backFace, { opacity: backOpacity, transform: [{ perspective: 1000 }, { rotateY: backRotate }] }]}>
        <Back cvv={cvv} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 340 / 214,
    marginBottom: 22,
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  backFace: {
    transform: [{ rotateY: "180deg" }],
  },
});
