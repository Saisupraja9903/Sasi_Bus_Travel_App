import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BookingDetailsCard from "../components/BookingDetailsCard";
import AppModal from "../components/AppModal";

export default function BookingDetailsScreen({ navigation, route }) {
  const { booking } = route.params || {};
  const [resellModalVisible, setResellModalVisible] = useState(false);
  const [resalePrice, setResalePrice] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [cancelConfirmVisible, setCancelConfirmVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = (item) => {
    setCancelConfirmVisible(true);
  };

  const handleResell = (item) => {
    const originalFare = item?.price || 1500;
    setResalePrice(originalFare.toString());
    setResellModalVisible(true);
  };

  const confirmResale = () => {
    const price = parseInt(resalePrice);
    const originalFare = booking?.price || 1500;

    if (isNaN(price) || price <= 0 || price > originalFare) {
      Alert.alert("Invalid Price", `Please enter a price between ₹1 and ₹${originalFare}`);
      return;
    }

    setIsProcessing(true);
    setResellModalVisible(false);
    // Simulate API delay for listing in marketplace
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessModalVisible(true);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
        </View>

        <ScrollView>
          <BookingDetailsCard 
            booking={booking} 
            onCancel={handleCancel}
            onResell={handleResell}
          />
        </ScrollView>
      </View>

      {/* RESELL PRICE INPUT MODAL */}
      <Modal
        visible={resellModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResellModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.resellModalContainer}>
            <Text style={styles.modalTitle}>List Ticket for Resale</Text>
            <Text style={styles.modalSub}>Set your selling price. It cannot exceed your original fare (₹{booking?.price || 1500}).</Text>
            
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={resalePrice}
                onChangeText={setResalePrice}
                autoFocus
                maxLength={5}
              />
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setResellModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={confirmResale}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={[styles.buttonText, styles.confirmButtonText]}>List Ticket</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* PREMIUM CANCEL CONFIRMATION */}
      <AppModal
        visible={cancelConfirmVisible}
        title="Cancel Ticket?"
        message="Are you sure you want to cancel this booking? Cancellation charges may apply as per the operator policy."
        type="error"
        showCancel={true}
        confirmText="Yes, Cancel"
        cancelText="No, Back"
        onCancel={() => setCancelConfirmVisible(false)}
        onConfirm={() => {
          setCancelConfirmVisible(false);
          navigation.navigate("ChatBot", { booking_id: booking?.id });
        }}
      />

      {/* SUCCESS CONFIRMATION */}
      <AppModal
        visible={successModalVisible}
        title="Ticket Listed!"
        message="Your ticket is now live in the marketplace. You will be notified once a buyer purchases it."
        type="success"
        confirmText="View Marketplace"
        onConfirm={() => {
          setSuccessModalVisible(false);
          navigation.navigate("Bookings", { 
            activeTab: "Marketplace",
            subTab: "My Listings" 
          });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resellModalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalSub: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F7FF",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#D0E3FF",
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2F80ED",
    marginRight: 10,
  },
  priceInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
  },
  confirmButton: {
    backgroundColor: "#2F80ED",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  confirmButtonText: {
    color: "#fff",
  },
});