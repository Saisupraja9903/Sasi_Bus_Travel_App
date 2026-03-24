import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const categories = [
  { key: "ticketBooking", label: "Ticket Booking" },
  { key: "wallet", label: "Wallet" },
  { key: "offers", label: "Offers & Discounts" },
  { key: "referral", label: "Referral Help" },
  { key: "payments", label: "Payments & Refund" },
  { key: "cancellation", label: "Ticket Cancellation" },
  { key: "resell", label: "Ticket Resell" },
  { key: "other", label: "Other FAQ's" },
];

export default function HelpScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Help</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.chatHeaderRow}>
            <View style={styles.chatBubble}>
              <Image source={require("../../assets/chatbot.png")} style={styles.chatBotLogo} />
            </View>
            <Text style={styles.chatTitle}>Chat with Us</Text>
          </View>

          <Text style={styles.chatSub}>Hi, Please choose from the categories below.</Text>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={styles.categoryButton}
              onPress={() => navigation.navigate("FAQList", { category: cat.key })}
            >
              <Text style={styles.categoryText}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f4f8" ,paddingTop: 60},
  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  backButton: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "700" },
  content: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  chatHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  chatIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2F80ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  chatTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  chatSub: { fontSize: 14, color: "#555", marginBottom: 18 },
  chatHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  chatBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8F1FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  chatBotLogo: { width: 28, height: 28, resizeMode: "contain" },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#2F80ED",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    marginBottom: 25,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  categoryText: {
    color: "#2F80ED",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
});
