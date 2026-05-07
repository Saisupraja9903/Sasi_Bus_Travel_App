import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { height, width } = Dimensions.get("window");
const PRIMARY_RED = "#D84E55";

const boardingPoints = [
  {
    time: "19:30",
    date: "4 Apr",
    title: "Hyderabad - Kondapur (N) (Van Pickup)",
    address: "Infront of Santosh Dhaba, Opposite Toyota Showroom",
  },
  {
    time: "19:45",
    date: "4 Apr",
    title: "Hyderabad - Allwyn X Road (N)",
    address: "Near Flyover",
  },
  {
    time: "19:50",
    date: "4 Apr",
    title: "Hyderabad - Miyapur (E)",
    address: "Near Metro Station",
  },
  {
    time: "20:05",
    date: "4 Apr",
    title: "Hyderabad - Nizampet (E)",
    address: "Main Road",
  },
  {
    time: "20:10",
    date: "4 Apr",
    title: "Hyderabad - KPHB (S)",
    address: "Near Rythu Bazaar",
  },
  {
    time: "20:25",
    date: "4 Apr",
    title: "Hyderabad - Kukatpally (S)",
    address: "Opposite Nexus Mall",
  },
  {
    time: "20:40",
    date: "4 Apr",
    title: "Hyderabad - Erragadda (S)",
    address: "Near ESI Hospital",
  },
  {
    time: "20:45",
    date: "4 Apr",
    title: "Hyderabad - SR Nagar (S)",
    address: "Main Bus Stop",
  },
];

const droppingPoints = [
  {
    time: "10:00",
    date: "5 Apr",
    title: "Visakhapatnam - Lankelapalem (E)",
    address: "Infront of Jagruthi Hotel, Besides ICICI bank",
  },
  {
    time: "10:30",
    date: "5 Apr",
    title: "Visakhapatnam - Gajuwaka (E)",
    address: "Near Indian Oil petrol pump, Chaitanya Nagar",
  },
  {
    time: "10:50",
    date: "5 Apr",
    title: "Visakhapatnam - NAD Junction (E)",
    address: "Near Flyover",
  },
  {
    time: "11:05",
    date: "5 Apr",
    title: "Visakhapatnam - Akkayapalem (E)",
    address: "Near Highway",
  },
];

const SHEET_HEIGHT = height * 0.8;
const SNAP_TOP = 0; // 80% screen height (from top of sheet to top of screen)
const SNAP_BOTTOM = SHEET_HEIGHT - height * 0.25; // 25% screen height (from bottom of screen)
const SNAP_CLOSED = SHEET_HEIGHT; // Fully closed (sheet is below the screen)

