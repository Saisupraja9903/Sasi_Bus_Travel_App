import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMAGES } from "../constants/images";
import AppModal from "./AppModal";

export default function WalletScreen() {

  const navigation = useNavigation();

  // change this value to test UI
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([
    {
      id: "default-" + Date.now(), // Ensure unique ID for default
      type: "Wallet Credited",
      desc: "Sign up gift from Gobus, Expire on May 15",
      timestamp: new Date().toISOString(), // Add timestamp to default
    },
  ]);
  
  // Load wallet data from persistent storage on mount
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        const balance = await AsyncStorage.getItem("wallet_balance");
        const history = await AsyncStorage.getItem("wallet_transactions");

        if (balance !== null) {
          setWalletBalance(Number(balance));
        }
        if (history !== null) {
          const parsedHistory = JSON.parse(history);
          if (parsedHistory.length > 0) {
            setTransactions(parsedHistory);
          }
        }
      } catch (error) {
        console.error("Failed to load wallet data from storage:", error);
      }
    };
    loadWalletData();
  }, []);

  // Helper function to update persistent storage
  const saveWalletData = async (balance, history) => {
    try {
      await AsyncStorage.setItem("wallet_balance", balance.toString());
      await AsyncStorage.setItem("wallet_transactions", JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save wallet data to storage:", error);
    }
  };

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success"); // success | error
  const [modalMsg, setModalMsg] = useState("");

  // Helper to format timestamp
  const formatTransactionTimestamp = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  };

  const handleAddMoney = () => {
    const val = parseInt(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setModalType("error");
      setModalMsg("Please enter a valid amount to add.");
      setShowModal(true);
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      type: "Wallet Credited",
      desc: `Added ₹${val} to your wallet successfully`,
      timestamp: new Date().toISOString(), // Add timestamp here
    };

    const updatedTransactions = [newTransaction, ...transactions];
    const updatedBalance = walletBalance + val;

    setTransactions(updatedTransactions);
    setWalletBalance(updatedBalance);
    saveWalletData(updatedBalance, updatedTransactions);

    setAmount("");
    Keyboard.dismiss();
    setModalType("success");
    setModalMsg("Money added to wallet successfully!");
    setShowModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Wallet</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

        {/* IMAGE */}
        <View style={styles.imageContainer}>
          <Image
            source={transactions.length <= 1 && walletBalance === 0 ? IMAGES.WALLET_EMPTY : IMAGES.WALLET}
            style={styles.walletImage}
            resizeMode="contain"
          />
        </View>

        {/* ========================= */}
        {/* EMPTY WALLET UI */}
        {/* ========================= */}

        {walletBalance === 0 ? (
          <View style={styles.emptyWalletBox}>

            <Text style={styles.emptyText}>
              Your Wallet Cash
            </Text>

            <Text style={styles.emptyAmount}>
              INR 0
            </Text>

          </View>

        ) : (
          <>
            <Text style={styles.balanceTitle}>
              Total Available Cash
            </Text>

            <View style={styles.balanceBox}>
              <Text style={styles.balanceText}>
                ₹ {walletBalance}
              </Text>
            </View>
          </>
        )}

        {/* ADD MONEY SECTION */}
        <View style={styles.addSection}>
          <Text style={styles.addTitle}>Add Money</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={handleAddMoney}>
            <Text style={styles.addBtnText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        {/* TRANSACTIONS (Only when balance > 0) */}
        {transactions.length > 0 && (

            <View style={styles.transactionContainer}>

              <Text style={styles.transactionTitle}>
                Transactions
              </Text>

              {transactions.map((item) => (
                <View key={item.id} style={styles.transactionItem}>
                  <View style={styles.iconBox}>
                    <MaterialIcons
                      name="account-balance-wallet"
                      size={18}
                      color="#fff"
                    />
                  </View>

                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionHeading}>
                      {item.type}
                    </Text>
                    <Text style={styles.transactionDesc}>
                      {item.desc}
                    </Text>
                    {item.timestamp && (
                      <Text style={styles.transactionTimestamp}>
                        {formatTransactionTimestamp(item.timestamp)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
        )}
      </ScrollView>
      {/* CUSTOM STATUS MODAL */}
      <AppModal
        visible={showModal}
        title={modalType === "success" ? "Success!" : "Oops!"}
        message={modalMsg}
        type={modalType}
        confirmText="Close"
        onConfirm={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 40,
    padding: 16
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: 'center',
    marginRight: 22
  },

  imageContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10
  },

  walletImage: {
    width: "100%",
    height: 300
  },

  /* EMPTY WALLET */

  emptyWalletBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 16,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0"
  },

  emptyText: {
    fontSize: 14,
    color: "#666"
  },

  emptyAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999"
  },

  /* WALLET BALANCE */

  balanceTitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#444",
    marginTop: 10
  },

  balanceBox: {
    alignSelf: "center",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#2F80ED",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 10
  },

  balanceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F80ED"
  },

  /* TRANSACTIONS */

  transactionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 30,
    paddingBottom: 10,
    elevation: 2
  },

  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A73E8",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },

  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },

  iconBox: {
    backgroundColor: "#1A73E8",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },

  transactionHeading: {
    fontSize: 14,
    fontWeight: "600"
  },

  transactionDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 2
  }
  , /* New styles for timestamp */
  transactionDetails: {
    flex: 1,
  },
  transactionTimestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  /* ADD MONEY STYLES */
  addSection: {
    marginTop: 50,
  },
  addTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    backgroundColor: "#FAFAFA",
  },
  currency: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  addBtn: {
    backgroundColor: "#1A73E8",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});