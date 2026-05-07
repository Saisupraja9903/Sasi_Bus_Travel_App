import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  primary: "#2563EB",
  background: "#EAF2FB",
  card: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  disabled: "#A7B4C7",
};

const DEFAULT_BOARDING_POINTS = [
  { id: "b1", name: "Lingampalli", landmark: "Jyothi theater towards lingampalli", time: "19:30" },
  { id: "b2", name: "Chanda nagar", landmark: "Near kinara grand hotel", time: "19:30" },
  { id: "b3", name: "Gangaram", landmark: "Mangaly shopping mall", time: "19:30" },
  { id: "b4", name: "Deepthi sri nagar", landmark: "RS Brother shopping mall", time: "19:30" },
  { id: "b5", name: "Madinaguda", landmark: "Bajaj electronics showroom", time: "19:30" },
  { id: "b6", name: "Miyapur Allwin X roads", landmark: "Hotel Sithara opp temple", time: "19:30" },
  { id: "b7", name: "Madhapur", landmark: "Near chutneys opp shilpakalavedika", time: "19:30" },
  { id: "b8", name: "Kukatpally", landmark: "Near metro station", time: "19:30" },
  { id: "b9", name: "Ameerpet", landmark: "Opp aditya enclave", time: "19:30" },
];

const DEFAULT_DROPPING_POINTS = [
  { id: "d1", name: "Madhavapatnam", landmark: "Dmr travels", time: "07:50" },
  { id: "d2", name: "Pratap Nagar", landmark: "Near Bus stop", time: "07:55" },
  { id: "d3", name: "Jilla Parishad Govt Hospital", landmark: "Kakinada", time: "08:00" },
  { id: "d4", name: "Balaji cheruvu", landmark: "Near bus stop", time: "08:00" },
];

const normalizePoint = (point, index, prefix) => ({
  id: String(point?.id ?? `${prefix}-${index}`),
  name: point?.name || point?.title || "Travel point",
  landmark: point?.landmark || point?.sub || point?.subtitle || point?.address || "Pickup point",
  time: point?.time || "--:--",
  date: point?.date,
});

const getRouteMeta = (bus) => {
  const from = bus?.from || bus?.source || bus?.pickupCity || bus?.pickupPoint || "Hyderabad";
  const to = bus?.to || bus?.destination || bus?.droppingCity || bus?.droppingPoint || "Kakinada";
  return { from, to, routeLabel: `${from} - ${to}` };
};

