import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  TextInput,
  LayoutAnimation,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "../components/Footer";
import { IMAGES } from "../constants/images";
import AppModal from "../components/AppModal";

export default function BookingScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [refreshing, setRefreshing] = useState(false);
  const [marketplaceTab, setMarketplaceTab] = useState("Browse");
  const [marketAlerts, setMarketAlerts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------------- STATEFUL DATA ---------------- */
  const [allBookings, setAllBookings] = useState({
    Upcoming: [
      {
        id: "BK88294710",
        route: "Hyderabad ➜ Bangalore",
        from: "Hyderabad\n13 Mar 26(18:00pm)",
        to: "Bangalore\n14 Mar 26(06:00am)",
        travels: "Sasi Travels",
        pnr: "PNR294710",
        source: "Hyderabad",
        destination: "Bangalore",
      },
      {
        id: "BK88294711",
        route: "Hyderabad ➜ Kakinada",
        from: "Hyderabad\n15 Mar 26(18:00pm)",
        to: "Kakinada\n16 Mar 26(06:00am)",
        travels: "DMR Travels",
        pnr: "PNR294711",
        source: "Hyderabad",
        destination: "Kakinada",
      },
    ],
    Completed: [
      {
        id: "BK566H88UJI",
        route: "Hyderabad ➜ Kakinada",
        travels: "Saman Travels",
        bookingId: "VD566H88UJI",
        time: "Mon 06 Oct 2025 at 19:55",
        source: "Hyderabad",
        destination: "Kakinada",
      },
    ],
    Unsuccessful: [
      {
        id: "BK130126",
        route: "Hyderabad ➜ Bangalore",
        date: "13 Jan 2026, 22:00",
        travels: "DMR Travels",
        source: "Hyderabad",
        destination: "Bangalore",
      },
    ],
    Marketplace: [
      {
        id: "RS990011",
        route: "Bangalore ➜ Hyderabad",
        from: "Bangalore\n20 Mar 26(22:00pm)",
        to: "Hyderabad\n21 Mar 26(08:00am)",
        travels: "Kaveri Travels",
        price: 1200,
        originalPrice: 1500,
        seat: "L15",
        busType: "A/c Sleeper (2+1)",
        source: "Bangalore",
        destination: "Hyderabad",
      },
    ],
    MyListings: [
      {
        id: "ML772233",
        route: "Hyderabad ➜ Kakinada",
        from: "Hyderabad\n18 Mar 26(21:00pm)",
        to: "Kakinada\n19 Mar 26(06:00am)",
        travels: "Sasi Travels",
        price: 900,
        originalPrice: 1100,
        seat: "U4",
        busType: "A/c Sleeper (2+1)",
        status: "Active",
        source: "Hyderabad",
        destination: "Kakinada",
      },
    ],
  });

  // Notification Modal State
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  const handleToggleAlerts = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newState = !marketAlerts;
    setMarketAlerts(newState);
    if (newState) setAlertModalVisible(true);
  }, [marketAlerts]);

  /* ---------------- NAVIGATION PARAMS HANDLER ---------------- */
  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
      if (route.params.subTab) {
        setMarketplaceTab(route.params.subTab);
      }
    }
  }, [route.params]);

  /* ---------------- TAB DATA ---------------- */
  const bookings = useMemo(() => {
    let list = activeTab === "Marketplace" 
      ? (marketplaceTab === "Browse" ? allBookings.Marketplace : allBookings.MyListings)
      : (allBookings[activeTab] || []);

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter((item) => 
      item.route.toLowerCase().includes(query) ||
      (item.pnr && item.pnr.toLowerCase().includes(query)) ||
      (item.bookingId && item.bookingId.toLowerCase().includes(query)) ||
      (item.id && item.id.toLowerCase().includes(query))
    );
  }, [activeTab, marketplaceTab, allBookings, searchQuery]);

  /* ---------------- HANDLERS ---------------- */
  const handleViewDetails = useCallback((item) => {
    navigation.navigate("BookingDetails", { booking: item });
  }, [navigation]);

  const handleBookAgain = useCallback((item) => {
    // Pass the route details back to Home to pre-fill search
    navigation.navigate("Home", { 
      selectedCity: item.destination, 
      type: "to",
      fromCity: item.source 
    });
  }, [navigation]);

  const handleRetryPayment = useCallback((item) => {
    // Navigate to search results for that route to try again
    navigation.navigate("BusResults", { from: item.source, to: item.destination });
  }, [navigation]);

  const handleBuyTicket = useCallback((item) => {
    // Mock navigation to checkout/payment for the resold ticket
    const seatType = item.busType.toLowerCase().includes("sleeper") ? "sleeper" : "seater";
    
    // Production-level safe date parsing
    const monthsMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    let travelDate = new Date();
    try {
      const departureDatePart = item.from.split('\n')[1].split('(')[0].trim(); // "18 Mar 26"
      const [day, monthStr, yearShort] = departureDatePart.split(' ');
      const year = parseInt(yearShort);
      const fullYear = year < 100 ? 2000 + year : year;
      travelDate = new Date(fullYear, monthsMap[monthStr] ?? 0, parseInt(day));
    } catch (e) {
      console.warn("Date parsing failed, using fallback", e);
    }

    const datePayload = isNaN(travelDate.getTime()) ? new Date().toISOString() : travelDate.toISOString();

    // Construct a minimal bus object that mimics the structure expected by seat selection screens
    const mockBus = {
      id: item.id,
      name: item.travels,
      price: item.price,
      typeTag: item.busType,
      seatType: seatType,
      source: item.source,
      destination: item.destination,
      departure: item.from.split('\n')[1].split('(')[1].replace(')', ''), // e.g., "21:00pm"
      arrival: item.to.split('\n')[1].split('(')[1].replace(')', ''), // e.g., "06:00am"
      duration: "09hrs 00mins", // Placeholder, as not available in marketplace item
      rating: 4.0, // Placeholder
      seatsAvailable: 1, // Only one seat is being resold
      ac: item.busType.toLowerCase().includes("a/c"),
      operator: item.travels,
      boardingPoints: [{ title: item.from.split('\n')[0], subtitle: item.from.split('\n')[1] }],
      droppingPoints: [{ title: item.to.split('\n')[0], subtitle: item.to.split('\n')[1] }],
    };

    navigation.navigate(seatType === "sleeper" ? "SleeperSeatSelection" : "SeaterSeatSelection", { bus: mockBus, date: datePayload, preSelectedSeatId: item.seat });
  }, [navigation]);

  const handleRemoveBooking = useCallback((id) => {
    setAllBookings(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(item => item.id !== id)
    }));
  }, [activeTab]);

  const handleClearTab = useCallback(() => {
    setAllBookings(prev => ({
      ...prev,
      [activeTab]: []
    }));
  }, [activeTab]);

  const handleRemoveListing = useCallback((item) => {
    setAllBookings(prev => ({
      ...prev,
      MyListings: prev.MyListings.filter(listing => listing.id !== item.id)
    }));
  }, []);

  /* ---------------- REUSABLE SUB-COMPONENTS ---------------- */

  const StatusBadge = ({ label, type }) => {
    let bgColor = "#F2F2F2";
    let textColor = "#666";
    let icon = null;

    switch (type) {
      case "upcoming":
        bgColor = "#EBF3FF";
        textColor = "#2F80ED";
        icon = "schedule";
        break;
      case "completed":
        bgColor = "#E8F5E9";
        textColor = "#2E7D32";
        icon = "check-circle";
        break;
      case "failed":
        bgColor = "#FFF5F5";
        textColor = "#D32F2F";
        icon = "error-outline";
        break;
      case "active":
        bgColor = "#E8F5E9";
        textColor = "#2E7D32";
        icon = "bolt";
        break;
    }

    return (
      <View style={[styles.badgeBase, { backgroundColor: bgColor }]}>
        {icon && <MaterialIcons name={icon} size={12} color={textColor} style={{ marginRight: 4 }} />}
        <Text style={[styles.badgeTextBase, { color: textColor }]}>{label.toUpperCase()}</Text>
      </View>
    );
  };

  const RouteDisplay = ({ source, destination }) => (
    <View style={styles.routeHeaderRow}>
      <Text style={styles.routeCityBold}>{source}</Text>
      <View style={styles.routeConnector}>
        <View style={styles.dotLine} />
        <MaterialIcons name="directions-bus" size={16} color="#BBB" />
        <View style={styles.dotLine} />
      </View>
      <Text style={styles.routeCityBold}>{destination}</Text>
    </View>
  );

  const PrimaryGradientButton = ({ onPress, text, icon, colorVariant = "blue" }) => {
    const colors = colorVariant === "blue" ? ['#2F80ED', '#1E73E8'] : ['#FF5252', '#D32F2F'];
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.btnWrapper}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBtn}
        >
          <Text style={styles.gradientBtnText}>{text}</Text>
          {icon && <MaterialIcons name={icon} size={18} color="#FFF" style={{ marginLeft: 8 }} />}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const SecondaryOutlineButton = ({ onPress, text }) => (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7} 
      style={styles.outlineBtn}
    >
      <Text style={styles.outlineBtnText}>{text}</Text>
    </TouchableOpacity>
  );

  const InfoItem = ({ label, value, subValue, icon }) => (
    <View style={styles.infoItemBox}>
      <Text style={styles.infoItemLabel}>{label}</Text>
      <View style={styles.infoValueRow}>
        {icon && <MaterialIcons name={icon} size={14} color="#999" style={{ marginRight: 4 }} />}
        <Text style={styles.infoItemValue}>{value}</Text>
      </View>
      {subValue && <Text style={styles.infoItemSub}>{subValue}</Text>}
    </View>
  );

  const MarketplacePricing = ({ resellPrice, originalPrice }) => (
    <View style={styles.marketPriceBox}>
      <View>
        <Text style={styles.marketResellPrice}>₹{resellPrice}</Text>
        <Text style={styles.marketOriginalPrice}>Original ₹{originalPrice}</Text>
      </View>
      <View style={styles.savingsTag}>
        <Text style={styles.savingsTagText}>Save ₹{originalPrice - resellPrice}</Text>
      </View>
    </View>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request to fetch new bookings
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  /* ---------------- EMPTY STATE ---------------- */

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={IMAGES.NO_BOOKING}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>
        {searchQuery 
          ? "No Matching Bookings"
          : activeTab === "Marketplace"
          ? (marketplaceTab === "Browse" ? "Marketplace is Empty" : "No Active Listings")
          : activeTab === "Upcoming" ? "No Upcoming Trips" : `No ${activeTab} Bookings yet!`}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? `We couldn't find any bookings matching "${searchQuery}"`
          : activeTab === "Marketplace"
          ? (marketplaceTab === "Browse" ? "No resalable tickets are currently available for this route." : "You haven't listed any tickets for resale yet.")
          : activeTab === "Upcoming" ? "Book your next journey and it will appear here." : "Looks like you haven't started any trips yet. Lets book your next ride."}
      </Text>
    </View>
  );

  /* ---------------- UPCOMING CARD ---------------- */

  const renderUpcoming = (item, index) => (
    <View key={index} style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <StatusBadge label="Upcoming" type="upcoming" />
        <Text style={styles.pnrText}>PNR: {item.pnr}</Text>
      </View>

      <RouteDisplay source={item.source} destination={item.destination} />

      <View style={styles.cardContentPadding}>
        <View style={styles.rowBetween}>
          <InfoItem 
            label="DEPARTURE" 
            value={item.from.split('\n')[0]} 
            subValue={item.from.split('\n')[1]} 
            icon="location-on"
          />
          <InfoItem 
            label="ARRIVAL" 
            value={item.to.split('\n')[0]} 
            subValue={item.to.split('\n')[1]} 
            icon="access-time"
          />
        </View>
      </View>

      <View style={styles.cardDividerFull} />
      
      <PrimaryGradientButton 
        onPress={() => handleViewDetails(item)}
        text="View and Manage Booking"
        icon="settings"
      />
    </View>
  );

  /* ---------------- COMPLETED CARD ---------------- */

  const renderCompleted = (item, index) => (
    <View key={index} style={[styles.card, styles.completedCardBorder]}>
      <View style={styles.cardHeaderRow}>
        <StatusBadge label="Completed" type="completed" />
        <TouchableOpacity onPress={() => handleRemoveBooking(item.id)}>
          <Ionicons name="close-circle-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <RouteDisplay source={item.source} destination={item.destination} />

      <View style={styles.rowBetween}>
        <View style={styles.operatorMiniBox}>
          <Text style={styles.operatorLabel}>OPERATOR</Text>
          <Text style={styles.operatorValue}>{item.travels}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.operatorLabel}>BOOKED ON</Text>
          <Text style={styles.operatorValue}>{item.time.split('at')[0]}</Text>
        </View>
      </View>

      <View style={styles.cardDividerFull} />

      <PrimaryGradientButton 
        onPress={() => handleBookAgain(item)} 
        text="Book Again" 
        icon="refresh"
      />
    </View>
  );

  /* ---------------- UNSUCCESSFUL CARD ---------------- */

  const renderUnsuccessful = (item, index) => (
    <View key={index} style={[styles.card, styles.failedCardBorder]}>
      <View style={styles.cardHeaderRow}>
        <StatusBadge label="Payment Failed" type="failed" />
        <TouchableOpacity onPress={() => handleRemoveBooking(item.id)}>
          <Ionicons name="close-circle-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <RouteDisplay source={item.source} destination={item.destination} />

      <View style={styles.failedReasonBox}>
        <MaterialIcons name="warning" size={16} color="#D32F2F" />
        <Text style={styles.failedReasonText}>The transaction was declined by the bank.</Text>
      </View>

      <View style={styles.cardDividerFull} />

      <PrimaryGradientButton 
        onPress={() => handleRetryPayment(item)} 
        text="Retry Booking" 
        icon="payment" 
        colorVariant="red"
      />
    </View>
  );

  /* ---------------- MARKETPLACE CARD ---------------- */

  const renderMarketplace = (item, index) => {
    const savings = item.originalPrice - item.price;
    const savingsPercent = Math.round((savings / item.originalPrice) * 100);

    // Parsing departure info for better display hierarchy
    const departureCity = item.from.split('\n')[0];
    const departureDateTime = item.from.split('\n')[1] || "";
    const [depDate, depTimeRaw] = departureDateTime.split('(');
    const depTime = depTimeRaw ? depTimeRaw.replace(')', '') : "";

    return (
      <TouchableOpacity 
        key={index} 
        activeOpacity={0.95} 
        style={styles.premiumCard}
        onPress={() => handleViewDetails(item)}
      >
        {/* Premium Discount Badge */}
        <View style={styles.premiumDiscountBadge}>
          <Text style={styles.premiumDiscountText}>{savingsPercent}% OFF</Text>
        </View>

        {/* Header: Route */}
        <View style={styles.cardHeader}>
          <View style={styles.routeRowHeader}>
            <Text style={styles.routeCityText}>{item.source}</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#2F80ED" style={styles.routeArrow} />
            <Text style={styles.routeCityText}>{item.destination}</Text>
          </View>
          <Text style={styles.ticketTypeSub}>
            {item.busType} • Seat: {item.seat}
          </Text>
        </View>

        {/* Operator Info */}
        <View style={styles.operatorContainer}>
          <Ionicons name="bus-outline" size={16} color="#666" />
          <Text style={styles.operatorNameText}>{item.travels}</Text>
          <MaterialIcons name="verified" size={14} color="#2F80ED" style={{ marginLeft: 4 }} />
        </View>

        <View style={styles.cardDivider} />

        {/* Mid Section: Departure & Pricing */}
        <View style={styles.cardMidSection}>
          {/* Departure Info */}
          <View style={styles.departureInfo}>
            <Text style={styles.infoLabel}>DEPARTURE</Text>
            <View style={styles.infoRowWithIcon}>
              <Ionicons name="location-sharp" size={14} color="#2F80ED" />
              <Text style={styles.infoValueMain}>{departureCity}</Text>
            </View>
            <View style={styles.infoRowWithIcon}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.infoValueSub}>{depDate.trim()} • {depTime}</Text>
            </View>
          </View>

          {/* Pricing Info */}
          <View style={styles.pricingContainer}>
            <Text style={styles.premiumOriginalPrice}>₹{item.originalPrice}</Text>
            <Text style={styles.premiumResellPrice}>₹{item.price}</Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsBadgeText}>Save ₹{savings}</Text>
            </View>
          </View>
        </View>

        {/* Footer: Buy Now Button with Gradient */}
        <TouchableOpacity onPress={() => handleBuyTicket(item)} activeOpacity={0.85}>
          <LinearGradient
            colors={['#2F80ED', '#1E73E8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumBuyBtn}
          >
            <Text style={styles.premiumBuyBtnText}>Buy Ticket Now</Text>
            <MaterialIcons name="chevron-right" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  /* ---------------- MY LISTING CARD ---------------- */

  const renderMyListing = (item, index) => (
    <View key={index} style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <StatusBadge label={item.status} type="active" />
        <Text style={styles.listingIdText}>ID: {item.id}</Text>
      </View>

      <RouteDisplay source={item.source} destination={item.destination} />
      
      <View style={styles.cardMidSectionListing}>
        <InfoItem 
          label="TICKET DETAILS" 
          value={item.busType} 
          subValue={`Seat ${item.seat}`} 
        />
        <MarketplacePricing resellPrice={item.price} originalPrice={item.originalPrice} />
      </View>

      <View style={styles.cardDividerFull} />

      <View style={styles.actionRowListing}>
        <SecondaryOutlineButton text="Remove" onPress={() => handleRemoveListing(item)} />
        <View style={{ width: 12 }} />
        <PrimaryGradientButton text="Edit Price" onPress={() => handleViewDetails(item)} icon="edit" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by route or PNR"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {["Upcoming", "Completed", "Marketplace", "Unsuccessful"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTab]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MARKETPLACE SUB-TABS */}
      {activeTab === "Marketplace" && (
        <View style={styles.marketplaceHeader}>
          <View style={styles.subTabs}>
            {["Browse", "My Listings"].map((st) => (
              <TouchableOpacity 
                key={st} 
                onPress={() => setMarketplaceTab(st)}
                style={[styles.subTab, marketplaceTab === st && styles.activeSubTab]}
              >
                <Text style={[styles.subTabText, marketplaceTab === st && styles.activeSubTabText]}>
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity 
            style={[styles.alertToggle, marketAlerts && styles.alertToggleActive]}
            onPress={handleToggleAlerts}
          >
            <Ionicons 
              name={marketAlerts ? "notifications" : "notifications-outline"} 
              size={20} 
              color={marketAlerts ? "#fff" : "#2F80ED"} 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* CONTENT */}
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={["#2F80ED"]}
            tintColor="#2F80ED"
          />
        }
      >
        {/* Tab Actions */}
        {bookings.length > 0 && (activeTab === "Completed" || activeTab === "Unsuccessful") && (
          <TouchableOpacity 
            style={styles.clearTabContainer} 
            onPress={handleClearTab}
          >
            <Text style={styles.clearTabText}>Clear History</Text>
          </TouchableOpacity>
        )}

        {bookings.length === 0
          ? renderEmpty()
          : bookings.map((item, index) => {
              switch (activeTab) {
                case "Upcoming": return renderUpcoming(item, index);
                case "Completed": return renderCompleted(item, index);
                case "Unsuccessful": return renderUnsuccessful(item, index);
                case "Marketplace": 
                  return marketplaceTab === "Browse" ? renderMarketplace(item, index) : renderMyListing(item, index);
                default: return null;
              }
            })}
      </ScrollView>

      {/* FOOTER */}
      <Footer />

      {/* NOTIFICATION CONFIRMATION */}
      <AppModal
        visible={alertModalVisible}
        title="Alerts Enabled!"
        message="We'll notify you instantly when new tickets are listed on your favorite routes."
        type="success"
        confirmText="Got it"
        onConfirm={() => setAlertModalVisible(false)}
      />
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
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
    padding: 18,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badgeBase: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeTextBase: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pnrText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  routeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  routeCityBold: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  routeConnector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  dotLine: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 1,
    marginHorizontal: 5,
  },
  cardContentPadding: {
    paddingVertical: 8,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItemBox: {
    flex: 1,
  },
  infoItemLabel: {
    fontSize: 10,
    color: "#AAA",
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  infoValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoItemValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  infoItemSub: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },
  cardDividerFull: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 18,
    marginHorizontal: -18,
  },
  btnWrapper: {
    width: "100%",
  },
  gradientBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 3,
  },
  gradientBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  completedCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  failedCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
  },
  operatorMiniBox: {
    flex: 1,
  },
  operatorLabel: {
    fontSize: 9,
    color: "#AAA",
    fontWeight: "700",
    marginBottom: 4,
  },
  operatorValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
  },
  failedReasonBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    padding: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  failedReasonText: {
    fontSize: 12,
    color: "#D32F2F",
    marginLeft: 8,
    fontWeight: "500",
  },
  cardMidSectionListing: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  marketPriceBox: {
    alignItems: "flex-end",
  },
  marketResellPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  marketOriginalPrice: {
    fontSize: 12,
    color: "#AAA",
    textDecorationLine: "line-through",
  },
  savingsTag: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  savingsTagText: {
    color: "#2E7D32",
    fontSize: 10,
    fontWeight: "700",
  },
  actionRowListing: {
    flexDirection: "row",
    alignItems: "center",
  },
  outlineBtn: {
    flex: 0.5,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "700",
  },
  listingIdText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },

  /* ---------- LEGACY STYLES (Retained for Marketplace Browse compatibility) ---------- */

  route: {
    fontWeight: "600",
    marginBottom: 10,
  },
  label: {
    color: "#999",
    fontSize: 12,
  },
  value: {
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

  /* ---------- PREMIUM MARKETPLACE CARD ---------- */
  premiumCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#EBF3FF",
    // Layered Shadow for Premium Depth
    shadowColor: "#2F80ED",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  premiumDiscountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 16,
    zIndex: 2,
  },
  premiumDiscountText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  routeRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeCityText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.4,
  },
  routeArrow: {
    marginHorizontal: 10,
    opacity: 0.8,
  },
  ticketTypeSub: {
    fontSize: 13,
    color: '#777',
    fontWeight: '500',
  },
  operatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  operatorNameText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
    marginLeft: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F2F2F2',
    marginBottom: 18,
  },
  cardMidSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  departureInfo: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  infoRowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoValueMain: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginLeft: 8,
  },
  infoValueSub: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  pricingContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  premiumOriginalPrice: {
    fontSize: 13,
    color: '#AAA',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  premiumResellPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  savingsBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  savingsBadgeText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  premiumBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 16,
  },
  premiumBuyBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 6,
    letterSpacing: 0.2,
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
    width: 280,
    height: 380,
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

  /* ---------- SUB TABS ---------- */
  marketplaceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
  alertToggle: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  alertToggleActive: {
    backgroundColor: "#2F80ED",
    borderColor: "#2F80ED",
  },
  subTabs: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    padding: 4,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeSubTab: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  subTabText: {
    fontSize: 13,
    color: "#777",
  },
  activeSubTabText: {
    color: "#2F80ED",
    fontWeight: "600",
  },
  statusBadgeListing: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTextListing: {
    color: "#2E7D32",
    fontSize: 10,
    fontWeight: "600",
  },
  completedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  completedText: {
    color: "#2E7D32",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  clearTabContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  clearTabText: {
    fontSize: 12,
    color: "#2F80ED",
    fontWeight: "600",
  },
});