const BusDetailsBottomSheet = forwardRef((props, ref) => {
  const { bus } = props;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("highlights");
  const [isBackdropActive, setIsBackdropActive] = useState(false);
  const [stickyTabBarHeight, setStickyTabBarHeight] = useState(0);
  const translateY = useRef(new Animated.Value(SNAP_CLOSED)).current;
  const lastY = useRef(SNAP_CLOSED);
  const startY = useRef(0);
  const scrollRef = useRef(null);
  const tabScrollRef = useRef(null);
  const tabOffsets = useRef({});
  const sectionOffsets = useRef({});
  const contentBaseOffset = useRef(0);
  const isManualScrolling = useRef(false);
  const scrollOffset = useRef(0);

  const navigateToAllPoints = (tab) => {
    navigation.navigate("BoardingDroppingScreen", {
      initialTab: tab,
      boardingPoints: bus?.boardingPoints || boardingPoints,
      droppingPoints: bus?.droppingPoints || droppingPoints,
      bus,
      selectedSeats: [],
    });
  };

  useEffect(() => {
    const id = translateY.addListener(({ value }) => {
      lastY.current = value;
      
      // Toggle backdrop interaction based on sheet position
      const threshold = SNAP_BOTTOM - 20;
      if (value < threshold && !isBackdropActive) {
        setIsBackdropActive(true);
      } else if (value >= threshold && isBackdropActive) {
        setIsBackdropActive(false);
      }
    });

    // Default appearance: 25% height
    openSheet(SNAP_BOTTOM);

    return () => translateY.removeListener(id);
  }, [isBackdropActive]);

  // Auto-scroll the tab bar when the active tab changes
  useEffect(() => {
    if (tabScrollRef.current && tabOffsets.current[activeTab]) {
      tabScrollRef.current.scrollTo({
        x: Math.max(0, tabOffsets.current[activeTab] - width / 3),
        animated: true,
      });
    }
  }, [activeTab]);

  const closeBtnOpacity = translateY.interpolate({
    inputRange: [SNAP_TOP, SNAP_TOP + 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const backdropOpacity = translateY.interpolate({
    inputRange: [SNAP_TOP, SNAP_BOTTOM],
    outputRange: [0.5, 0],
    extrapolate: "clamp",
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      openSheet(SNAP_BOTTOM);
    },
    expand: () => {
      openSheet(SNAP_TOP);
    },
    close: () => {
      openSheet(SNAP_CLOSED);
    },
  }));

  const openSheet = (toValue) => {
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      damping: 20,
      mass: 0.8,
      stiffness: 120,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dy, dx } = gestureState;
        // Allow dragging if sheet is not fully closed
        return (
          Math.abs(dy) > Math.abs(dx) &&
          Math.abs(dy) > 5 &&
          lastY.current < SNAP_CLOSED
        );
      },
      onPanResponderGrant: () => {
        startY.current = lastY.current;
      },
      onPanResponderMove: (_, gestureState) => {
        let nextY = startY.current + gestureState.dy;
        // Clamp at the top (80% height)
        if (nextY < SNAP_TOP) nextY = SNAP_TOP;
        translateY.setValue(nextY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        const currentPos = lastY.current;

        let target = SNAP_BOTTOM;

        // Logic for snapping
        if (vy < -0.2 || (dy < -60 && currentPos < SNAP_BOTTOM)) {
          target = SNAP_TOP;
        } else if (vy > 0.2 || dy > 60) {
          target = SNAP_BOTTOM;
        } else {
          // Snap to nearest point
          const distTop = Math.abs(currentPos - SNAP_TOP);
          const distBottom = Math.abs(currentPos - SNAP_BOTTOM);
          target = distTop < distBottom ? SNAP_TOP : SNAP_BOTTOM;
        }

        openSheet(target === SNAP_CLOSED ? SNAP_BOTTOM : target);
      },
    }),
  ).current;

  const TABS = [
    { key: "highlights", label: "Highlights", icon: "auto-awesome" },
    { key: "cancel", label: "Cancellation", icon: "assignment-return" },
    { key: "boarding", label: "Boarding", icon: "trip-origin" },
    { key: "dropping", label: "Dropping", icon: "location-on" },
    { key: "route", label: "Route", icon: "alt-route" },
    { key: "rest", label: "Rest Stop", icon: "local-cafe" },
    { key: "features", label: "Features", icon: "directions-bus" },
    { key: "reviews", label: "Reviews", icon: "star-rate" },
    { key: "policy", label: "Policies", icon: "policy" },
  ];

  const handleScroll = (event) => {
    if (isManualScrolling.current) return;

    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const y = contentOffset.y;
    scrollOffset.current = y;

    // Detect if we are at the very bottom of the scroll view
    const isAtBottom = layoutMeasurement.height + y >= contentSize.height - 20;
    if (isAtBottom) {
      setActiveTab(TABS[TABS.length - 1].key);
      return;
    }

    // Find the active section based on scroll position
    let currentTab = TABS[0].key;
    for (let i = 0; i < TABS.length; i++) {
      const key = TABS[i].key;
      // Calculate the absolute Y position of the section's top within the ScrollView's content
      const sectionAbsoluteY =
        (sectionOffsets.current[key] || 0) + contentBaseOffset.current;

      // If the current scroll position (y) plus the sticky header height has passed this section's top
      if (y + stickyTabBarHeight >= sectionAbsoluteY) {
        currentTab = key;
      } else {
        // Since sections are ordered, if we haven't reached this one, we can stop.
        break;
      }
    }
    if (currentTab !== activeTab) setActiveTab(currentTab);
  };

  const handleTabPress = (key) => {
    setActiveTab(key);
    isManualScrolling.current = true;

    const scrollToSection = () => {
      const offset = sectionOffsets.current[key];

      if (scrollRef.current && offset !== undefined) {
        scrollRef.current.scrollTo({
          y: offset + contentBaseOffset.current - stickyTabBarHeight,
          animated: true,
        });
      }

      setTimeout(() => {
        isManualScrolling.current = false;
      }, 300);
    };

    // If sheet is not expanded, expand it first and scroll after animation
    if (lastY.current !== SNAP_TOP) {
      Animated.spring(translateY, {
        toValue: SNAP_TOP,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start(() => {
        scrollToSection(); // scroll AFTER animation
      });
    } else {
      scrollToSection();
    }
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {/* Background Overlay */}
      <Animated.View
        pointerEvents={isBackdropActive ? "auto" : "none"}
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => openSheet(SNAP_BOTTOM)}
        />
      </Animated.View>

    <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
      {/* Close Button above the sheet */}
      <Animated.View
        style={[styles.closeBtn, { opacity: closeBtnOpacity }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => openSheet(SNAP_BOTTOM)}
          style={styles.closeBtnInner}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <View {...panResponder.panHandlers}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View>
            <Text style={styles.busName}>{bus?.name || "FlixBus"}</Text>
            <Text style={styles.timeHeader}>20:10 - 11:10 · Sat 04 Apr</Text>
          </View>
          <View style={styles.ratingColumn}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ 4.7</Text>
            </View>
            <Text style={styles.ratingSub}>580 ratings</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={8}
        bounces={false}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]} // Sticky Tab Bar
      >
        {/* Bus Images Carousel */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[1, 2]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => (
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
              }}
              style={styles.carouselImage}
            />
          )}
          style={styles.imageCarousel}
        />

        <View style={{ height: 10 }} />

        {/* Tabs */}
        <View
          style={styles.tabWrapper}
          onLayout={(event) => {
            // Dynamically measure the height of the sticky tab bar
            setStickyTabBarHeight(event.nativeEvent.layout.height);
          }}
        >
          <ScrollView
            ref={tabScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabContainer}
          >
            {TABS.map((t) => (
              <TouchableOpacity
                key={t.key}
                onPress={() => handleTabPress(t.key)}
                style={[styles.tab, activeTab === t.key && styles.activeTab]}
                onLayout={(e) =>
                  (tabOffsets.current[t.key] = e.nativeEvent.layout.x)
                }
              >
                <View style={styles.tabItemInner}>
                  <MaterialIcons
                    name={t.icon}
                    size={18}
                    color={activeTab === t.key ? PRIMARY_RED : "#757575"}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === t.key && styles.activeText,
                    ]}
                  >
                    {t.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View
          style={styles.contentPadding}
          onLayout={(e) => (contentBaseOffset.current = e.nativeEvent.layout.y)}
        >
          {/* 1. Highlights */}
          <View
            onLayout={(e) =>
              (sectionOffsets.current.highlights = e.nativeEvent.layout.y)
            }
            style={[styles.section, { marginTop: 8 }]}
          >
            <SectionHeader icon="auto-awesome" title="Highlights" />
            <View style={styles.highlightCard}>
              <View style={styles.highlightHeader}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={20}
                  color="#43A047"
                />
                <Text style={styles.highlightTitle}>New Bus</Text>
              </View>
              <Text style={styles.highlightSub}>Launched 10 months ago</Text>
            </View>
          </View>

          {/* 2. Cancellation */}
          <View
            onLayout={(e) =>
              (sectionOffsets.current.cancel = e.nativeEvent.layout.y)
            }
            style={styles.section}
          >
            <SectionHeader
              icon="assignment-return"
              title="Cancellation policy"
            />
            <View style={styles.policyTable}>
              <View style={[styles.tableHeader, styles.tableRow]}>
                <Text style={styles.tableHeaderText}>Time window</Text>
                <Text style={styles.tableHeaderText}>Refund</Text>
              </View>
              <Row label="Before 21st Mar 07:30 PM" value="100%" />
              <Row label="21st Mar 07:30 PM - 28th Mar" value="75%" />
              <Row label="28th Mar 07:30 PM - 2nd Apr" value="50%" />
              <Row label="2nd Apr 07:30 PM - 4th Apr" value="25%" />
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color="#2F80ED" />
              <Text style={styles.infoText}>
                Add Free Cancellation while booking to get a 100% refund on
                cancellation.
              </Text>
            </View>
          </View>

          {/* 3. Boarding */}
          <View
            onLayout={(e) =>
              (sectionOffsets.current.boarding = e.nativeEvent.layout.y)
            }
            style={styles.section}
          >
            <SectionHeader icon="trip-origin" title="Boarding point" />
            <Text style={styles.cityLabel}>Hyderabad</Text>
            {[...(bus?.boardingPoints || []), ...boardingPoints]
              .slice(0, 3)
              .map((item, index, arr) => (
                <Timeline
                  key={index}
                  index={index}
                  total={arr.length}
                  time={item.time || "19:30"}
                  date={item.date || "4 Apr"}
                  title={item.title}
                  sub={item.address || item.subtitle}
                />
              ))}
            <ViewAllButton
              label="VIEW ALL BOARDING POINTS"
              onPress={() => navigateToAllPoints("boarding")}
            />
          </View>

          {/* 4. Dropping */}
          <View
            onLayout={(e) =>
              (sectionOffsets.current.dropping = e.nativeEvent.layout.y)
            }
            style={styles.section}
          >
            <SectionHeader icon="location-on" title="Dropping point" />
            <Text style={styles.cityLabel}>Visakhapatnam</Text>
            {[...(bus?.droppingPoints || []), ...droppingPoints]
              .slice(0, 3)
              .map((item, index, arr) => (
                <Timeline
                  key={index}
                  index={index}
                  total={arr.length}
                  time={item.time || "10:00"}
                  date={item.date || "5 Apr"}
                  title={item.title}
                  sub={item.address || item.subtitle}
                />
              ))}
            <ViewAllButton
              label="VIEW ALL DROPPING POINTS"
              onPress={() => navigateToAllPoints("dropping")}
            />
          </View>

          {/* 5. Route */}
          <View
            onLayout={(e) =>
              (sectionOffsets.current.route = e.nativeEvent.layout.y)
            }
            style={styles.section}
          >
            <SectionHeader icon="alt-route" title="Bus route" />
            <Text style={styles.routeStats}>586 km · 12 hr 55 min</Text>
            <Text style={styles.route}>
              <Text style={styles.highlightCity}>Hyderabad</Text> → Suryapet →
              Vijayawada → Eluru → Rajahmundry → Jaggampeta → Kattipudi →
              Annavaram → Tuni →{" "}
              <Text style={styles.highlightCity}>Visakhapatnam</Text>
            </Text>
          </View>

          {/* 6. Rest Stop */}
          <View
            onLayout={(e) =>
              (sectionOffsets.current.rest = e.nativeEvent.layout.y)
            }
            style={styles.section}
          >
            <SectionHeader icon="local-cafe" title="Rest stop" />
            <View style={styles.restStopAlert}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={20}
                color="#D32F2F"
              />
              <Text style={styles.restStopText}>This bus has no rest stop</Text>
            </View>
          </View>

          {/* 7. Features */}
          <View
            onLayout={(e) =>
              (sectionOffsets.current.features = e.nativeEvent.layout.y)
            }
            style={styles.section}
          >
            <SectionHeader icon="directions-bus" title="Bus features" />
            <View style={styles.featureContainer}>
              <Tag name="Water Bottle" icon="local-drink" />
              <Tag name="Blankets" icon="airline-seat-flat" />
              <Tag name="Charging Point" icon="usb" />
              <Tag name="Reading Light" icon="highlight" />
              <Tag name="Waiting lounge" icon="weekend" />
            </View>
          </View>

          {/* 8. Reviews */}
          <View
            onLayout={(e) =>
              (sectionOffsets.current.reviews = e.nativeEvent.layout.y)
            }
            style={styles.section}
          >
            <SectionHeader icon="star-rate" title="Ratings and reviews" />
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.ratingBig}>⭐ 4.7</Text>
                <Text style={styles.ratingCount}>580 Ratings</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>
                  Real Feedback from verified travelers
                </Text>
              </View>
            </View>
            <View style={styles.ratingBars}>
              <RatingRow star="5 ★" percent="84%" width="84%" />
              <RatingRow star="4 ★" percent="9%" width="9%" />
              <RatingRow star="3 ★" percent="2%" width="2%" />
              <RatingRow star="2 ★" percent="1%" width="1%" />
              <RatingRow star="1 ★" percent="3%" width="3%" />
            </View>
            <View style={styles.feedbackTags}>
              {[
                "Driving",
                "Punctuality",
                "Cleanliness",
                "Seat / Sleep Comfort",
                "Staff behavior",
                "AC",
                "Rest stop hygiene",
                "Live tracking",
              ].map((tag) => (
                <View key={tag} style={styles.greenTag}>
                  <Text style={styles.greenTagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.readReviewsBtn}
              onPress={() =>
                navigation.navigate("Reviews", {
                  busName: bus?.name || "Bus Details",
                })
              }
            >
              <Text style={styles.readReviewsText}>Read all 188 reviews</Text>
            </TouchableOpacity>
          </View>

          {/* 9. Policies */}
          <View
            onLayout={(e) =>
              (sectionOffsets.current.policy = e.nativeEvent.layout.y)
            }
            style={styles.section}
          >
            <SectionHeader icon="policy" title="Other Policies" />
            <Policy
              icon="child-friendly"
              title="Child passenger policy"
              desc="Children above the age of 3 will need a ticket"
            />
            <Policy
              icon="luggage"
              title="Luggage policy"
              desc="2 pieces of luggage allowed per passenger"
            />
            <Policy
              icon="no-drinks"
              title="Liquor policy"
              desc="Carrying liquor inside bus is prohibited"
            />
            <Policy
              icon="access-time"
              title="Pick up time policy"
              desc="Passengers must arrive 15 minutes before boarding."
              isLast={true}
            />
          </View>
        </View>
      </ScrollView>
    </Animated.View>
    </View>
  );
});

const SectionHeader = ({ icon, title }) => (
  <View style={styles.sectionHeaderContainer}>
    <MaterialIcons
      name={icon}
      size={20}
      color={PRIMARY_RED}
      style={{ marginRight: 8 }}
    />
    <Text style={styles.sectionHeading}>{title}</Text>
  </View>
);

const ViewAllButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
    <Text style={styles.viewAllText}>{label}</Text>
  </TouchableOpacity>
);

