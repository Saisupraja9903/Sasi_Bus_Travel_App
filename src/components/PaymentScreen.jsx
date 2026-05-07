import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { COLORS } from "../constants/colors";
import { BANKS, formatINR, UPI_APPS, WALLETS } from "../constants/paymentOptions";
import SectionHeader from "../components/SectionHeader";
import PaymentOptionCard from "../components/PaymentOptionCard";
import WalletItem from "../components/WalletItem";
import { BackIcon, NetBankingIcon, LockIcon, SecurePaymentIcon, ShieldIcon } from "../assets/svg/common/PaymentIcons";

const HeaderArt = ({ width }) => (
  <Svg width={width} height={156} viewBox={`0 0 ${width} 156`} style={StyleSheet.absoluteFill}>
    <Defs>
      <LinearGradient id="payHeader" x1="0" y1="0" x2={width} y2="156">
        <Stop offset="0" stopColor="#08111F" />
        <Stop offset="0.55" stopColor="#1A73E8" />
        <Stop offset="1" stopColor="#20C7D9" />
      </LinearGradient>
    </Defs>
    <Rect width={width} height="156" fill="url(#payHeader)" />
    <Circle cx={width - 42} cy="22" r="70" fill="#FFFFFF" opacity="0.11" />
    <Circle cx="34" cy="138" r="62" fill="#FFFFFF" opacity="0.08" />
    <Path d={`M0 132C${width * 0.32} 102 ${width * 0.66} 164 ${width} 118V156H0V132Z`} fill="#FFFFFF" opacity="0.1" />
  </Svg>
);

