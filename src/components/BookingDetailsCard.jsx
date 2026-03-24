import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function BookingDetailsCard() {
  return (
    <View style={styles.card}>
      {/* Status */}
      <Text style={styles.status}>Confirmed, Friday, March 13, 2026</Text>

      {/* Route */}
      <View style={styles.routeContainer}>
        <View>
          <Text style={styles.smallLabel}>From</Text>
          <Text style={styles.city}>Hyderabad</Text>
        </View>

        <View style={styles.durationContainer}>
          <Text style={styles.duration}>09hrs 15 mins</Text>
          <View style={styles.line} />
        </View>

        <View>
          <Text style={styles.smallLabel}>To</Text>
          <Text style={styles.city}>Kakinada</Text>
        </View>
      </View>

      {/* Travel */}
      <View style={styles.section}>
        <Text style={styles.smallLabel}>Travel</Text>
        <Text style={styles.value}>Srivastav Travels</Text>
        <Text style={styles.subValue}>A/c Sleeper (2+1)</Text>
      </View>

      {/* Boarding + Drop */}
      <View style={styles.row}>
        <View>
          <Text style={styles.smallLabel}>Boarding Point</Text>
          <Text style={styles.value}>Ameerpet</Text>
          <Text style={styles.subValue}>13 Mar 2026 (21:00PM)</Text>
        </View>

        <View>
          <Text style={styles.smallLabel}>Dropping Point</Text>
          <Text style={styles.value}>JNTU, Kakinada</Text>
          <Text style={styles.subValue}>14 Mar 2026 (06:16AM)</Text>
        </View>
      </View>

      {/* Passenger */}
      <View style={styles.row}>
        <View>
          <Text style={styles.smallLabel}>Passenger</Text>
          <Text style={styles.value}>Niharika</Text>
          <Text style={styles.subValue}>Female 22 years</Text>
        </View>

        <View>
          <Text style={styles.smallLabel}>Seat</Text>
          <Text style={styles.seat}>U4</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.buttonText}>Cancel Ticket</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resellBtn}>
          <Text style={styles.buttonText}>Resell Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 18,
    borderRadius: 18,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  status: {
    fontSize: 12,
    color: "#444",
    marginBottom: 15,
  },

  routeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  smallLabel: {
    fontSize: 11,
    color: "#999",
  },

  city: {
    fontSize: 14,
    fontWeight: "600",
  },

  durationContainer: {
    alignItems: "center",
  },

  duration: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },

  line: {
    width: 80,
    height: 2,
    backgroundColor: "#ccc",
  },

  section: {
    marginBottom: 15,
  },

  value: {
    fontSize: 13,
    fontWeight: "500",
  },

  subValue: {
    fontSize: 11,
    color: "#666",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  seat: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2F80ED",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },

  resellBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
});
