import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../components/Footer";

export default function BookingScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Upcoming");

  /* ---------------- MOCK DATA ---------------- */

  const upcomingBookings = [
    {
      route: "Hyderabad ➜ Bangalore",
      from: "Hyderabad\n13 Mar 26(18:00pm)",
      to: "Bangalore\n14 Mar 26(06:00am)",
    },
    {
      route: "Hyderabad ➜ Kakinada",
      from: "Hyderabad\n15 Mar 26(18:00pm)",
      to: "Kakinada\n16 Mar 26(06:00am)",
    },
  ];

  const completedBookings = [
    {
      route: "Hyderabad ➜ Kakinada",
      travels: "Saman Travels",
      bookingId: "VD566H88UJI",
      time: "Mon 06 Oct 2025 at 19:55",
    },
  ];

  const unsuccessfulBookings = [
    {
      route: "Hyderabad ➜ Bangalore",
      date: "13 Jan 2026, 22:00",
      travels: "DMR Travels",
    },
  ];

  /* ---------------- TAB DATA ---------------- */

  const getBookings = () => {
    if (activeTab === "Upcoming") return upcomingBookings;
    if (activeTab === "Completed") return completedBookings;
    if (activeTab === "Unsuccessful") return unsuccessfulBookings;
  };

  /* ---------------- EMPTY STATE ---------------- */

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../assets/no-booking.png")}
        style={styles.emptyImage}
      />

      <Text style={styles.emptyTitle}>No Previous Bookings yet!</Text>

      <Text style={styles.emptySubtitle}>
        Looks like you haven't started any trips yet. Lets book your next ride.
      </Text>
    </View>
  );

  /* ---------------- UPCOMING CARD ---------------- */

  const renderUpcoming = (item, index) => (
    <View key={index} style={styles.card}>
      <Text style={styles.route}>{item.route}</Text>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>From</Text>
          <Text style={styles.value}>{item.from}</Text>
        </View>

        <View>
          <Text style={styles.label}>To</Text>
          <Text style={styles.value}>{item.to}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("BookingDetails", { booking: item })}
      >
        <Text style={styles.buttonText}>View and Manage Booking</Text>
      </TouchableOpacity>
    </View>
  );

  /* ---------------- COMPLETED CARD ---------------- */

  const renderCompleted = (item, index) => (
    <View key={index} style={styles.card}>
      <Text style={styles.route}>{item.route}</Text>

      <Text style={styles.subText}>{item.travels}</Text>
      <Text style={styles.subText}>Booking Id: {item.bookingId}</Text>
      <Text style={styles.subText}>Time: {item.time}</Text>

      <TouchableOpacity style={styles.buttonRight}>
        <Text style={styles.buttonText}>Book Again</Text>
      </TouchableOpacity>
    </View>
  );

  /* ---------------- UNSUCCESSFUL CARD ---------------- */

  const renderUnsuccessful = (item, index) => (
    <View key={index} style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.route}>{item.route}</Text>

        <View style={styles.failedBadge}>
          <Text style={styles.failedText}>Payment failed</Text>
        </View>
      </View>

      <Text style={styles.subText}>{item.date}</Text>
      <Text style={styles.subText}>{item.travels}</Text>
    </View>
  );

  const bookings = getBookings();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {["Upcoming", "Completed", "Unsuccessful"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTab]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTENT */}
      <ScrollView style={{ flex: 1 }}>
        {bookings.length === 0
          ? renderEmpty()
          : bookings.map((item, index) => {
              if (activeTab === "Upcoming") return renderUpcoming(item, index);
              if (activeTab === "Completed")
                return renderCompleted(item, index);
              if (activeTab === "Unsuccessful")
                return renderUnsuccessful(item, index);
            })}
      </ScrollView>

      {/* FOOTER */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 10,
  },

  tabText: {
    fontSize: 14,
    color: "#444",
  },

  activeTab: {
    color: "#2F80ED",
    fontWeight: "600",
  },

  /* ---------- CARDS ---------- */

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 16,
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  route: {
    fontWeight: "600",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#999",
    fontSize: 12,
  },

  value: {
    fontSize: 12,
  },

  subText: {
    fontSize: 12,
    color: "#444",
    marginBottom: 4,
  },

  button: {
    backgroundColor: "#2F80ED",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonRight: {
    backgroundColor: "#2F80ED",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
  },

  failedBadge: {
    backgroundColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  failedText: {
    fontSize: 10,
  },

  /* ---------- EMPTY ---------- */

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 80,
  },

  emptyImage: {
    width: 220,
    height: 180,
    resizeMode: "contain",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
