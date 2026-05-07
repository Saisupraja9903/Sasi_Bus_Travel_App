import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { COLORS } from "../constants/colors";
import { formatINR } from "../constants/paymentOptions";
import { CheckIcon, SecurePaymentIcon, ShieldIcon } from "../assets/svg/common/PaymentIcons";

const SuccessGraphic = ({ progress }) => {
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.78, 1] });
  const opacity = progress.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0, 1, 1] });

  return (
    <Animated.View style={[styles.graphic, { opacity, transform: [{ scale }] }]}>
      <Svg width={230} height={230} viewBox="0 0 230 230" fill="none">
        <Defs>
          <LinearGradient id="successRing" x1="34" y1="20" x2="196" y2="210">
            <Stop offset="0" stopColor="#34D399" />
            <Stop offset="1" stopColor="#1A73E8" />
          </LinearGradient>
        </Defs>
        <Circle cx="115" cy="115" r="80" fill="#ECFDF5" />
        <Circle cx="115" cy="115" r="72" stroke="url(#successRing)" strokeWidth="9" />
        <Circle cx="115" cy="115" r="49" fill="url(#successRing)" />
        <Path d="M90 115L107 132L142 96" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <G opacity="0.9">
          <Rect x="32" y="50" width="9" height="18" rx="4" fill="#F59E0B" transform="rotate(-25 32 50)" />
          <Rect x="184" y="43" width="8" height="18" rx="4" fill="#38BDF8" transform="rotate(25 184 43)" />
          <Circle cx="52" cy="172" r="6" fill="#A855F7" />
          <Circle cx="182" cy="171" r="5" fill="#22C55E" />
          <Path d="M57 88L68 79L72 93Z" fill="#EF4444" />
          <Path d="M164 88L176 78L180 94Z" fill="#F97316" />
        </G>
      </Svg>
    </Animated.View>
  );
};

export default function SuccessScreen({ navigation, route }) {
  const { amount = 0, method = "UPI" } = route.params || {};
  const progress = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(progress, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
    ]).start();
  }, [fade, progress]);

  const transactionId = useMemo(() => `TXN${Math.floor(100000000 + Math.random() * 900000000)}`, []);
  const dateTime = useMemo(() => new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }), []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <SuccessGraphic progress={progress} />

        <Animated.View style={[styles.copy, { opacity: fade }]}>
          <Text style={styles.successTitle}>Payment Successful</Text>
          <Text style={styles.successSub}>Your booking is confirmed and protected.</Text>

          <View style={styles.badge}>
            <SecurePaymentIcon width={38} height={38} active />
            <Text style={styles.badgeText}>Secure transaction verified</Text>
            <ShieldIcon width={34} height={34} active />
          </View>

          <View style={styles.detailsCard}>
            <DetailRow label="Amount Paid" value={formatINR(amount)} bold />
            <DetailRow label="Payment Method" value={method} />
            <DetailRow label="Transaction ID" value={transactionId} />
            <DetailRow label="Date & Time" value={dateTime} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.receiptBtn} activeOpacity={0.8}>
          <CheckIcon width={17} height={17} color={COLORS.primary} />
          <Text style={styles.receiptText}>Receipt Ready</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate("Home")} activeOpacity={0.82}>
          <Text style={styles.homeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const DetailRow = ({ label, value, bold }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, bold && styles.boldValue]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  graphic: { width: 230, height: 230, alignItems: "center", justifyContent: "center" },
  copy: { width: "100%", alignItems: "center" },
  successTitle: { fontSize: 25, fontWeight: "900", color: "#0F172A", marginTop: 4, marginBottom: 8 },
  successSub: { fontSize: 15, color: "#64748B", marginBottom: 22, textAlign: "center", fontWeight: "600" },
  badge: { width: "100%", borderRadius: 18, backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#BBF7D0", padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  badgeText: { flex: 1, color: "#166534", fontWeight: "800", fontSize: 13 },
  detailsCard: { width: "100%", backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18, gap: 15, borderWidth: 1, borderColor: "#E5EDF7", shadowColor: "#0F172A", shadowOpacity: 0.07, shadowRadius: 16, elevation: 3 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", gap: 14 },
  detailLabel: { color: "#64748B", fontSize: 13, fontWeight: "700" },
  detailValue: { color: "#0F172A", fontSize: 13, fontWeight: "800", flexShrink: 1, textAlign: "right" },
  boldValue: { fontSize: 18, color: COLORS.primary, fontWeight: "900" },
  footer: { padding: 20, gap: 12 },
  receiptBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.primary, gap: 8, backgroundColor: "#FFFFFF" },
  receiptText: { color: COLORS.primary, fontWeight: "900" },
  homeBtn: { backgroundColor: "#0F172A", padding: 17, borderRadius: 18, alignItems: "center" },
  homeText: { color: "#FFF", fontWeight: "900", fontSize: 16 },
});
