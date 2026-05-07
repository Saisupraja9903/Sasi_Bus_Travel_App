import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import BusDetailsBottomSheet from "./BusDetailsBottomSheet";
import AppModal from "./AppModal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STATUS = {
  AVAILABLE: "available",
  SOLD: "sold",
};

const GENDER = {
  MALE: "male",
  FEMALE: "female",
};

/* -------------------------------------- */
/* Seat layout                            */
/* -------------------------------------- */

const initialLayout = {
  lower: [
    [
      { id: "L1", status: STATUS.SOLD },
      { id: "L2", status: STATUS.SOLD },
      { id: "L3", status: STATUS.SOLD },
    ],
    [
      {
        id: "L4",
        status: STATUS.AVAILABLE,
        gender: GENDER.FEMALE,
        price: 1099,
      },
      { id: "L5", status: STATUS.AVAILABLE, price: 1299 },
      {
        id: "L6",
        status: STATUS.AVAILABLE,
        gender: GENDER.FEMALE,
        price: 1099,
      },
    ],
    [
      { id: "L7", status: STATUS.SOLD },
      { id: "L8", status: STATUS.SOLD },
      { id: "L9", status: STATUS.SOLD },
    ],
    [
      { id: "L10", status: STATUS.AVAILABLE, price: 1299 },
      { id: "L11", status: STATUS.AVAILABLE, gender: GENDER.MALE, price: 1099 },
      { id: "L12", status: STATUS.AVAILABLE, price: 1099 },
    ],
    [
      { id: "L13", status: STATUS.AVAILABLE, price: 1099 },
      {
        id: "L14",
        status: STATUS.AVAILABLE,
        gender: GENDER.FEMALE,
        price: 1099,
      },
      { id: "L15", status: STATUS.AVAILABLE, price: 1099 },
    ],
    [
      { id: "L16", status: STATUS.SOLD },
      { id: "L17", status: STATUS.SOLD },
      { id: "L18", status: STATUS.SOLD },
    ],
  ],

  upper: [
    [
      { id: "U1", status: STATUS.SOLD },
      { id: "U2", status: STATUS.SOLD },
      { id: "U3", status: STATUS.SOLD },
    ],
    [
      {
        id: "U4",
        status: STATUS.AVAILABLE,
        gender: GENDER.FEMALE,
        price: 1099,
      },
      { id: "U5", status: STATUS.AVAILABLE, price: 1299 },
      {
        id: "U6",
        status: STATUS.AVAILABLE,
        gender: GENDER.FEMALE,
        price: 1099,
      },
    ],
    [
      { id: "U7", status: STATUS.SOLD },
      { id: "U8", status: STATUS.SOLD },
      { id: "U9", status: STATUS.SOLD },
    ],
    [
      { id: "U10", status: STATUS.AVAILABLE, price: 1299 },
      { id: "U11", status: STATUS.AVAILABLE, gender: GENDER.MALE, price: 1099 },
      { id: "U12", status: STATUS.AVAILABLE, price: 1099 },
    ],
    [
      { id: "U13", status: STATUS.AVAILABLE, price: 1099 },
      {
        id: "U14",
        status: STATUS.AVAILABLE,
        gender: GENDER.FEMALE,
        price: 1099,
      },
      { id: "U15", status: STATUS.AVAILABLE, price: 1099 },
    ],
    [
      { id: "U16", status: STATUS.SOLD },
      { id: "U17", status: STATUS.SOLD },
      { id: "U18", status: STATUS.SOLD },
    ],
  ],
};

/* -------------------------------------- */
/* Helper to determine seat colors        */
/* -------------------------------------- */

