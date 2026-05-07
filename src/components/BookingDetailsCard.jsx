import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function BookingDetailsCard({ booking, onCancel, onResell }) {
  // Fallback data if props are missing
  const {
    travels = "Srivastav Travels",
    source = "Hyderabad",
    destination = "Kakinada",
    from = "13 Mar 2026 (21:00PM)",
    to = "14 Mar 2026 (06:16AM)",
    passengerName = "Niharika",
    gender = "Female",
    age = "22",
    seat = "U4",
    busType = "A/c Sleeper (2+1)",
    duration = "09hrs 15 mins"
  } = booking || {};

  // Parse 'from' and 'to' if they contain newlines (format from BookingScreen)
  const boardingPoint = from.includes('\n') ? from.split('\n')[0] : "Ameerpet";
  const boardingTime = from.includes('\n') ? from.split('\n')[1] : from;
  
  const droppingPoint = to.includes('\n') ? to.split('\n')[0] : "JNTU, Kakinada";
  const droppingTime = to.includes('\n') ? to.split('\n')[1] : to;

  const statusDate = boardingTime.split('(')[0].trim();

  return (
    <View style={styles.card}>
      {/* Status */}
      <Text style={styles.status}>Confirmed, {statusDate}</Text>

      {/* Route */}
      <View style={styles.routeContainer}>
        <View>
          <Text style={styles.smallLabel}>From</Text>
          <Text style={styles.city}>{source}</Text>
        </View>

        <View style={styles.durationContainer}>
          <Text style={styles.duration}>{duration}</Text>
          <View style={styles.line} />
        </View>

        <View>
          <Text style={styles.smallLabel}>To</Text>
          <Text style={styles.city}>{destination}</Text>
        </View>
      </View>

      {/* Travel */}
      <View style={styles.section}>
        <Text style={styles.smallLabel}>Travel</Text>
        <Text style={styles.value}>{travels}</Text>
        <Text style={styles.subValue}>{busType}</Text>
      </View>

      {/* Boarding + Drop */}
      <View style={styles.row}>
        <View>
          <Text style={styles.smallLabel}>Boarding Point</Text>
          <Text style={styles.value}>{boardingPoint}</Text>
          <Text style={styles.subValue}>{boardingTime}</Text>
        </View>

        <View>
          <Text style={styles.smallLabel}>Dropping Point</Text>
          <Text style={styles.value}>{droppingPoint}</Text>
          <Text style={styles.subValue}>{droppingTime}</Text>
        </View>
      </View>

      {/* Passenger */}
      <View style={styles.row}>
        <View>
          <Text style={styles.smallLabel}>Passenger</Text>
          <Text style={styles.value}>{passengerName}</Text>
          <Text style={styles.subValue}>{gender} {age} years</Text>
        </View>

        <View>
          <Text style={styles.smallLabel}>Seat</Text>
          <Text style={styles.seat}>{seat}</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.cancelBtn} 
          onPress={() => onCancel && onCancel(booking)}
        >
          <Text style={styles.buttonText}>Cancel Ticket</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resellBtn}
          onPress={() => onResell && onResell(booking)}
        >
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
