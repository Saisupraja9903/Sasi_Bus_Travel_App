import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import FilterScreen, { initialFilterState } from "./FilterScreen";

const busList = [
  {
    id: "b1",
    name: "Srivastava Travels",
    price: 800,
    duration: 9.3,
    departure: "21:55",
    arrival: "07:15",
    rating: 4.8,
    seatsAvailable: 13,
    typeTag: "AC Sleeper",
    ac: true,
    seatType: "sleeper",
    operator: "Jagan Travels",
    pickupPoint: "Miyapur",
    droppingPoint: "Secunderabad",
    smartCancellation: true,
    departureTimeSlot: "18_24",
    route: ["Hyderabad", "Kurnool", "Gooty", "Anantapur", "Bangalore"],
    photos: [
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "bed-outline", label: "Blanket & Pillow" },
      { icon: "television-guide", label: "Entertainment" },
      { icon: "cctv", label: "CCTV Tracking" },
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "battery-charging", label: "Charging Point" },
    ],
    boardingPoints: [
      { title: "Miyapur", subtitle: "Near petrol bunk" },
      { title: "Kukatpally", subtitle: "Opposite Mall" },
      { title: "Ameerpet", subtitle: "Near metro station" },
    ],
    droppingPoints: [
      { title: "Secunderabad", subtitle: "Railway Station" },
      { title: "Jubilee Hills", subtitle: "Check Post" },
      { title: "Gachibowli", subtitle: "DLF Building" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.60 },
      { stars: 4, percent: 0.20 },
      { stars: 3, percent: 0.10 },
      { stars: 2, percent: 0.05 },
      { stars: 1, percent: 0.05 },
    ],
  },
  {
    id: "b2",
    name: "Kaveri Travels",
    price: 1200,
    duration: 10.1,
    departure: "21:25",
    arrival: "07:30",
    rating: 2.4,
    seatsAvailable: 12,
    typeTag: "AC Seater",
    ac: true,
    seatType: "seater",
    operator: "Kaveri Travels",
    pickupPoint: "Ameerpet",
    droppingPoint: "Jubilee Hills",
    route: ["Hyderabad", "Bangalore"],
    photos: [
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "television-guide", label: "Entertainment" },
      { icon: "battery-charging", label: "Charging Point" },
    ],
    boardingPoints: [
      { title: "Ameerpet", subtitle: "Near metro station" },
      { title: "Kukatpally", subtitle: "Opposite Mall" },
    ],
    droppingPoints: [
      { title: "Jubilee Hills", subtitle: "Check Post" },
      { title: "Gachibowli", subtitle: "DLF Building" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.10 },
      { stars: 4, percent: 0.15 },
      { stars: 3, percent: 0.25 },
      { stars: 2, percent: 0.30 },
      { stars: 1, percent: 0.20 },
    ],
    smartCancellation: false,
    departureTimeSlot: "18_24",
  },
  {
    id: "b3",
    name: "DNMR Travels",
    price: 1300,
    duration: 10.0,
    departure: "22:15",
    arrival: "08:15",
    rating: 4.8,
    seatsAvailable: 18,
    typeTag: "NonAC Seater",
    ac: false,
    seatType: "seater",
    operator: "Somanvi Vinayak Travels",
    pickupPoint: "Gachibowli",
    droppingPoint: "Hitec City",
    route: ["Hyderabad", "Hitec City"],
    photos: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "cctv", label: "CCTV Tracking" },
      { icon: "wifi", label: "Wi-Fi" },
    ],
    boardingPoints: [
      { title: "Gachibowli", subtitle: "DLF Building" },
    ],
    droppingPoints: [
      { title: "Hitec City", subtitle: "Near Cyber Towers" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.70 },
      { stars: 4, percent: 0.15 },
      { stars: 3, percent: 0.10 },
      { stars: 2, percent: 0.03 },
      { stars: 1, percent: 0.02 },
    ],
    smartCancellation: true,
    departureTimeSlot: "18_24",
  },
  {
    id: "b4",
    name: "Mozo Travels",
    price: 900,
    duration: 10.8,
    departure: "22:30",
    arrival: "09:15",
    rating: 3.4,
    seatsAvailable: 9,
    typeTag: "AC Sleeper",
    ac: true,
    seatType: "sleeper",
    operator: "Divya Travels",
    pickupPoint: "Madhapur",
    droppingPoint: "LB Nagar",
    route: ["Hyderabad", "LB Nagar"],
    photos: [
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "bed-outline", label: "Blanket & Pillow" },
      { icon: "battery-charging", label: "Charging Point" },
    ],
    boardingPoints: [
      { title: "Madhapur", subtitle: "Near Durgam Cheruvu" },
    ],
    droppingPoints: [
      { title: "LB Nagar", subtitle: "Bus Stop" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.30 },
      { stars: 4, percent: 0.25 },
      { stars: 3, percent: 0.20 },
      { stars: 2, percent: 0.15 },
      { stars: 1, percent: 0.10 },
    ],
    smartCancellation: false,
    departureTimeSlot: "18_24",
  },
  {
    id: "b5",
    name: "Mahendra Travels",
    price: 1600,
    duration: 9.8,
    departure: "21:10",
    arrival: "06:55",
    rating: 4.2,
    seatsAvailable: 20,
    typeTag: "AC Sleeper",
    ac: true,
    seatType: "sleeper",
    operator: "Mahendra Travels",
    pickupPoint: "Kukatpally",
    droppingPoint: "Secunderabad",
    route: ["Hyderabad", "Secunderabad"],
    photos: [
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "bed-outline", label: "Blanket & Pillow" },
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "battery-charging", label: "Charging Point" },
    ],
    boardingPoints: [
      { title: "Kukatpally", subtitle: "Opposite Mall" },
    ],
    droppingPoints: [
      { title: "Secunderabad", subtitle: "Railway Station" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.50 },
      { stars: 4, percent: 0.30 },
      { stars: 3, percent: 0.10 },
      { stars: 2, percent: 0.05 },
      { stars: 1, percent: 0.05 },
    ],
    smartCancellation: true,
    departureTimeSlot: "18_24",
  },
  {
    id: "b6",
    name: "Samanvi Citiconnect",
    price: 1100,
    duration: 10.0,
    departure: "21:35",
    arrival: "07:00",
    rating: 4.8,
    seatsAvailable: 20,
    typeTag: "AC Sleeper",
    ac: true,
    seatType: "sleeper",
    operator: "Samanvi Citiconnect",
    pickupPoint: "Kukatpally",
    droppingPoint: "Madhapur",
    route: ["Hyderabad", "Madhapur"],
    photos: [
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "television-guide", label: "Entertainment" },
      { icon: "cctv", label: "CCTV Tracking" },
    ],
    boardingPoints: [
      { title: "Kukatpally", subtitle: "Opposite Mall" },
    ],
    droppingPoints: [
      { title: "Madhapur", subtitle: "Near Durgam Cheruvu" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.65 },
      { stars: 4, percent: 0.20 },
      { stars: 3, percent: 0.10 },
      { stars: 2, percent: 0.03 },
      { stars: 1, percent: 0.02 },
    ],
    smartCancellation: false,
    departureTimeSlot: "18_24",
  },
  {
    id: "b7",
    name: "Flix Bus",
    price: 890,
    duration: 9.9,
    departure: "22:15",
    arrival: "08:05",
    rating: 4.0,
    seatsAvailable: 18,
    typeTag: "AC Seater",
    ac: true,
    seatType: "seater",
    operator: "Flix Bus",
    pickupPoint: "Kukatpally",
    droppingPoint: "Madhapur",
    route: ["Hyderabad", "Madhapur"],
    photos: [
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "battery-charging", label: "Charging Point" },
    ],
    boardingPoints: [
      { title: "Kukatpally", subtitle: "Opposite Mall" },
    ],
    droppingPoints: [
      { title: "Madhapur", subtitle: "Near Durgam Cheruvu" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.40 },
      { stars: 4, percent: 0.30 },
      { stars: 3, percent: 0.20 },
      { stars: 2, percent: 0.05 },
      { stars: 1, percent: 0.05 },
    ],
    smartCancellation: true,
    departureTimeSlot: "18_24",
  },
  {
    id: "b8",
    name: "MR Travels",
    price: 666,
    duration: 10.2,
    departure: "22:00",
    arrival: "08:55",
    rating: 4.0,
    seatsAvailable: 20,
    typeTag: "AC Seater",
    ac: true,
    seatType: "seater",
    operator: "MR Travels",
    pickupPoint: "Kukatpally",
    droppingPoint: "Gachibowli",
    route: ["Hyderabad", "Gachibowli"],
    photos: [
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "cctv", label: "CCTV Tracking" },
      { icon: "battery-charging", label: "Charging Point" },
    ],
    boardingPoints: [
      { title: "Kukatpally", subtitle: "Opposite Mall" },
    ],
    droppingPoints: [
      { title: "Gachibowli", subtitle: "DLF Building" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.45 },
      { stars: 4, percent: 0.25 },
      { stars: 3, percent: 0.15 },
      { stars: 2, percent: 0.10 },
      { stars: 1, percent: 0.05 },
    ],
    smartCancellation: true,
    departureTimeSlot: "18_24",
  },
  {
    id: "b9",
    name: "BSR Travels",
    price: 480,
    duration: 10.5,
    departure: "23:15",
    arrival: "10:00",
    rating: 4.0,
    seatsAvailable: 20,
    typeTag: "AC Seater",
    ac: true,
    seatType: "seater",
    operator: "BSR Travels",
    pickupPoint: "Kukatpally",
    droppingPoint: "Madhapur",
    route: ["Hyderabad", "Madhapur"],
    photos: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "bed-outline", label: "Blanket & Pillow" },
      { icon: "television-guide", label: "Entertainment" },
    ],
    boardingPoints: [
      { title: "Kukatpally", subtitle: "Opposite Mall" },
    ],
    droppingPoints: [
      { title: "Madhapur", subtitle: "Near Durgam Cheruvu" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.35 },
      { stars: 4, percent: 0.30 },
      { stars: 3, percent: 0.20 },
      { stars: 2, percent: 0.10 },
      { stars: 1, percent: 0.05 },
    ],
    smartCancellation: true,
    departureTimeSlot: "18_24",
  },
  {
    id: "b10",
    name: "VRL Travels",
    price: 950,
    duration: 9.6,
    departure: "21:40",
    arrival: "07:20",
    rating: 4.4,
    seatsAvailable: 14,
    typeTag: "AC Sleeper",
    ac: true,
    seatType: "sleeper",
    operator: "VRL Travels",
    pickupPoint: "Kukatpally",
    droppingPoint: "Hitech City",
    route: ["Hyderabad", "Hitech City"],
    photos: [
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "bed-outline", label: "Blanket & Pillow" },
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "battery-charging", label: "Charging Point" },
    ],
    boardingPoints: [
      { title: "Kukatpally", subtitle: "Opposite Mall" },
    ],
    droppingPoints: [
      { title: "Hitech City", subtitle: "Near Cyber Towers" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.55 },
      { stars: 4, percent: 0.25 },
      { stars: 3, percent: 0.10 },
      { stars: 2, percent: 0.05 },
      { stars: 1, percent: 0.05 },
    ],
    smartCancellation: true,
    departureTimeSlot: "18_24",
  },
  {
    id: "b11",
    name: "RedBus Express",
    price: 730,
    duration: 10.0,
    departure: "21:05",
    arrival: "07:05",
    rating: 4.1,
    seatsAvailable: 15,
    typeTag: "AC Seater",
    ac: true,
    seatType: "seater",
    operator: "RedBus Express",
    pickupPoint: "Kukatpally",
    droppingPoint: "Gachibowli",
    route: ["Hyderabad", "Gachibowli"],
    photos: [
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "television-guide", label: "Entertainment" },
      { icon: "cctv", label: "CCTV Tracking" },
    ],
    boardingPoints: [
      { title: "Kukatpally", subtitle: "Opposite Mall" },
    ],
    droppingPoints: [
      { title: "Gachibowli", subtitle: "DLF Building" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.40 },
      { stars: 4, percent: 0.30 },
      { stars: 3, percent: 0.20 },
      { stars: 2, percent: 0.05 },
      { stars: 1, percent: 0.05 },
    ],
    smartCancellation: false,
    departureTimeSlot: "18_24",
  },
  {
    id: "b12",
    name: "Shree Travels",
    price: 820,
    duration: 9.8,
    departure: "22:10",
    arrival: "08:10",
    rating: 4.3,
    seatsAvailable: 17,
    typeTag: "AC Sleeper",
    ac: true,
    seatType: "sleeper",
    operator: "Shree Travels",
    pickupPoint: "Kukatpally",
    droppingPoint: "Secunderabad",
    route: ["Hyderabad", "Secunderabad"],
    photos: [
      "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    ],
    amenities: [
      { icon: "bed-outline", label: "Blanket & Pillow" },
      { icon: "wifi", label: "Wi-Fi" },
    ],
    boardingPoints: [
      { title: "Kukatpally", subtitle: "Opposite Mall" },
    ],
    droppingPoints: [
      { title: "Secunderabad", subtitle: "Railway Station" },
    ],
    ratingDistribution: [
      { stars: 5, percent: 0.50 },
      { stars: 4, percent: 0.30 },
      { stars: 3, percent: 0.10 },
      { stars: 2, percent: 0.05 },
      { stars: 1, percent: 0.05 },
    ],
    smartCancellation: true,
    departureTimeSlot: "18_24",
  },
];

