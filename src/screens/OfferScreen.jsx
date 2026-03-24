import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { IMAGES } from "../constants/images";
import Footer from "../components/Footer";

export default function OffersScreen() {
  const navigation = useNavigation();
  const [hover, setHover] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity style={styles.leftHeader} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} />
            <Text style={styles.headerTitle}>Offers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Text style={[styles.viewAll, hover && styles.viewAllHover]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* SCROLLABLE OFFER CARDS */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >
          {/* YELLOW CARD */}

          <View style={styles.yellowCard}>
            <Image
              source={IMAGES.OFFER6}
              style={styles.yellowBg}
            />

            <View style={styles.yellowContent}>
              <Text style={styles.yellowText}>
                Special offers for students and corporate employees
              </Text>

              <TouchableOpacity style={styles.yellowBtn}>
                <Text style={styles.yellowBtnText}>STUD:EMP300</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* PURPLE CARD */}

          <View style={[styles.topOffer, { backgroundColor: "#F1CCF7" }]}>
            <Text style={styles.offerTopTitle}>
              Save upto Rs 200 on bus tickets
            </Text>

            <Text style={styles.offerTopSub}>Valid till 31 May</Text>

            <Text style={styles.percentText}>92%</Text>
          </View>

          {/* EXTRA SCROLL COLORS */}

          <View style={[styles.topOffer, { backgroundColor: "#FFE0B2" }]}>
            <Text style={styles.offerTopTitle}>Festival Offer</Text>
            <Text style={styles.offerTopSub}>Save ₹150</Text>
          </View>

          <View style={[styles.topOffer, { backgroundColor: "#C8E6C9" }]}>
            <Text style={styles.offerTopTitle}>Weekend Deal</Text>
            <Text style={styles.offerTopSub}>Extra Cashback</Text>
          </View>
        </ScrollView>

        {/* PAYMENT OFFERS */}

        <Text style={styles.sectionTitle}>Payment Offers</Text>

        {/* AXIS BANK */}

        <View style={styles.offerCard}>
          <View style={styles.leftContent}>
            <Image
              source={IMAGES.AXIS}
              style={styles.logo}
            />

            {/* <Text style={[styles.bankName,{color:"#C2185B"}]}>
AXIS BANK
</Text> */}

            <Text style={styles.offerText}>
              Save upto Rs 500 with Axis Bank Credit Cards
            </Text>
          </View>

          <TouchableOpacity style={styles.couponBtn}>
            <Text style={styles.couponText}>AXIS120D</Text>
          </TouchableOpacity>
        </View>

        {/* HDFC BANK */}

        <View style={styles.offerCard}>
          <View style={styles.leftContent}>
            <Image
              source={IMAGES.HDFC}
              style={styles.logo}
            />

            <Text style={styles.offerText}>
              Save upto Rs 200 with HDFC Bank Credit Cards
            </Text>
          </View>

          <TouchableOpacity style={styles.couponBtn}>
            <Text style={styles.couponText}>HDFC200</Text>
          </TouchableOpacity>
        </View>

        {/* IDBI BANK */}

        <View style={styles.offerCard}>
          <View style={styles.leftContent}>
            <Image
              source={IMAGES.IDBI}
              style={styles.logo}
            />

            <Text style={styles.offerText}>
              Save upto Rs 150 with IDBI Bank Credit Cards
            </Text>
          </View>

          <TouchableOpacity style={styles.couponBtn}>
            <Text style={styles.couponText}>IDBI150</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },

  viewAll: {
    color: "#2F80ED",
    fontSize: 14,
    fontWeight: "500",
  },

  viewAllHover: {
    textDecorationLine: "underline",
  },

  /* SCROLL CARDS */

  yellowCard: {
    width: 250,
    height: 150,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 14,
  },

  yellowBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  yellowContent: {
    padding: 14,
  },

  yellowText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
  },

  yellowBtn: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  yellowBtnText: {
    fontSize: 11,
    color: "#2F80ED",
  },

  topOffer: {
    width: 250,
    height: 150,
    borderRadius: 18,
    marginRight: 14,
    padding: 14,
    justifyContent: "center",
  },

  offerTopTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  offerTopSub: {
    fontSize: 12,
    color: "#555",
  },

  percentText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2F80ED",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 14,
  },

  /* PAYMENT OFFERS */

  offerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: 4, // ⭐ prevents side cutting
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  leftContent: {
    flex: 1,
  },

  logo: {
    width: 110,
    height: 30,
    resizeMode: "contain",
    marginBottom: 6,
  },

  bankName: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },

  offerText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  idbiLogo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F7A4F",
    marginBottom: 6,
  },

  couponBtn: {
    backgroundColor: "#1A73E8",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 48,
  },

  couponText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
