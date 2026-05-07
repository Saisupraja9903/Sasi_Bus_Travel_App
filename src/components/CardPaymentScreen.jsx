import React, { useMemo, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { formatCardNumber, formatExpiry, formatINR, getCardType } from "../constants/paymentOptions";
import CreditCardPreview from "./CreditCardPreview";
import { BackIcon, LockIcon, ShieldIcon } from "../assets/svg/common/PaymentIcons";

export default function CardPaymentScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const totalAmount = route.params?.totalAmount ?? 1250;
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [focusedField, setFocusedField] = useState("number");
  const [loading, setLoading] = useState(false);

  const cleanNumber = number.replace(/\D/g, "");
  const cardType = getCardType(number);
  const isValid = cleanNumber.length >= 15 && holder.trim().length > 2 && /^\d{2}\/\d{2}$/.test(expiry) && cvv.length >= 3;
  const typeLabel = useMemo(() => cardType === "generic" ? "card" : cardType.toUpperCase(), [cardType]);

  const pay = () => {
    if (!isValid || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("SuccessScreen", { amount: totalAmount, method: `${typeLabel} Card` });
    }, 950);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Card Payment</Text>
          <View style={styles.secureRow}>
            <LockIcon width={18} height={18} active />
            <Text style={styles.subtitle}>PCI-style encrypted entry</Text>
          </View>
        </View>
        <ShieldIcon width={42} height={42} active />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CreditCardPreview number={number} holder={holder} expiry={expiry} cvv={cvv} focusedField={focusedField} />

        <View style={styles.form}>
          <Field
            label="Card number"
            value={number}
            onChangeText={(text) => setNumber(formatCardNumber(text))}
            keyboardType="number-pad"
            maxLength={19}
            onFocus={() => setFocusedField("number")}
            placeholder="4242 4242 4242 4242"
          />
          <Field
            label="Card holder"
            value={holder}
            onChangeText={(text) => setHolder(text.replace(/[^a-zA-Z ]/g, "").slice(0, 28))}
            autoCapitalize="characters"
            onFocus={() => setFocusedField("holder")}
            placeholder="Name on card"
          />
          <View style={styles.row}>
            <Field
              label="Expiry"
              value={expiry}
              onChangeText={(text) => setExpiry(formatExpiry(text))}
              keyboardType="number-pad"
              maxLength={5}
              onFocus={() => setFocusedField("expiry")}
              placeholder="MM/YY"
              compact
            />
            <Field
              label="CVV"
              value={cvv}
              onChangeText={(text) => setCvv(text.replace(/\D/g, "").slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
              onFocus={() => setFocusedField("cvv")}
              onBlur={() => setFocusedField("number")}
              placeholder="123"
              secureTextEntry
              compact
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={[styles.payBtn, !isValid && styles.payBtnDisabled]} disabled={!isValid || loading} onPress={pay} activeOpacity={0.82}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.payText}>Pay {formatINR(totalAmount)}</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const Field = ({ label, compact, ...props }) => (
  <View style={[styles.field, compact && styles.compactField]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput {...props} placeholderTextColor="#94A3B8" style={styles.input} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F7FB" },
  header: { backgroundColor: "#0F172A", paddingHorizontal: 20, paddingBottom: 24, flexDirection: "row", alignItems: "center" },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", marginRight: 12 },
  headerCenter: { flex: 1 },
  title: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  secureRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  subtitle: { color: "#CBD5E1", fontSize: 12, fontWeight: "600" },
  content: { padding: 18, paddingBottom: 130 },
  form: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 16, borderWidth: 1, borderColor: "#E5EDF7", gap: 14 },
  row: { flexDirection: "row", gap: 12 },
  field: { flex: 1 },
  compactField: { minWidth: 0 },
  fieldLabel: { color: "#475569", fontSize: 12, fontWeight: "800", marginBottom: 8 },
  input: { minHeight: 52, borderRadius: 16, borderWidth: 1.4, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", paddingHorizontal: 14, color: "#0F172A", fontSize: 15, fontWeight: "700" },
  footer: { position: "absolute", bottom: 0, width: "100%", backgroundColor: COLORS.surface, padding: 20, borderTopLeftRadius: 28, borderTopRightRadius: 28, elevation: 18, shadowColor: "#0F172A", shadowOpacity: 0.12, shadowRadius: 20 },
  payBtn: { backgroundColor: "#0F172A", paddingVertical: 17, borderRadius: 18, alignItems: "center" },
  payBtnDisabled: { backgroundColor: "#A7B4C7" },
  payText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
});
