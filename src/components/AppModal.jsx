import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AppModal({
  visible,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  showCancel = false,
  type = "info", // success, error, info
}) {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setShowModal(false));
    }
  }, [visible]);

  if (!showModal) return null;

  const getIcon = () => {
    switch (type) {
      case "success": return "check-circle";
      case "error": return "error";
      default: return "info";
    }
  };

  const getColor = () => {
    switch (type) {
      case "success": return "#1A73E8";
      case "error": return "#F44336";
      default: return "#1A73E8";
    }
  };

  return (
    <Modal transparent visible={showModal} animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityValue,
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: getColor() }]}>
            <MaterialIcons name={getIcon()} size={32} color="#fff" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: getColor(), flex: 1 }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 20 },
  container: { width: "100%", backgroundColor: "#fff", borderRadius: 16, padding: 24, alignItems: "center", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 8, textAlign: "center" },
  message: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 24, lineHeight: 20 },
  buttonRow: { flexDirection: "row", width: "100%", gap: 12 },
  button: { paddingVertical: 12, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cancelButton: { backgroundColor: "#F0F0F0", flex: 1 },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cancelText: { color: "#666", fontSize: 16, fontWeight: "600" },
});