import React, { useEffect, useRef } from "react";
import { Animated, Image, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/colors";

const WalletItem = ({ id, label, image, isSelected, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isSelected ? 1.03 : 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isSelected, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.container, isSelected && styles.containerActive]}
        onPress={() => onPress(id)}
        activeOpacity={0.72}
      >
        <View style={[styles.logoWrapper, isSelected && styles.logoWrapperActive]}>
          <Image source={image} style={styles.walletLogo} resizeMode="contain" />
        </View>
        <Text style={[styles.label, isSelected && styles.labelActive]}>{label}</Text>
        <View style={[styles.radio, isSelected && styles.radioActive]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: 12,
  },
  containerActive: {
    backgroundColor: "#F4F9FF",
    borderBottomColor: "transparent",
  },
  logoWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },
  logoWrapperActive: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
    backgroundColor: "#EAF3FF",
  },
  walletLogo: {
    width: 34,
    height: 34,
  },
  label: { fontSize: 14, color: COLORS.textPrimary, fontWeight: "600", flex: 1 },
  labelActive: { color: COLORS.primary, fontWeight: "800" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#DDD",
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
});

export default WalletItem;