const Row = ({ label, value }) => (
  <View style={styles.tableRow}>
    <Text style={styles.tableLabel}>{label}</Text>
    <Text style={styles.tableValue}>{value}</Text>
  </View>
);

const Timeline = ({ time, date, title, sub, index, total }) => {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isDisabled = index === 2; // 3rd location faded like RedBus

  return (
    <View style={[styles.timelineRow, isDisabled && { opacity: 0.4 }]}>
      {/* TIME COLUMN */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* TIMELINE DOT + LINE */}
      <View style={styles.timelineContainer}>
        {!isFirst && <View style={styles.lineTop} />}
        <View style={styles.dot} />
        {!isLast && <View style={styles.lineBottom} />}
      </View>

      {/* LOCATION CONTENT */}
      <View style={styles.contentContainer}>
        <View style={styles.locationRow}>
          <Text style={styles.locationTitle}>{title}</Text>

          <TouchableOpacity>
            <MaterialIcons name="place" size={18} color="#777" />
          </TouchableOpacity>
        </View>

        <Text style={styles.locationSub}>{sub}</Text>
      </View>
    </View>
  );
};

const Tag = ({ name, icon }) => (
  <View style={styles.featurePill}>
    {icon && (
      <MaterialIcons
        name={icon}
        size={16}
        color="#666"
        style={{ marginRight: 6 }}
      />
    )}
    <Text style={styles.featureText}>{name}</Text>
  </View>
);