function Seat({ seat, selected, onPress }) {
  const isSold = seat.status === STATUS.SOLD;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(bounceAnim, {
      toValue: selected ? 1.08 : 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  let borderColor = "#43A047";
  let lineColor = "#4CAF50";

  if (seat.gender === GENDER.MALE) {
    borderColor = "#0070FF";
    lineColor = "#2196F3";
  }

  if (seat.gender === GENDER.FEMALE) {
    borderColor = "#E82DAD";
    lineColor = "#E82DAD";
  }

  if (isSold) {
    borderColor = "#CFCFCF";
    lineColor = "#FFFFFF";
  }

  return (
    <Animated.View
      style={[styles.seatWrapper, { transform: [{ scale: bounceAnim }] }]}
    >
      <TouchableOpacity
        style={[
          styles.seat,
          { borderColor },
          isSold && styles.soldSeat,
          selected && styles.selectedSeat,
        ]}
        activeOpacity={isSold ? 1 : 0.7}
        onPress={() => !isSold && onPress(seat)}
      >
        {seat.gender === GENDER.MALE && (
          <MaterialCommunityIcons 
            name="human-male" 
            size={40} 
            color={selected ? "#2F80ED" : "#2196F3"} 
          />
        )}

        {seat.gender === GENDER.FEMALE && (
          <MaterialCommunityIcons
            name="human-female"
            size={40}
            color={selected ? "#2F80ED" : "#E82DAD"}
          />
        )}

        <View style={[styles.bottomIndicator, { backgroundColor: lineColor }]}>
          <View style={styles.innerLine} />
        </View>
      </TouchableOpacity>

      {seat.status === STATUS.SOLD ? (
        <Text style={styles.soldText}>Sold</Text>
      ) : (
        seat.price && <Text style={styles.priceText}>₹ {seat.price}</Text>
      )}
    </Animated.View>
  );
}

export default function SeatSelectionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bus, date, preSelectedSeatId } = route.params || {};
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(preSelectedSeatId ? [preSelectedSeatId] : []);
  const insets = useSafeAreaInsets();

  const buttonAnim = useRef(new Animated.Value(0)).current;

  const totalPrice = useMemo(() => {
    const all = [...initialLayout.lower.flat(), ...initialLayout.upper.flat()];
    return selectedSeats.reduce((acc, id) => {
      const seat = all.find((s) => s.id === id);
      return acc + (seat?.price || 0);
    }, 0);
  }, [selectedSeats]);

  useEffect(() => {
    Animated.spring(buttonAnim, {
      toValue: selectedSeats.length > 0 ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [selectedSeats.length > 0]);

  const toggleSeat = (seat) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedSeats((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((s) => s !== seat.id);
      }
      if (prev.length >= 6) {
        setShowLimitModal(true);
        return prev;
      }
      return [...prev, seat.id];
    });
  };

  const renderSection = (title, rows) => (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.lowerTitle}>{title}</Text>

        {title === "LOWER" && (
          <MaterialCommunityIcons
            name="steering"
            size={24}
            style={styles.steeringIcon}
          />
        )}
      </View>

      <View style={styles.sectionDivider} />

      <View style={styles.cardBody}>
        {/* double seats */}

        <View>
          {rows.map((row, i) => (
            <View key={i} style={styles.doubleRow}>
              <Seat
                seat={row[1]}
                selected={selectedSeats.includes(row[1].id)}
                onPress={toggleSeat}
              />

              <Seat
                seat={row[2]}
                selected={selectedSeats.includes(row[2].id)}
                onPress={toggleSeat}
              />
            </View>
          ))}
        </View>

        {/* single seat */}

        <View>
          {rows.map((row) => (
            <Seat
              key={row[0].id}
              seat={row[0]}
              selected={selectedSeats.includes(row[0].id)}
              onPress={toggleSeat}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Seat Selection</Text>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#43A047" }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#2196F3" }]} />
          <Text style={styles.legendText}>Male</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#E82DAD" }]} />
          <Text style={styles.legendText}>Female</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#CFCFCF" }]} />
          <Text style={styles.legendText}>Sold</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.mapContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.layoutRow}>
          {renderSection("LOWER", initialLayout.lower)}
          {renderSection("UPPER", initialLayout.upper)}
        </View>
      </ScrollView>

      {/* BUS DETAILS BOTTOM SHEET */}
      <BusDetailsBottomSheet bus={bus} />

      {/* PROCEED BUTTON - Animated Slide Up */}
      <Animated.View 
        pointerEvents={selectedSeats.length > 0 ? "auto" : "none"}
        style={[
          styles.bottomWrapperOverlay, 
          { 
            paddingBottom: Math.max(insets.bottom, 20),
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          }
        ]}
      >
        <View style={styles.divider} />
        <View style={styles.bottomContent}>
          <View>
            <Text style={styles.selectedLabel}>{selectedSeats.join(", ")}</Text>
            <Text style={styles.selectedSeats}>
              <Text style={styles.totalHighlight}>Total: ₹</Text>
              {totalPrice}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.proceedBtn, selectedSeats.length === 0 && styles.proceedBtnDisabled]}
            disabled={selectedSeats.length === 0}
            onPress={() => navigation.navigate("BoardingDroppingScreen", { selectedSeats, bus, date })}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <AppModal
        visible={showLimitModal}
        title="Seat Limit Reached"
        message="For safety and convenience, you can only select a maximum of 6 seats per booking."
        type="error"
        onConfirm={() => setShowLimitModal(false)}
      />
    </SafeAreaView>
  );
}