const PointCard = memo(function PointCard({ item, selected, onSelect }) {
  const scale = useRef(new Animated.Value(1)).current;
  const radioScale = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(radioScale, {
      toValue: selected ? 1 : 0,
      friction: 6,
      tension: 130,
      useNativeDriver: true,
    }).start();
  }, [radioScale, selected]);

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.985,
      friction: 7,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 7,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={() => onSelect(item)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[styles.card, selected && styles.cardSelected]}
      >
        <View style={styles.cardCopy}>
          <Text style={styles.pointName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.landmark} numberOfLines={2}>{item.landmark}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.time}>{item.time}</Text>
          <View style={[styles.radio, selected && styles.radioSelected]}>
            <Animated.View
              style={[
                styles.radioDot,
                {
                  opacity: radioScale,
                  transform: [{ scale: radioScale }],
                },
              ]}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default function BoardingDroppingScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const params = route?.params || {};
  const bus = params.bus || {};
  const selectedSeats = params.selectedSeats || [];
  const date = params.date;
  const { from, to, routeLabel } = getRouteMeta(bus);

  const boardingPoints = useMemo(
    () => (params.boardingPoints?.length ? params.boardingPoints : bus?.boardingPoints?.length ? bus.boardingPoints : DEFAULT_BOARDING_POINTS)
      .map((point, index) => normalizePoint(point, index, "boarding")),
    [bus?.boardingPoints, params.boardingPoints]
  );

  const droppingPoints = useMemo(
    () => (params.droppingPoints?.length ? params.droppingPoints : bus?.droppingPoints?.length ? bus.droppingPoints : DEFAULT_DROPPING_POINTS)
      .map((point, index) => normalizePoint(point, index, "dropping")),
    [bus?.droppingPoints, params.droppingPoints]
  );

  const [activeTab, setActiveTab] = useState(params.initialTab === "dropping" ? "dropping" : "boarding");
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState(params.selectedBoardingPoint || null);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(params.selectedDroppingPoint || null);

  const tabProgress = useRef(new Animated.Value(activeTab === "boarding" ? 0 : 1)).current;
  const listFade = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const tabWidth = width / 2;
  const isReady = Boolean(selectedBoardingPoint && selectedDroppingPoint);
  const data = activeTab === "boarding" ? boardingPoints : droppingPoints;
  const city = activeTab === "boarding" ? from : to;

  useEffect(() => {
    Animated.spring(tabProgress, {
      toValue: activeTab === "boarding" ? 0 : 1,
      friction: 8,
      tension: 90,
      useNativeDriver: true,
    }).start();

    listFade.setValue(0);
    Animated.timing(listFade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [activeTab, listFade, tabProgress]);

  const selectPoint = useCallback((point) => {
    if (activeTab === "boarding") {
      setSelectedBoardingPoint(point);
      Animated.sequence([
        Animated.delay(80),
        Animated.timing(listFade, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      ]).start(() => setActiveTab("dropping"));
      return;
    }
    setSelectedDroppingPoint(point);
  }, [activeTab, listFade]);

  const renderItem = useCallback(({ item }) => {
    const selected = activeTab === "boarding"
      ? selectedBoardingPoint?.id === item.id
      : selectedDroppingPoint?.id === item.id;

    return <PointCard item={item} selected={selected} onSelect={selectPoint} />;
  }, [activeTab, selectPoint, selectedBoardingPoint?.id, selectedDroppingPoint?.id]);

  const proceed = () => {
    if (!isReady) return;
    navigation.navigate("PassengerDetailsScreen", {
      selectedBoardingPoint,
      selectedDroppingPoint,
      selectedSeats,
      boardingPoint: selectedBoardingPoint,
      droppingPoint: selectedDroppingPoint,
      bus,
      date,
    });
  };

  const buttonPressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.985, friction: 8, useNativeDriver: true }).start();
  };

  const buttonPressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 8, useNativeDriver: true }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <MaterialIcons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>Select boarding & dropping points</Text>
          <Text style={styles.routeSubtitle} numberOfLines={1}>{routeLabel}</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TabButton
          title="Boarding points"
          subtitle={from}
          active={activeTab === "boarding"}
          onPress={() => setActiveTab("boarding")}
        />
        <TabButton
          title="Dropping points"
          subtitle={to}
          active={activeTab === "dropping"}
          onPress={() => setActiveTab("dropping")}
        />
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              width: tabWidth * 0.62,
              transform: [
                {
                  translateX: tabProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [tabWidth * 0.19, tabWidth + tabWidth * 0.19],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <Animated.View style={[styles.listWrap, { opacity: listFade }]}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={`${activeTab}-${selectedBoardingPoint?.id}-${selectedDroppingPoint?.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 116 + Math.max(insets.bottom, 16) },
          ]}
          ListHeaderComponent={
            <Text style={styles.listTitle}>
              All {activeTab} points in {city}
            </Text>
          }
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
        />
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            disabled={!isReady}
            onPress={proceed}
            onPressIn={buttonPressIn}
            onPressOut={buttonPressOut}
            style={({ pressed }) => [
              styles.ctaShadow,
              !isReady && styles.ctaDisabledShadow,
              pressed && isReady && styles.ctaPressed,
            ]}
          >
            <LinearGradient
              colors={isReady ? ["#2F7AF7", COLORS.primary] : ["#B8C3D4", COLORS.disabled]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cta}
            >
              <Text style={[styles.ctaText, !isReady && styles.ctaTextDisabled]}>Proceed</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const TabButton = ({ title, subtitle, active, onPress }) => (
  <TouchableOpacity style={styles.tabButton} onPress={onPress} activeOpacity={0.78}>
    <Text style={[styles.tabTitle, active && styles.tabTitleActive]} numberOfLines={1}>{title}</Text>
    <Text style={[styles.tabSubtitle, active && styles.tabSubtitleActive]} numberOfLines={1}>{subtitle}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    minHeight: 68,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: "#111827",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    zIndex: 2,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0,
  },
  routeSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  tabs: {
    height: 58,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  tabTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  tabTitleActive: {
    color: COLORS.primary,
    fontWeight: "900",
  },
  tabSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "600",
    marginTop: 2,
  },
  tabSubtitleActive: {
    color: COLORS.primary,
  },
  tabIndicator: {
    position: "absolute",
    left: 0,
    bottom: -1,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  listWrap: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  listTitle: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 14,
  },
  card: {
    minHeight: 74,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(229,231,235,0.9)",
    shadowColor: "#1F2937",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardSelected: {
    borderColor: "rgba(37,99,235,0.42)",
    backgroundColor: "#FBFDFF",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.14,
  },
  cardCopy: {
    flex: 1,
    paddingRight: 12,
  },
  pointName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
  landmark: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
    marginTop: 5,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  time: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "700",
    minWidth: 38,
    textAlign: "right",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.3,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  radioSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 14,
    backgroundColor: "rgba(234,242,251,0.96)",
  },
  ctaShadow: {
    borderRadius: 15,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  ctaDisabledShadow: {
    shadowOpacity: 0.05,
    elevation: 1,
  },
  ctaPressed: {
    opacity: 0.94,
  },
  cta: {
    minHeight: 58,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
  },
  ctaTextDisabled: {
    color: "#EEF2F7",
  },
});
