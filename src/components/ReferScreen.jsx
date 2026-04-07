import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";
import { IMAGES } from "../constants/images";
import AppModal from "./AppModal";

export default function ReferralScreen() {
  const navigation = useNavigation();

  const referralCode = "sag35e6fhu54n";
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", type: "info" });

  const showAlert = (title, message, type = "info") => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const copyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    showAlert("Copied", "Referral code copied!", "success");
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Hey! Use my referral code ${referralCode} on Sasi Bus App to get amazing discounts on your first booking! 🚌✨`,
      });
    } catch (error) {
      showAlert("Error", error.message, "error");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer & Earn</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* HERO BANNER */}
        <View style={styles.heroBanner}>
          <Image
            source={IMAGES.REFER}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Share Sasi Bus with your friends and
            </Text>
            <Text style={[styles.heroTitle, styles.textRight]}>
              enjoy rewards
            </Text>
            <Text style={[styles.heroTitle, styles.textRight]}>
              together!
            </Text>
            <Text style={styles.heroSub}>More friends = More discounts</Text>
          </View>
        </View>

        {/* CODE BOX */}
        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <TouchableOpacity style={styles.codeBox} onPress={copyCode} activeOpacity={0.7}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <View style={styles.copyBadge}>
              <Text style={styles.copyText}>COPY</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* SOCIAL SHARE BUTTONS */}
        <View style={styles.shareButtonsRow}>
            <TouchableOpacity style={styles.whatsappBtn} onPress={onShare}>
                <FontAwesome5 name="whatsapp" size={20} color="#fff" />
                <Text style={styles.whatsappText}>WhatsApp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.moreOptionsBtn} onPress={onShare}>
                <Ionicons name="share-social-outline" size={22} color="#1A73E8" />
                <Text style={styles.moreOptionsText}>Share</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* HOW IT WORKS */}
        <Text style={styles.sectionTitle}>How it works</Text>

        {[
          {icon: "share-variant", title: "Invite your friends", desc: "Share your unique referral link with friends & family."},
          {icon: "account-plus", title: "They sign up", desc: "They register using your referral code."},
          {icon: "gift", title: "You get rewarded", desc: "Earn ₹500 when they complete their first trip."},
        ].map((item, index) => (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepIconBox}>
                <MaterialCommunityIcons name={item.icon} size={24} color="#1A73E8" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <AppModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText="OK"
        onConfirm={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerSafeArea: {
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  infoButton: {
    padding: 8,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  /* HERO BANNER */
  heroBanner: {
    backgroundColor: "#EBF3FF",
    borderRadius: 16,
    marginBottom: 30,
    marginTop: 10,
    height: 250,
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
  },
  heroImage: {
    width: 320,
    height: 270,
    position: "absolute",
    left: 0,
    bottom: -20,
  },
  heroContent: {
    marginLeft: 140,
    paddingRight: 20,
    paddingVertical: 15,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A73E8",
    lineHeight: 22,
  },
  textRight: {
    textAlign: "right",
  },
  heroSub: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "right",
  },

  /* CODE SECTION */
  codeSection: {
    marginBottom: 25,
  },
  codeLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#DCEAFE",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 16,
  },
  codeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 1,
  },
  copyBadge: {
    backgroundColor: "#E8F0FE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  copyText: {
    color: "#1A73E8",
    fontWeight: "700",
    fontSize: 12,
  },

  /* SHARE BUTTONS */
  shareButtonsRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },
  whatsappBtn: {
    flex: 1,
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
  },
  whatsappText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
  },
  moreOptionsBtn: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  moreOptionsText: {
    color: "#1A73E8",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 15,
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },

  stepRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
    justifyContent: "center",
  },
  stepTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
});
