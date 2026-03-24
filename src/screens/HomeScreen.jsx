import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Footer from "../components/Footer";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";

const HOME_IMAGES = {
  OFFER_1: require("../../assets/offer1.png"),
  OFFER_3: require("../../assets/offer3.png"),
  OFFER_4: require("../../assets/offer4.png"),
  AXIS_LOGO: require("../../assets/axislogo.png"),
  HDFC_LOGO: require("../../assets/HDFClogo.png"),
};
export default function HomeScreen({ navigation, route }) {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  const [fromLocation, setFromLocation] = useState("Hyderabad, Telangana");
  const [toLocation, setToLocation] = useState("Kakinada, Andhra pradesh");

  // update location if returned from search
  useEffect(() => {
    const params = route?.params;
    if (params?.selectedCity) {
      if (params.type === "from") setFromLocation(params.selectedCity);
      else if (params.type === "to") setToLocation(params.selectedCity);
      // clear to avoid re‑triggering
      navigation.setParams({ selectedCity: undefined, type: undefined });
    }
  }, [route?.params]);

  // Date & Person State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(new Date()); // For calendar navigation
  const [seatType, setSeatType] = useState("seater");
  const [showSeatDropdown, setShowSeatDropdown] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDate = (date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + offset,
      1,
    );
    setDisplayMonth(newDate);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <View style={styles.profileCircle}>
              <Ionicons name="person" size={22} color="#2F80ED" />
            </View>

            <View>
              <Text style={styles.welcome}>Welcome,</Text>
              <Text style={styles.name}>Lokesh Naidu</Text>
            </View>
          </View>

          <MaterialIcons
            name="menu"
            size={26}
            color="#333"
            style={styles.menu}
          />
        </View>

        {/* SEARCH CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>Find a route,</Text>
          <Text style={styles.title}>Let’s make a journey.</Text>

          <View style={styles.locationContainer}>
            {/* FROM */}
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() =>
                navigation.navigate("CitySearch", {
                  currentLocation: fromLocation,
                  type: "from",
                })
              }
            >
              <FontAwesome5
                name="bus"
                size={18}
                color="#2F80ED"
                style={styles.inputIcon}
              />
              <View>
                <Text style={styles.label}>From</Text>
                <Text style={styles.inputText}>{fromLocation}</Text>
              </View>
            </TouchableOpacity>

            {/* TO */}
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() =>
                navigation.navigate("CitySearch", {
                  currentLocation: toLocation,
                  type: "to",
                })
              }
            >
              <FontAwesome5
                name="bus"
                size={18}
                color="#2F80ED"
                style={styles.inputIcon}
              />
              <View>
                <Text style={styles.label}>To</Text>
                <Text style={styles.inputText}>{toLocation}</Text>
              </View>
            </TouchableOpacity>

            {/* SWAP BUTTON */}
            <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
              <MaterialIcons name="swap-vert" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* DATE + PERSON */}
          <View style={[styles.row, { zIndex: 10 }]}>
            <TouchableOpacity
              style={styles.smallBox}
              onPress={() => {
                setDisplayMonth(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    1,
                  ),
                );
                setShowCalendar(true);
              }}
            >
              <MaterialIcons
                name="calendar-month"
                size={20}
                color="#2F80ED"
                style={styles.smallIcon}
              />
              <Text style={styles.smallText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>

            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.dropdownButton}
                activeOpacity={0.8}
                onPress={() => setShowSeatDropdown(!showSeatDropdown)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name={seatType === "seater" ? "chair" : "hotel"}
                    size={20}
                    color="#2F80ED"
                    style={styles.smallIcon}
                  />
                  <Text style={styles.smallText}>
                    {seatType === "seater" ? "Seater" : "Sleeper"}
                  </Text>
                </View>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#777" />
              </TouchableOpacity>

              {showSeatDropdown && (
                <>
                  <TouchableOpacity
                    style={styles.dropdownOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSeatDropdown(false)}
                  />
                  <View style={styles.dropdownList}>
                  {["seater", "sleeper"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.dropdownItem, seatType === type && styles.dropdownItemActive]}
                      onPress={() => {
                        setSeatType(type);
                        setShowSeatDropdown(false);
                      }}
                    >
                      <MaterialIcons name={type === "seater" ? "chair" : "hotel"} size={18} color={seatType === type ? "#2F80ED" : "#555"} />
                      <Text style={[styles.dropdownItemText, seatType === type && styles.dropdownItemTextActive]}>{type === "seater" ? "Seater" : "Sleeper"}</Text>
                    </TouchableOpacity>
                  ))}
                  </View>
                </>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() =>
              navigation.navigate("BusResults", {
                from: fromLocation,
                to: toLocation,
                date: selectedDate.toISOString(),
                seatType,
              })
            }
          >
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* OFFERS */}
        <Text style={styles.offersTitle}>Offers For You</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offerScroll}
        >
          <View style={styles.offerCard}>
            <Image
              source={HOME_IMAGES.OFFER_1}
              style={styles.offerImage}
              resizeMode="cover"
            />
            <Text style={styles.offerText}>Exclusive Festive Offer</Text>

            <View style={styles.couponBox}>
              <Text style={styles.couponText}>Coupon code: MARVAC13</Text>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => {
                  Clipboard.setString("MARVAC13");
                  Alert.alert("Copied to clipboard");
                }}
              >
                <MaterialIcons name="content-copy" size={16} color="#2F80ED" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.offerCard}>
            <Image
              source={HOME_IMAGES.OFFER_3}
              style={styles.offerImage}
              resizeMode="cover"
            />
            <Text style={styles.offerText}>10% Discount on First Booking</Text>

            <View style={styles.couponBox}>
              <Text style={styles.couponText}>Coupon code: MARVAC13</Text>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => {
                  Clipboard.setString("MARVAC13");
                  Alert.alert("Copied to clipboard");
                }}
              >
                <MaterialIcons name="content-copy" size={16} color="#2F80ED" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.offerCard}>
            <Image
              source={HOME_IMAGES.OFFER_4}
              style={styles.offerImage}
              resizeMode="cover"
            />
            <Text style={styles.offerText}>
              Save upto ₹500 on Mythi Travels
            </Text>

            <View style={styles.couponBox}>
              <Text style={styles.couponText}>Coupon code: MYTHRI13</Text>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => {
                  Clipboard.setString("MYTHRI13");
                  Alert.alert("Copied to clipboard");
                }}
              >
                <MaterialIcons name="content-copy" size={16} color="#2F80ED" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* PAYMENT OFFERS */}
        {/* PAYMENT OFFERS */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentTitle}>Payment Offers</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.paymentScroll}
          >
            <View style={styles.paymentCard}>
              <Image source={HOME_IMAGES.AXIS_LOGO} style={styles.bankLogo} />

              <Text style={styles.paymentDesc}>
                Save upto Rs 500 with Axis Bank Credit Cards
              </Text>

              <TouchableOpacity style={styles.paymentCoupon}>
                <Text style={styles.paymentCouponText}>AXIS120D</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.paymentCard}>
              <Image source={HOME_IMAGES.HDFC_LOGO} style={styles.bankLogo} />

              <Text style={styles.paymentDesc}>
                Save upto Rs 200 with HDFC Bank Credit Cards
              </Text>

              <TouchableOpacity style={styles.paymentCoupon}>
                <Text style={styles.paymentCouponText}>AXIS120D</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* CALENDAR MODAL */}
      <Modal transparent={true} visible={showCalendar} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>

            {/* Month Navigation */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                style={styles.navBtn}
                disabled={
                  displayMonth.getFullYear() === today.getFullYear() &&
                  displayMonth.getMonth() === today.getMonth()
                }
              >
                <MaterialIcons
                  name="chevron-left"
                  size={30}
                  color={displayMonth.getFullYear() === today.getFullYear() && displayMonth.getMonth() === today.getMonth() ? "#ccc" : "#333"}
                />
              </TouchableOpacity>
              <Text style={styles.monthText}>
                {displayMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <TouchableOpacity
                onPress={() => changeMonth(1)}
                style={styles.navBtn}
              >
                <MaterialIcons name="chevron-right" size={30} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Days Grid */}
            <View style={styles.calendarGrid}>
              {Array.from(
                {
                  length: getDaysInMonth(
                    displayMonth.getFullYear(),
                    displayMonth.getMonth(),
                  ),
                },
                (_, i) => i + 1,
              ).map((day) => {
                const currentDate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
                const isPastDate = currentDate < today;
                const isToday =
                  today.getDate() === day &&
                  today.getMonth() === displayMonth.getMonth() &&
                  today.getFullYear() === displayMonth.getFullYear();
                const isSelected =
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === displayMonth.getMonth() &&
                  selectedDate.getFullYear() === displayMonth.getFullYear();
                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.calendarDay,
                      isToday && !isSelected && styles.todayDay,
                      isSelected && styles.selectedDay,
                    ]}
                    disabled={isPastDate}
                    onPress={() => {
                      setSelectedDate(currentDate);
                      setShowCalendar(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        isToday && !isSelected && styles.todayDayText,
                        isSelected && styles.selectedDayText,
                        isPastDate && styles.disabledDayText,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FOOTER */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 16,
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  userIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },

  welcome: {
    color: "black",
    fontSize: 22,
    fontFamily: "Poppins_400bold",
    fontWeight: "500",
  },

  name: {
    color: "#2F80ED",
    fontSize: 13,
    fontFamily: "Poppins_400bold",
    fontWeight: "500",
  },

  menu: {
    width: 24,
    height: 24,
    marginRight: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
    minHeight: 300,
    // Works for React Native Web
    boxShadow: "0px 0px 12px rgba(0,0,0,0.10)",
    marginHorizontal: 12, // gives space for shadow
    elevation: 8,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  locationContainer: {
    position: "relative",
  },

  inputBox: {
    backgroundColor: "#F2F2F2",
    padding: 8,
    borderRadius: 14,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  label: {
    fontSize: 12,
    color: "#9E9E9E",
  },

  inputText: {
    fontSize: 15,
    color: "#333",
    outlineWidth: 0, // removes focus border
    outlineStyle: "none", // removes web outline
  },

  swapButton: {
    position: "absolute",
    right: 8,
    top: 46,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2F80ED",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  smallBox: {
    backgroundColor: "#F2F2F2",
    padding: 12,
    borderRadius: 12,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  smallIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },

  smallText: {
    fontSize: 14,
  },
  dropdownWrapper: {
    width: "48%",
    position: "relative",
  },
  dropdownButton: {
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownList: {
    position: "absolute",
    top: "110%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: "#EBF3FF",
  },
  dropdownItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  dropdownItemTextActive: {
    color: "#2F80ED",
    fontWeight: "600",
  },
  dropdownOverlay: {
    position: "absolute",
    top: -Dimensions.get("window").height,
    bottom: -Dimensions.get("window").height,
    left: -Dimensions.get("window").width,
    right: -Dimensions.get("window").width,
    backgroundColor: "transparent",
    zIndex: 999,
  },

  searchButton: {
    backgroundColor: "#2F80ED",
    padding: 15,
    borderRadius: 12,
    marginTop: 16,
  },

  searchText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  offersTitle: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: "700",
    color: "#555",
    marginLeft: 20,
    marginBottom: 10,
  },

  offerImage: {
    width: 170,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
    marginTop: 10,
  },

  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  paymentBox: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  paymentLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },

  paymentText: {
    flex: 1,
    fontSize: 12,
    color: "#555",
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 20,

    boxShadow: "0px 4px 6px rgba(0,0,0,0.25)",
    elevation: 8,
  },

  profileIcon: {
    width: 22,
    height: 22,
  },

  offerScroll: {
    paddingLeft: 5,
    paddingRight: 10,
  },

  offerCard: {
    width: 245,
    height: 180,
    marginRight: 14,
    borderRadius: 15,
    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
    overflow: "visible",
  },

  offerImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  offerText: {
    position: "absolute",
    top: 10,
    left: 10,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    width: 140,
  },

  couponBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 12,

    borderWidth: 1,
    borderColor: "#E6E6E6",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  copyText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },

  couponText: {
    flex: 1,
    fontSize: 12,
    color: "#2F80ED",
    fontWeight: "600",
    marginRight: 6,
  },

  copyBtn: {
    marginTop: 0,
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 8,
  },

  paymentTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginTop: 40,
    marginBottom: 10,
    color: "#333",
  },

  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  bankLogo: {
    width: 100,
    height: 20,
    marginBottom: 8,
  },

  paymentDesc: {
    fontSize: 13,
    color: "#444",
    marginBottom: 10,
  },

  paymentCoupon: {
    alignSelf: "flex-end",
    backgroundColor: "#2F80ED",
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
  },

  paymentCouponText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  paymentScroll: {
    paddingLeft: 15,
    paddingRight: 10,
  },

  paymentCard: {
    width: 300,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginRight: 15,

    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  calendarDay: {
    width: "14.28%", // 7 days in a row
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  selectedDay: {
    backgroundColor: "#2F80ED",
    borderRadius: 20,
  },
  calendarDayText: {
    color: "#333",
    fontSize: 14,
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledDayText: {
    color: "#ccc",
  },
  todayDay: {
    borderWidth: 1,
    borderColor: "#2F80ED",
    borderRadius: 20,
  },
  todayDayText: {
    color: "#2F80ED",
    fontWeight: "bold",
  },
  closeModalBtn: {
    paddingVertical: 10,
  },
  closeModalText: {
    color: "#FF4D4D",
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  counterBtn: {
    backgroundColor: "#F2F2F2",
    padding: 10,
    borderRadius: 10,
  },
  counterValue: {
    fontSize: 24,
    fontWeight: "600",
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: "center",
  },
  confirmBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
