import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FAQAnswerScreen({ navigation, route }) {
  const { question, answer } = route.params || {};
  const [feedback, setFeedback] = useState(null);

  const answerLines = answer ? answer.split("\n").filter((line) => line.trim() !== "") : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>FAQ's</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.question}>{question}</Text>
          <View style={styles.answerArea}>
            {answerLines.length > 0
              ? answerLines.map((line, idx) => {
                  const trimmed = line.trim();
                  const isHeading = idx === 0 && trimmed.toLowerCase().includes("booking bus tickets on gobus app is a simple 6 step process");

                  if (isHeading) {
                    return (
                      <Text key={`heading-${idx}`} style={styles.answerHeading}>
                        {trimmed}
                      </Text>
                    );
                  }

                  const numberedMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
                const bulletMatch = trimmed.startsWith("•");

                if (numberedMatch) {
                return (
                    <Text key={idx} style={styles.answerLine}>
                    <Text style={styles.number}>{numberedMatch[1]}. </Text>
                    {numberedMatch[2]}
                    </Text>
                );
                }

                if (bulletMatch) {
                return (
                    <Text key={idx} style={styles.answerLine}>
                    <Text style={styles.bulletPoint}>• </Text>
                    {trimmed.replace("•", "")}
                    </Text>
                );
                }

                return (
                <Text key={idx} style={styles.answerParagraph}>
                    {trimmed}
                </Text>
                );
                })
              : <Text style={styles.answerLine}>{answer}</Text>}
          </View>
        </View>

        <View style={styles.feedbackWrapper}>
          <Text style={styles.feedbackTitle}>Was this information helpful to you?</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity
              onPress={() => setFeedback("helpful")}
              style={[styles.feedbackIconBtn, feedback === "helpful" && styles.feedbackBtnActive]}
            >
              <Text style={styles.feedbackIcon}>👍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFeedback("not_helpful")}
              style={[styles.feedbackIconBtn, feedback === "not_helpful" && styles.feedbackBtnActive]}
            >
              <Text style={styles.feedbackIcon}>👎</Text>
            </TouchableOpacity>
          </View>
          {feedback && <Text style={styles.feedbackStatus}>Thank you for your feedback!</Text>}
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
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#f0f2f8",
    marginBottom: 30,
  },
  question: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#1a1a1a" },
  answerArea: { marginTop: 8 },
  answerHeading: { fontSize: 16, fontWeight: "500", marginBottom: 10, color: "#1a1a1a" },
  bulletPoint: {
    fontSize: 18,
    color: "#1a1a1a",
    fontWeight: "bold",
  },
  number: {
  fontWeight: "600",
  color: "#1a1a1a",
},

answerParagraph: {
  fontSize: 15,
  color: "#444",
  lineHeight: 24,
  marginBottom: 12,
},
  answerLine: { fontSize: 15, color: "#444", lineHeight: 24, marginBottom: 10 },
  feedbackWrapper: { alignItems: "center", marginTop: 12, paddingBottom: 20 },
  feedbackTitle: { fontSize: 15, fontWeight: "600", marginBottom: 12, color: "#2F80ED" },
  feedbackButtons: { flexDirection: "row", justifyContent: "center", gap: 20 },
  feedbackIconBtn: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: "#2F80ED", justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  feedbackBtnActive: { backgroundColor: "#e7f0ff", borderColor: "#2F80ED" },
  feedbackIcon: { fontSize: 24 },
  feedbackStatus: { marginTop: 16, color: "#333", fontSize: 14, textAlign: "center" },
});