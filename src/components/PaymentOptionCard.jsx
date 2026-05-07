import React, { useEffect, useRef } from "react";
import { Animated, Image, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/colors";

const PaymentOptionCard = ({ 
  id, 
  label, 
  image,
  isSelected, 
  onPress, 
  variant = "row" // "row" or "grid"
}) => {
  const isGrid = variant === "grid";
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isSelected ? 1.04 : 1,
      friction: 6,
      tension: 110,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          isGrid ? styles.gridCard : styles.rowCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => onPress(id)}
        activeOpacity={0.78}
      >
        {image && (
          <View style={[styles.logoWrapper, isGrid && styles.gridLogoWrapper, isSelected && styles.logoWrapperActive]}>
            <Image
              source={image}
              style={isGrid ? styles.gridLogo : styles.logo}
              resizeMode="contain"
            />
          </View>
        )}

        <Text style={[styles.text, isGrid && styles.gridText, isSelected && styles.selectedText]}>
          {label}
        </Text>

        {!isGrid && isSelected && (
          <View style={styles.rowCheck}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}
        {isGrid && isSelected && (
          <View style={styles.gridCheck}>
            <Text style={styles.gridCheckText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5EDF7",
    borderRadius: 18,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  gridCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    width: "100%",
    minHeight: 112,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#F4F9FF",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  logoWrapper: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },
  gridLogoWrapper: { width: 58, height: 58, borderRadius: 20 },
  logoWrapperActive: { backgroundColor: "#EAF3FF" },
  logo: {
    width: 34,
    height: 34,
  },
  gridLogo: {
    width: 44,
    height: 44,
  },
  text: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary, flex: 1 },
  gridText: { flex: 0, marginTop: 8, fontSize: 12, textAlign: 'center' },
  selectedText: { color: COLORS.primary },
  rowCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  gridCheck: { position: 'absolute', top: -6, right: -6, backgroundColor: COLORS.primary, borderRadius: 12, width: 22, height: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  checkText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", lineHeight: 16 },
  gridCheckText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900", lineHeight: 13 },
});

export default PaymentOptionCard;