/* -------------------------------------- */
/* Styles                                 */
/* -------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bottomIndicator: {
    position: "absolute",
    bottom: 6,
    alignSelf: "center",
    width: 20,
    height: 3, // ↓ reduced thickness
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  innerLine: {
    width: 18,
    height: 1,
    backgroundColor: "#fff",
    borderRadius: 2,
  },

  title: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "600",
  },

  mapContainer: {
    paddingHorizontal: wp("4%"),
    paddingTop: 11,
    paddingBottom: hp("42%"), // Dynamic padding to scroll past bottom sheet + proceed button
  },

  layoutRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp("5%"), // Flexible spacing between Lower and Upper sections
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  lowerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  steeringIcon: {
    color: "#BDBDBD",
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 10,
  },

  card: {
    width: wp("43.5%"), // Proportional width for consistency
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: wp("3.5%"),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  sectionTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 16,
  },

  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  doubleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp("26%"), // Responsive width for double seat blocks
    gap: wp("2%"),
  },

  seatWrapper: {
    alignItems: "center",
    marginBottom: 15, // Changed from hp to fixed to stop compression
  },

  seat: {
    width: wp("10.5%"),
    height: wp("24%"), // Long rectangular ratio for sleeper comfort
    borderWidth: 1.0,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  soldSeat: {
    backgroundColor: "#EAEAEA",
  },
  soldText: {
    fontSize: 11,
    marginTop: 6,
    color: "#9E9E9E",
    fontWeight: "500",
  },

  selectedSeat: {
    borderColor: "#2F80ED",
    borderWidth: 2.5,
    elevation: 8,
    shadowColor: "#2F80ED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  priceText: {
    fontSize: 12,
    marginTop: 6,
    color: "#333",
    fontWeight: "700",
  },

  bottomWrapperOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 1000, 
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  bottomWrapper: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginBottom: 8,
  },

  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectedLabel: {
    fontSize: 14,
    color: "#777",
    fontWeight: "700",
    letterSpacing: 1,
  },

  selectedSeats: {
    fontSize: 18,
    marginTop: 4,
    fontWeight: "700",
  },
  totalHighlight: {
    color: "#2F80ED",
  },

  proceedBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  proceedBtnDisabled: {
    backgroundColor: "#A9A9A9",
  },

  proceedText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  legendItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },

  legendDot: {
    width: 18,
    height: 18,
    borderRadius: 10,
    marginBottom: 4,
  },

  legendText: {
    fontSize: 12,
    color: "#444",
  },
});