export default function PaymentScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const totalAmount = route.params?.totalAmount ?? 1250;

  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedUpi = UPI_APPS.find((item) => item.id === selectedId);
  const selectedWallet = WALLETS.find((item) => item.id === selectedId);
  const selectedBank = BANKS.find((item) => item.id === selectedId);

  const handlePayment = () => {
    if (selectedId === "card") {
      navigation.navigate("CardPaymentScreen", { totalAmount });
      return;
    }
    if (!selectedId) return;
    setIsLoading(true);
    const method = selectedUpi?.label || selectedWallet?.label || selectedBank?.name || selectedId.toUpperCase();
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("SuccessScreen", {
        amount: totalAmount,
        method,
      });
    }, 1100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#08111F" />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <HeaderArt width={width} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Payment Method</Text>
          <View style={styles.headerSecure}>
            <LockIcon width={18} height={18} active />
            <Text style={styles.headerSubtitle}>Secure checkout protected by SSL</Text>
          </View>
        </View>
        <ShieldIcon width={44} height={44} active />
      </View>

      <View style={styles.amountSection}>
        <View style={styles.amountCard}>
          <View style={styles.amountLeft}>
            <SecurePaymentIcon width={58} height={58} active />
            <View>
              <Text style={styles.completeText}>Complete your payment</Text>
              <Text style={styles.secureText}>Encrypted gateway session</Text>
            </View>
          </View>
          <Text style={styles.amountText}>{formatINR(totalAmount)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <SectionHeader title="Cards" />
          <PaymentOptionCard
            id="card"
            label="Credit / Debit Cards"
            isSelected={selectedId === "card"}
            onPress={setSelectedId}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title="UPI" rightElement={<Text style={styles.upiSub}>Pay by any UPI app</Text>} />
          <View style={styles.grid}>
            {UPI_APPS.map((app) => (
              <View key={app.id} style={styles.gridCell}>
                <PaymentOptionCard
                  {...app}
                  variant="grid"
                  isSelected={selectedId === app.id}
                  onPress={setSelectedId}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Net Banking"
            rightElement={<TouchableOpacity onPress={() => navigation.navigate("NetBankingScreen", { totalAmount })}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bankScroll}>
            {BANKS.slice(0, 6).map((bank) => (
              <TouchableOpacity
                key={bank.id}
                style={[styles.bankCard, selectedId === bank.id && styles.bankCardActive]}
                onPress={() => setSelectedId(bank.id)}
                activeOpacity={0.72}
              >
                <View style={[styles.logoWrapper, selectedId === bank.id && styles.logoWrapperActive]}>
                  <Image source={bank.image} style={styles.bankLogo} resizeMode="contain" />
                </View>
                <Text style={[styles.bankText, selectedId === bank.id && styles.bankTextActive]}>{bank.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.bankCard}
              onPress={() => navigation.navigate("NetBankingScreen", { totalAmount })}
              activeOpacity={0.72}
            >
              <NetBankingIcon width={58} height={58} />
              <Text style={styles.bankText}>More</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Wallets" />
          <View style={styles.walletCard}>
            {WALLETS.map((wallet) => (
              <WalletItem key={wallet.id} {...wallet} isSelected={selectedId === wallet.id} onPress={setSelectedId} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.payBtn, (!selectedId || isLoading) && styles.payBtnDisabled]}
          onPress={handlePayment}
          disabled={!selectedId || isLoading}
          activeOpacity={0.82}
        >
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.payBtnText}>{selectedId === "card" ? "Continue to Card" : `Pay ${formatINR(totalAmount)}`}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F7FB" },
  header: { minHeight: 156, paddingHorizontal: 20, paddingBottom: 42, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", marginRight: 14 },
  headerCopy: { flex: 1 },
  headerTitle: { color: "#FFF", fontSize: 21, fontWeight: "800" },
  headerSecure: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  headerSubtitle: { color: "rgba(255,255,255,0.82)", fontSize: 12, fontWeight: "600" },
  amountSection: { marginTop: -36, paddingHorizontal: 16 },
  amountCard: { backgroundColor: COLORS.surface, borderRadius: 22, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", elevation: 10, shadowColor: "#0F172A", shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } },
  amountLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  completeText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: "800" },
  secureText: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3 },
  amountText: { fontSize: 21, fontWeight: "900", color: "#0F172A" },
  scrollContent: { padding: 16, paddingBottom: 126 },
  section: { marginBottom: 24 },
  upiSub: { fontSize: 12, color: COLORS.primary, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridCell: { width: "48.5%" },
  viewAll: { color: COLORS.primary, fontSize: 13, fontWeight: "800" },
  bankScroll: { gap: 12, paddingVertical: 2, paddingRight: 12 },
  bankCard: { width: 88, minHeight: 104, borderRadius: 18, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", borderWidth: 1.4, borderColor: "#E5EDF7", gap: 7 },
  bankCardActive: { borderColor: COLORS.primary, backgroundColor: "#F4F9FF", shadowColor: COLORS.primary, shadowOpacity: 0.16, shadowRadius: 12, elevation: 3 },
  logoWrapper: { width: 58, height: 58, borderRadius: 20, backgroundColor: "#F8FAFC", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  logoWrapperActive: { backgroundColor: "#EAF3FF" },
  bankLogo: { width: 46, height: 46 },
  bankText: { color: "#475569", fontSize: 12, fontWeight: "800" },
  bankTextActive: { color: COLORS.primary },
  walletCard: { backgroundColor: COLORS.surface, borderRadius: 22, paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: "#E5EDF7" },
  footer: { position: "absolute", bottom: 0, width: "100%", backgroundColor: COLORS.surface, padding: 20, borderTopLeftRadius: 28, borderTopRightRadius: 28, elevation: 20, shadowColor: "#0F172A", shadowOpacity: 0.12, shadowRadius: 20 },
  payBtn: { backgroundColor: "#0F172A", paddingVertical: 17, borderRadius: 18, alignItems: "center", elevation: 5, shadowColor: "#0F172A", shadowOpacity: 0.3, shadowRadius: 10 },
  payBtnDisabled: { backgroundColor: "#A7B4C7" },
  payBtnText: { color: "#FFF", fontSize: 16, fontWeight: "900" },
});
