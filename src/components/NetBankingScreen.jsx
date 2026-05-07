import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BANKS, formatINR } from "../constants/paymentOptions";
import { BackIcon, CheckIcon, SearchIcon, SecurePaymentIcon } from "../assets/svg/common/PaymentIcons";

export default function NetBankingScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const totalAmount = route.params?.totalAmount ?? 1250;
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredBanks = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return BANKS;
    return BANKS.filter((bank) => `${bank.label} ${bank.name}`.toLowerCase().includes(needle));
  }, [query]);

  const selectedBank = BANKS.find((bank) => bank.id === selectedId);

  const pay = () => {
    if (!selectedBank || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("SuccessScreen", { amount: totalAmount, method: selectedBank.name });
    }, 950);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Net Banking</Text>
          <Text style={styles.subtitle}>Choose your bank securely</Text>
        </View>
        <SecurePaymentIcon width={48} height={48} active />
      </View>

      <View style={styles.searchBox}>
        <SearchIcon width={20} height={20} color="#64748B" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search bank"
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredBanks}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.column}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const active = selectedId === item.id;
          return (
            <TouchableOpacity style={[styles.bankCard, active && styles.bankCardActive]} onPress={() => setSelectedId(item.id)} activeOpacity={0.75}>
              <View style={[styles.logoWrapper, active && styles.logoWrapperActive]}>
                <Image source={item.image} style={styles.bankLogo} resizeMode="contain" />
              </View>
              <Text style={[styles.bankShort, active && styles.bankShortActive]}>{item.label}</Text>
              <Text style={styles.bankName} numberOfLines={1}>{item.name}</Text>
              {active && (
                <View style={styles.check}>
                  <CheckIcon width={12} height={12} />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={[styles.payBtn, !selectedId && styles.payBtnDisabled]} disabled={!selectedId || loading} onPress={pay} activeOpacity={0.82}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.payText}>Pay {formatINR(totalAmount)}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F7FB" },
  header: { backgroundColor: "#0F172A", paddingHorizontal: 20, paddingBottom: 24, flexDirection: "row", alignItems: "center" },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", marginRight: 12 },
  headerCenter: { flex: 1 },
  title: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  subtitle: { color: "#CBD5E1", fontSize: 12, fontWeight: "600", marginTop: 3 },
  searchBox: { margin: 16, minHeight: 52, borderRadius: 18, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5EDF7", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#0F172A", fontWeight: "700" },
  list: { paddingHorizontal: 16, paddingBottom: 126 },
  column: { gap: 12 },
  bankCard: { flex: 1, minHeight: 142, marginBottom: 12, borderRadius: 22, backgroundColor: "#FFFFFF", borderWidth: 1.4, borderColor: "#E5EDF7", alignItems: "center", justifyContent: "center", padding: 12 },
  bankCardActive: { borderColor: "#1A73E8", backgroundColor: "#F4F9FF", shadowColor: "#1A73E8", shadowOpacity: 0.16, shadowRadius: 14, elevation: 4 },
  logoWrapper: { width: 64, height: 64, borderRadius: 22, backgroundColor: "#F8FAFC", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  logoWrapperActive: { backgroundColor: "#EAF3FF" },
  bankLogo: { width: 52, height: 52 },
  bankShort: { marginTop: 8, color: "#0F172A", fontSize: 15, fontWeight: "900" },
  bankShortActive: { color: "#1A73E8" },
  bankName: { color: "#64748B", fontSize: 11, fontWeight: "700", marginTop: 3, maxWidth: "100%" },
  check: { position: "absolute", right: 10, top: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: "#1A73E8", alignItems: "center", justifyContent: "center" },
  footer: { position: "absolute", bottom: 0, width: "100%", backgroundColor: "#FFFFFF", padding: 20, borderTopLeftRadius: 28, borderTopRightRadius: 28, elevation: 18, shadowColor: "#0F172A", shadowOpacity: 0.12, shadowRadius: 20 },
  payBtn: { backgroundColor: "#0F172A", paddingVertical: 17, borderRadius: 18, alignItems: "center" },
  payBtnDisabled: { backgroundColor: "#A7B4C7" },
  payText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
});