const getRatingColor = (rating) => {
  if (rating < 2.5) return "#E53935";
  if (rating < 3.5) return "#FB8C00";
  return "#4CAF50";
};

export default function BusResultsScreen({ route }) {
  const navigation = useNavigation();
  const { from, to, date, seatType } = route.params || {};

  const fromCity = (from || "").split(",")[0] || "From";
  const toCity = (to || "").split(",")[0] || "To";

  const journeyDate = date ? new Date(date) : new Date();
  const dateText = journeyDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const dayText = journeyDate.toLocaleDateString("en-GB", { weekday: "short" });

  const [sortOption, setSortOption] = useState("cheapest");
  const [filters, setFilters] = useState(initialFilterState);
  const [buses, setBuses] = useState(busList);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetMode, setBottomSheetMode] = useState("sort");

  const applySortAndFilters = useCallback(() => {
    let result = [...busList];

    // Filter by seatType from HomeScreen
    if (seatType) {
      result = result.filter((b) => b.seatType === seatType);
    }

    if (filters.ac) {
      result = result.filter((b) => (filters.ac === "ac" ? b.ac : !b.ac));
    }

    if (filters.seatType.length > 0) {
      result = result.filter((b) => filters.seatType.includes(b.seatType));
    }

    if (filters.smartCancellation) {
      result = result.filter((b) => b.smartCancellation);
    }

    result = result.filter((b) => b.price >= filters.priceRange[0] && b.price <= filters.priceRange[1]);

    if (filters.pickupTime.length > 0) {
      result = result.filter((b) => {
        const hour = Number(b.departure.split(":")[0]);
        return filters.pickupTime.some((slot) => {
          switch (slot) {
            case "00_06":
              return hour >= 0 && hour < 6;
            case "06_12":
              return hour >= 6 && hour < 12;
            case "12_18":
              return hour >= 12 && hour < 18;
            case "18_24":
              return hour >= 18 || hour < 24;
            default:
              return true;
          }
        });
      });
    }

    if (filters.singleSeat) {
      result = result.filter((b) => b.seatType === "sleeper" || b.seatType === "seater");
    }

    if (filters.operators.length > 0) {
      result = result.filter((b) => filters.operators.includes(b.operator));
    }

    if (filters.pickupPoints.length > 0) {
      result = result.filter((b) => filters.pickupPoints.includes(b.pickupPoint));
    }

    if (filters.droppingPoints.length > 0) {
      result = result.filter((b) => filters.droppingPoints.includes(b.droppingPoint));
    }

    if (sortOption === "cheapest") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "fastest") {
      result.sort((a, b) => a.duration - b.duration);
    } else if (sortOption === "early") {
      result.sort((a, b) => Number(a.departure.replace(":", ".")) - Number(b.departure.replace(":", ".")));
    } else if (sortOption === "late") {
      result.sort((a, b) => Number(b.departure.replace(":", ".")) - Number(a.departure.replace(":", ".")));
    }

    setBuses(result);
  }, [filters, sortOption]);

  useEffect(() => {
    applySortAndFilters();
  }, [applySortAndFilters]);

  const onApplyFromFilter = ({ sortOption: newSort, filters: newFilters }) => {
    if (newSort) setSortOption(newSort);
    if (newFilters) setFilters(newFilters);
    setBottomSheetVisible(false);
  };

  const openSort = () => {
    setBottomSheetMode("sort");
    setBottomSheetVisible(true);
  };

  const openOtherFilters = () => {
    setBottomSheetMode("filter");
    setBottomSheetVisible(true);
  };

  const activeChips = [];
  if (filters.ac) activeChips.push(filters.ac === "ac" ? "AC" : "NON AC");
  if (filters.seatType.length) activeChips.push(...filters.seatType.map((s) => s.toUpperCase()));
  if (filters.smartCancellation) activeChips.push("Smart Cancellation");
  if (filters.priceRange[0] !== initialFilterState.priceRange[0] || filters.priceRange[1] !== initialFilterState.priceRange[1]) {
    activeChips.push(`₹${filters.priceRange[0]}-₹${filters.priceRange[1]}`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Text style={styles.routeTitle}>{`${fromCity} to ${toCity}`}</Text>
            <Text style={styles.busCount}>{buses.length} buses found</Text>
          </View>

          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{dateText}</Text>
            <Text style={styles.dayText}>{dayText}</Text>
          </View>
        </View>

        {activeChips.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
            <Text style={styles.chip}>Sort: {sortOption}</Text>
            {activeChips.map((text, i) => (
              <Text key={`${text}-${i}`} style={styles.chip}>{text}</Text>
            ))}
          </ScrollView>
        )}
        </View>

        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {buses.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No buses found for selected filters</Text>
            </View>
          ) : (
            buses.map((bus) => (
              <View key={bus.id} style={styles.card}>
                <View style={styles.cardMain}>
                  {/* Left Column: Bus Details */}
                  <View style={styles.leftCol}>
                    <Text style={styles.busName}>{bus.name}</Text>
                    <Text style={styles.time}>
                      {bus.departure} - {bus.arrival}
                    </Text>
                    <Text style={styles.details}>
                      Available seats: {bus.seatsAvailable}
                    </Text>
                    <Text style={styles.details}>
                      {bus.typeTag} / {bus.seatType === "sleeper" ? "Sleeper(2+1)" : "Seater"}
                    </Text>
                  </View>

                  {/* Right Column: Price, Rating, Book Button */}
                  <View style={styles.rightCol}>
                    <Text style={styles.price}>₹{bus.price}</Text>

                    <View
                      style={[
                        styles.ratingBadge,
                        { borderColor: getRatingColor(bus.rating) },
                      ]}
                    >
                      <FontAwesome
                        color={getRatingColor(bus.rating)}
                        name="star"
                        size={10}
                      />
                      <Text
                        style={[
                          styles.ratingText,
                          { color: getRatingColor(bus.rating) },
                        ]}
                      >
                        {bus.rating}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => navigation.navigate(bus.seatType === 'seater' ? 'SeaterSeatSelection' : 'SleeperSeatSelection', { bus })}
                    >
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <FilterScreen
          visible={bottomSheetVisible}
          mode={bottomSheetMode}
          currentSort={sortOption}
          currentFilters={filters}
          onApply={onApplyFromFilter}
          onClose={() => setBottomSheetVisible(false)}
        />

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.filterBtn} onPress={openSort}>
            <MaterialIcons name="sort" size={20} color="#2F80ED" />
            <Text style={styles.filterBtnText}>Sort By Price</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterBtn} onPress={openOtherFilters}>
            <MaterialIcons name="tune" size={20} color="#2F80ED" />
            <Text style={styles.filterBtnText}>Other Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, paddingTop: 16,paddingHorizontal: 16 },
  header: { paddingVertical: 14, paddingHorizontal: 12, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { padding: 6 },
  headerTitle: { flex: 1, paddingLeft: 10 },
  routeTitle: { fontSize: 18, fontWeight: '700' },
  busCount: { fontSize: 13, color: '#555', marginTop: 4 },
  dateBadge: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#F5F5F5', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dateText: { fontSize: 12, fontWeight: '700' },
  dayText: { fontSize: 10, color: '#777' },
  filterBar: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, backgroundColor: '#fff', borderRadius: 10, padding: 8, elevation: 2 },
  bottomBar: { position: 'absolute', left: 16, right: 16, bottom: 16, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  filterBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#2F80ED', backgroundColor: '#fff' },
  filterBtnText: { color: '#2F80ED', marginLeft: 6, fontWeight: '700' },
  chipsRow: { marginVertical: 10 },
  chip: { backgroundColor: '#E6F0FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginRight: 6, fontSize: 12, color: '#2F80ED' },
  listContainer: { paddingTop: 10, paddingBottom: 190 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 14, margin: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  cardMain: { flexDirection: 'row', justifyContent: 'space-between' },
  leftCol: { flex: 1, paddingRight: 10 },
  rightCol: { alignItems: 'flex-end', justifyContent: 'space-between' },
  busName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  time: { fontSize: 13, color: '#555', marginBottom: 12 },
  details: { fontSize: 12, color: '#777', marginBottom: 2 },
  price: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 12 },
  ratingText: { fontSize: 11, marginLeft: 4, fontWeight: '600' },
  bookButton: { backgroundColor: '#2F80ED', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
  bookButtonText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  noResults: { marginTop: 40, alignItems: 'center' },
  noResultsText: { fontSize: 16, color: '#777' },
});
