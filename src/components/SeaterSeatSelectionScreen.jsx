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

import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
import { useState, useRef, useEffect, useMemo } from "react";

import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import BusDetailsBottomSheet from "./BusDetailsBottomSheet";
import AppModal from "./AppModal";

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
/* Seat Component                         */
/* -------------------------------------- */

function SeatSvg({ color = "#325DE9", opacity = 1 }) {
  return (
    <Svg width={40} height={70} viewBox="0 0 26 27" fill="none">
      <Defs>
        <ClipPath id="clip1">
          <Rect width="26" height="26" fill="white" y="0.5" />
        </ClipPath>
      </Defs>

      <G clipPath="url(#clip1)">
        <Path
          d="M22.9937 9.51864H23.1562V4.72489C23.1562 2.77489 21.6124 1.23114 19.6624 1.23114H6.3374C4.3874 1.23114 2.84365 2.77489 2.84365 4.72489V9.51864C1.6249 9.59989 0.649902 10.5749 0.649902 11.7936V22.2749C0.649902 24.2249 2.19365 25.7686 4.14365 25.7686H21.7749C23.7249 25.7686 25.2687 24.2249 25.2687 22.2749V11.8749C25.3499 10.5749 24.2937 9.51864 22.9937 9.51864Z"
          fill="#FFFFFF"
          opacity={opacity}
        />

        <Path
          d="M2.84395 9.51877V4.40002C2.84395 2.61252 4.30644 1.15002 6.09394 1.15002H19.9064C21.6939 1.15002 23.1564 2.61252 23.1564 4.40002V9.51877M22.9939 9.51877H22.2627C21.6127 9.51877 21.1252 10.0875 21.1252 10.6563V17.725C21.1252 19.675 19.5814 21.2188 17.6314 21.2188H8.45019C6.50019 21.2188 4.95644 19.675 4.95644 17.725V10.6563C4.95644 10.0063 4.46894 9.51877 3.81894 9.51877H3.00645C1.70645 9.51877 0.731445 10.575 0.731445 11.7938V22.5188C0.731445 24.3063 2.19395 25.7688 3.98145 25.7688H22.1002C23.8877 25.7688 25.3502 24.3063 25.3502 22.5188V11.875C25.3502 10.575 24.2939 9.51877 22.9939 9.51877Z"
          stroke={color}
          strokeWidth={1.5}
        />

        <G opacity={0.7}>
          <Path
            d="M14.2501 8.12509H11.7501C11.0626 8.12509 10.5001 8.68759 10.5001 9.37509V13.1251H11.7501V17.5001H14.2501V13.1251H15.5001V9.37509C15.5001 8.68759 14.9376 8.12509 14.2501 8.12509Z"
            fill={color}
          />
          <Path
            d="M13.0001 7.50009C13.6904 7.50009 14.2501 6.94045 14.2501 6.25009C14.2501 5.55974 13.6904 5.00009 13.0001 5.00009C12.3097 5.00009 11.7501 5.55974 11.7501 6.25009C11.7501 6.94045 12.3097 7.50009 13.0001 7.50009Z"
            fill={color}
          />
        </G>
      </G>
    </Svg>
  );
}

