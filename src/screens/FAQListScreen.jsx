import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { faqData } from "../components/faqData";

export default function FAQListScreen({ navigation, route }) {
  const { category } = route.params || {};
  const section = faqData[category] || { title: "FAQ's", questions: [] };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>FAQ's</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.card}>
          <FlatList
            data={section.questions}
            keyExtractor={(item) => item.question}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.questionRow}
                onPress={() => navigation.navigate("FAQAnswer", { question: item.question, answer: item.answer })}
              >
                <MaterialIcons name="live-help" size={18} color="#2F80ED" />
                <Text style={styles.questionText}>{item.question}</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f4f8" ,paddingTop: 60},
  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  backButton: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "700" },
  container: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#4d4d4d" },
  card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 10,
  },
  questionText: { flex: 1, fontSize: 14, color: "#222" },
  separator: { height: 1, backgroundColor: "#f0f0f0" },
});