const RatingRow = ({ star, percent, width }) => (
  <View style={styles.ratingBarRow}>
    <Text style={styles.starText}>{star}</Text>
    <View style={styles.barBackground}>
      <View style={[styles.barFill, { width }]} />
    </View>
    <Text style={styles.percentText}>{percent}</Text>
  </View>
);

const Policy = ({ icon, title, desc, isLast }) => (
  <View style={[styles.policyItem, isLast && { marginBottom: 0 }]}>
    <MaterialIcons
      name={icon}
      size={24}
      color="#555"
      style={styles.policyIcon}
    />
    <View>
      <Text style={styles.policyTitle}>{title}</Text>
      <Text style={styles.policyDesc}>{desc}</Text>
    </View>
  </View>
);

BusDetailsBottomSheet.displayName = "BusDetailsBottomSheet";
export default BusDetailsBottomSheet;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SHEET_HEIGHT,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  closeBtn: {
    position: "absolute",
    top: -55,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1001,
  },
  closeBtnInner: {
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 15,
    backgroundColor: "white",
  },
  busName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  timeHeader: { fontSize: 13, color: "#666", marginTop: 2 },
  ratingColumn: { alignItems: "flex-end" },
  ratingBadge: { 
    backgroundColor: "#388E3C",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: { color: "white", fontWeight: "bold", fontSize: 14 },
  ratingSub: { fontSize: 10, color: "#888", marginTop: 2 },
  imageCarousel: { paddingLeft: 16, backgroundColor: "white" },
  carouselImage: {
    width: width * 0.7,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
  },
  tabWrapper: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tabContainer: { paddingHorizontal: 8 },
  tab: { paddingVertical: 14, paddingHorizontal: 12 },
  tabItemInner: { flexDirection: "row", alignItems: "center" },
  activeTab: { borderBottomWidth: 3, borderBottomColor: PRIMARY_RED },
  tabText: { fontSize: 14, color: "#757575", fontWeight: "500", marginLeft: 6 },
  activeText: { color: PRIMARY_RED, fontWeight: "bold" },
  contentPadding: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#F3F4F6",
  },
  section: {
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionHeading: { fontSize: 17, fontWeight: "700", color: "#222" },
  highlightCard: {
    backgroundColor: "#F8FFF6",
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#43A047",
  },
  highlightHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  highlightTitle: { fontWeight: "bold", fontSize: 15 },
  highlightSub: { color: "#666", fontSize: 13, marginTop: 4 },
  policyTable: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tableHeader: { backgroundColor: "#F5F5F5" },
  tableHeaderText: { fontWeight: "bold", color: "#555", fontSize: 12 },
  tableLabel: { fontSize: 12, color: "#666", flex: 1 },
  tableValue: { fontWeight: "bold", fontSize: 12, color: "#333" },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    gap: 10,
  },
  infoText: { fontSize: 12, color: "#1976D2", flex: 1, lineHeight: 18 },
  cityLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  timeContainer: {
    width: 65,
    alignItems: "flex-end",
    marginRight: 8,
  },

  time: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },

  date: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },

  timelineContainer: {
    width: 25,
    alignItems: "center",
  },

  lineTop: {
    width: 2,
    height: 6,
    backgroundColor: "#DADADA",
  },

  lineBottom: {
    width: 2,
    flex: 1,
    backgroundColor: "#DADADA",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#444",
    marginVertical: 2,
  },

  contentContainer: {
    flex: 1,
    paddingLeft: 10,
  },

  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  locationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 10,
  },

  locationSub: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    lineHeight: 18,
  },
  routeStats: {
    color: "#888",
    fontSize: 13,
    marginBottom: 12,
    fontWeight: "500",
  },
  route: { lineHeight: 26, color: "#444", fontSize: 14 },
  highlightCity: { fontWeight: "bold", color: "#333" },
  restStopAlert: {
    flexDirection: "row",
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 10,
    gap: 10,
    alignItems: "center",
  },
  restStopText: { color: "#D32F2F", fontSize: 14, fontWeight: "500" },
  featureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 4,
  },
  featurePill: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: { fontSize: 13, color: "#555", fontWeight: "500" },
  viewAllButton: {
    backgroundColor: "#F6DADA",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 8,
  },
  viewAllText: {
    color: "#C62828",
    fontWeight: "600",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingBig: { fontSize: 24, fontWeight: "bold" },
  ratingCount: { fontSize: 12, color: "#888" },
  verifiedBadge: {
    backgroundColor: "#E8F5E9",
    padding: 8,
    borderRadius: 6,
    flex: 0.8,
  },
  verifiedText: { color: "#2E7D32", fontSize: 11, fontWeight: "500" },
  ratingBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  starText: { width: 30, fontSize: 12, color: "#666" },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "#EEE",
    borderRadius: 3,
  },
  barFill: { height: 6, backgroundColor: "#388E3C", borderRadius: 3 },
  percentText: { width: 35, fontSize: 12, color: "#666", textAlign: "right" },
  feedbackTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  greenTag: {
    borderWidth: 1.2,
    borderColor: "#C8E6C9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#F1F8F4",
  },
  greenTagText: { color: "#2E7D32", fontSize: 12, fontWeight: "500" },
  readReviewsBtn: {
    marginTop: 20,
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: PRIMARY_RED,
    borderRadius: 8,
  },
  readReviewsText: { color: PRIMARY_RED, fontWeight: "bold" },
  policyItem: { flexDirection: "row", gap: 14, marginBottom: 18 },
  policyIcon: { marginTop: 2 },
  policyTitle: { fontWeight: "600", fontSize: 15, color: "#222" },
  policyDesc: { fontSize: 12, color: "#777", marginTop: 3, lineHeight: 18 },
});