function Seat({ seat, selected, onPress, isLowerDouble }) {
  const isSold = seat.status === STATUS.SOLD;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(bounceAnim, {
      toValue: selected ? 1.1 : 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  /* 👉 IMAGE ONLY FOR LOWER DOUBLE */
  if (isLowerDouble) {
    return (
      <Animated.View
        style={[
          styles.seatWrapper,
          isLowerDouble && styles.lowerDoubleWrapper,
          { transform: [{ scale: bounceAnim }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={isSold ? 1 : 0.7}
          onPress={() => !isSold && onPress(seat)}
          style={[selected && styles.selectedSeatImage]}
        >
          <SeatSvg
            color={
              isSold
                ? "#CFCFCF"
                : selected
                  ? "#2F80ED"
                  : seat.gender === GENDER.FEMALE
                    ? "#E82DAD"
                    : seat.gender === GENDER.MALE
                      ? "#0070FF"
                      : "#43A047"
            }
            opacity={isSold ? 0.5 : 1}
          />
        </TouchableOpacity>

        {isSold ? (
          <Text
            style={[
              styles.soldText,
              isLowerDouble && styles.lowerText, // ✅ added
            ]}
          >
            Sold
          </Text>
        ) : (
          <Text
            style={[
              styles.priceText,
              isLowerDouble && styles.lowerText, // ✅ added
            ]}
          >
            ₹ {seat.price}
          </Text>
        )}
      </Animated.View>
    );
  }

  /* 👉 DEFAULT SEATS */

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
            size={36}
            color={selected ? "#2F80ED" : "#2196F3"}
            style={{ marginTop: 6 }} // ✅ pushes to center
          />
        )}

        {seat.gender === GENDER.FEMALE && (
          <MaterialCommunityIcons
            name="human-female"
            size={36}
            color={selected ? "#2F80ED" : "#E82DAD"}
            style={{ marginTop: 6 }} // ✅ center fix
          />
        )}

        {!selected && (
          <View style={[styles.bottomIndicator, { backgroundColor: lineColor }]}>
            <View style={styles.innerLine} />
          </View>
        )}
      </TouchableOpacity>

      {isSold ? (
        <Text style={styles.soldText}>Sold</Text>
      ) : (
        <Text style={styles.priceText}>₹ {seat.price}</Text>
      )}
    </Animated.View>
  );
}

/* -------------------------------------- */
/* Seat Layout                            */
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
/* MAIN SCREEN                            */
/* -------------------------------------- */

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
    Animated.timing(buttonAnim, {
      toValue: selectedSeats.length > 0 ? 1 : 0,
      duration: 600, // Slow slide animation
      useNativeDriver: true,
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
    <View style={styles.sectionCard}>
      <View style={styles.sectionTop}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {title === "LOWER" && (
          <MaterialCommunityIcons name="steering" size={18} color="#777" />
        )}
      </View>

      <View style={styles.sectionDivider} />

      <View style={styles.cardBody}>
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

        <View>
          {rows.map((row, i) => (
            <View key={i} style={styles.doubleRow}>
              <Seat
                seat={row[1]}
                selected={selectedSeats.includes(row[1].id)}
                onPress={toggleSeat}
                isLowerDouble={title === "LOWER"}
              />

              <Seat
                seat={row[2]}
                selected={selectedSeats.includes(row[2].id)}
                onPress={toggleSeat}
                isLowerDouble={title === "LOWER"}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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

      <ScrollView contentContainerStyle={styles.mapContainer}>
        <View style={styles.mainWrapper}>
          {renderSection("LOWER", initialLayout.lower)}
          {renderSection("UPPER", initialLayout.upper)}
        </View>
      </ScrollView>

      {/* BUS DETAILS BOTTOM SHEET */}
      <BusDetailsBottomSheet bus={bus} />

      {/* PROCEED BUTTON - Always visible */}
      <Animated.View
        pointerEvents={selectedSeats.length > 0 ? "auto" : "none"}
        style={[
          styles.bottomWrapperOverlay,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [150, 0],
                }),
              },
            ],
          }
        ]}
      >
        <View style={styles.bottomDivider} />
        <View style={styles.bottomContent}>
          <View>
            <Text style={styles.selectedLabel}>{selectedSeats.join(", ")}</Text>
            <Text style={styles.selectedSeats}>
              <Text style={styles.totalHighlight}>Total: ₹</Text>
              {totalPrice}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.proceedBtn,
              selectedSeats.length === 0 && styles.disabledBtn,
            ]}
            disabled={selectedSeats.length === 0}
            onPress={() => {
              navigation.navigate("BoardingDroppingScreen", {
                selectedSeats,
                bus,
                date,
              });
            }}
          >
            <Text
              style={[styles.proceedText, selectedSeats.length === 0 && styles.disabledText]}
            >
              Proceed
            </Text>
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
/* STYLES                                 */
/* -------------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  title: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "600",
  },

  mapContainer: { paddingTop: 5 },

  mainWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 10,
  },

  sectionCard: {
    width: 165,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    elevation: 2,
  },

  sectionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginBottom: 10,
  },

  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  doubleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 79, // ✅ reduced from 80
    gap: 3, // ✅ added for better spacing
  },

  seatWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },

  lowerDoubleWrapper: {
    marginBottom: 4, // ✅ reduced spacing
  },

  seatImage: {
    width: 40,
    height: 70,
    resizeMode: "contain",
  },

  selectedSeatImage: {
    borderColor: "#2F80ED",
    borderWidth: 2,
    borderRadius: 8,
  },
  seat: {
    width: 37,
    height: 63,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  soldSeat: { backgroundColor: "#EAEAEA" },

  selectedSeat: {
    borderColor: "#2F80ED",
    borderWidth: 2.5,
  },

  bottomIndicator: {
    position: "absolute",
    bottom: 6,
    width: 20,
    height: 3,
  },

  innerLine: {
    width: 18,
    height: 1,
    backgroundColor: "#fff",
  },

  priceText: { fontSize: 12, marginTop: 6, fontWeight: "700", color: "#222" },
  soldText: { fontSize: 12, marginTop: 6, color: "#999" },

  bottomWrapperOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 1000, // Very high to stay above sheet
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  lowerText: {
    marginTop: 2, // ✅ reduced from 6
  },

  bottomWrapper: { padding: 16 },

  bottomDivider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginBottom: 10,
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

  proceedText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  disabledBtn: {
    backgroundColor: "#CFCFCF", // gray color
  },
  disabledText: {
    color: "#888",
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
