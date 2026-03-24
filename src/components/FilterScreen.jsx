import React, { useEffect, useState, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions, TextInput } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export const initialFilterState = {
  ac: null,
  seatType: [],
  smartCancellation: false,
  priceRange: [0, 3000],
  pickupTime: [],
  singleSeat: false,
  operators: [],
  pickupPoints: [],
  droppingPoints: [],
};

const sortOptions = [
  { key: "cheapest", label: "Cheapest first", icon: "currency-rupee", iconSet: "MaterialCommunityIcons" },
  { key: "fastest", label: "Fastest first", icon: "flash-on", iconSet: "MaterialIcons" },
  { key: "early", label: "Early departure", icon: "wb-sunny", iconSet: "MaterialIcons" },
  { key: "late", label: "Late departure", icon: "bedtime", iconSet: "MaterialIcons" },
];

const seatTypeOptions = [
  { key: "sleeper", label: "Sleeper", icon: "hotel" },
  { key: "seater", label: "Seater", icon: "chair" },
];

const timeSlots = [
  { key: "00_06", label: "00:00 - 06:00", icon: "moon" },
  { key: "06_12", label: "06:00 - 12:00", icon: "sunny" },
  { key: "12_18", label: "12:00 - 18:00", icon: "partly-sunny" },
  { key: "18_24", label: "18:00 - 24:00", icon: "moon" },
];

const operators = [
  "Jagan Travels",
  "Kaveri Travels",
  "Somanvi Vinayak Travels",
  "Divya Travels",
  "Mahendra Travels",
  "Samanvi Citiconnect",
  "Flix Bus",
  "MR Travels",
  "BSR Travels",
  "VRL Travels",
  "RedBus Express",
  "Shree Travels",
];

const points = {
  pickup: ["Miyapur", "Ameerpet", "Gachibowli", "Madhapur", "Kukatpally"],
  dropping: ["Secunderabad", "Jubilee Hills", "Hitec City", "LB Nagar", "Madhapur", "Gachibowli"],
};

const toggleValue = (arr, value) =>
  arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];

export default function FilterScreen({
  visible = false,
  mode = "filter",
  currentSort = "cheapest",
  currentFilters = initialFilterState,
  onApply,
  onClose,
}) {
  const [selectedSort, setSelectedSort] = useState(currentSort);
  const [filters, setFilters] = useState(currentFilters);

  const [operatorSearch, setOperatorSearch] = useState("");
  const [pickupSearch, setPickupSearch] = useState("");
  const [droppingSearch, setDroppingSearch] = useState("");

  const [showModal, setShowModal] = useState(visible);
  const slideAnim = useRef(new Animated.Value(Dimensions.get("window").height)).current;

  useEffect(() => {
    setSelectedSort(currentSort);
    setFilters(currentFilters);
  }, [currentSort, currentFilters]);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      const height = Dimensions.get("window").height;
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowModal(false));
    }
  }, [visible]);

  const onClearAll = () => {
    setSelectedSort("cheapest");
    setFilters(initialFilterState);
    setOperatorSearch("");
    setPickupSearch("");
    setDroppingSearch("");
  };

  const apply = () => {
    if (onApply) onApply({ sortOption: selectedSort, filters });
    if (onClose) onClose();
  };

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <Modal visible={showModal} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBackground} activeOpacity={1} onPress={onClose} />

        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#1D1D1D" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{mode === "sort" ? "Sort" : "Filters"}</Text>

        <TouchableOpacity onPress={onClearAll} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {mode === "sort" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort by Price</Text>
            {sortOptions.map((option) => {
              const selected = selectedSort === option.key;
              const IconComponent = option.iconSet === "MaterialCommunityIcons" ? MaterialCommunityIcons : MaterialIcons;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.sortRow, selected && styles.sortRowActive]}
                  onPress={() => setSelectedSort(option.key)}
                >
                  <View style={styles.sortItem}>
                    <IconComponent name={option.icon} size={20} color={selected ? "#2F80ED" : "#555"} />
                    <Text style={[styles.sortLabel, selected && styles.sortLabelActive]}>{option.label}</Text>
                  </View>
                  {selected && <MaterialIcons name="check" size={20} color="#2F80ED" />}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AC</Text>
              <View style={styles.toggleRow}>
                {[
                  { key: "ac", label: "AC", icon: "snowflake" },
                  { key: "nonac", label: "Non AC", icon: "snowflake-off" },
                ].map((item) => {
                  const active = (item.key === "ac" && filters.ac === "ac") || (item.key === "nonac" && filters.ac === "nonac");
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[styles.toggleChip, active && styles.toggleChipActive]}
                      onPress={() => updateFilter("ac", active ? null : item.key === "ac" ? "ac" : "nonac")}
                    >
                      <MaterialCommunityIcons name={item.icon} size={16} color={active ? "#fff" : "#444"} />
                      <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Seat type</Text>
              <View style={styles.toggleRow}>
                {seatTypeOptions.map((item) => {
                  const active = filters.seatType.includes(item.key);
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[styles.toggleChip, active && styles.toggleChipActive]}
                      onPress={() => updateFilter("seatType", toggleValue(filters.seatType, item.key))}
                    >
                      <MaterialIcons name={item.icon} size={16} color={active ? "#fff" : "#444"} />
                      <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.sectionRow}>
              <MaterialIcons name="shield" size={18} color="#2F80ED" />
              <Text style={styles.sectionLabel}>Smart Cancellation available</Text>
              <TouchableOpacity
                style={[styles.checkbox, filters.smartCancellation && styles.checkboxActive]}
                onPress={() => updateFilter("smartCancellation", !filters.smartCancellation)}
              >
                {filters.smartCancellation ? (
                  <MaterialIcons name="check" size={16} color="#fff" />
                ) : null}
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price range</Text>
              <Text style={styles.rangeText}>₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}</Text>
              <View style={styles.sliderContainer}>
                <MultiSlider
                  values={[filters.priceRange[0], filters.priceRange[1]]}
                  sliderLength={Dimensions.get("window").width - 64}
                  onValuesChange={(values) => updateFilter("priceRange", values)}
                  min={0}
                  max={3000}
                  step={50}
                  allowOverlap={false}
                  snapped
                  selectedStyle={{ backgroundColor: "#2F80ED" }}
                  unselectedStyle={{ backgroundColor: "#d3d3d3" }}
                  markerStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#2F80ED",
                    borderWidth: 2,
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3
                  }}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pick up time</Text>
              <View style={styles.toggleRowWrap}>
                {timeSlots.map((slot) => {
                  const active = filters.pickupTime.includes(slot.key);
                  return (
                    <TouchableOpacity
                      key={slot.key}
                      style={[styles.slotChip, active && styles.slotChipActive]}
                      onPress={() => updateFilter("pickupTime", toggleValue(filters.pickupTime, slot.key))}
                    >
                      <Ionicons name={slot.icon} size={14} color={active ? "#fff" : "#333"} />
                      <Text style={[styles.slotLabel, active && styles.slotLabelActive]}>{slot.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.sectionRow}>
              <MaterialIcons name="airline-seat-individual-suite" size={18} color="#2F80ED" />
              <Text style={styles.sectionLabel}>Separate single window seat</Text>
              <TouchableOpacity
                style={[styles.checkbox, filters.singleSeat && styles.checkboxActive]}
                onPress={() => updateFilter("singleSeat", !filters.singleSeat)}
              >
                {filters.singleSeat ? <MaterialIcons name="check" size={16} color="#fff" /> : null}
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <View style={styles.rowWithTitle}>
                <Text style={styles.sectionTitle}>Operators</Text>
                <TouchableOpacity onPress={() => {
                  updateFilter("operators", []);
                  setOperatorSearch("");
                }}>
                  <Text style={styles.clearSub}>Clear</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.listSearch}
                placeholder="Search Operators"
                value={operatorSearch}
                onChangeText={setOperatorSearch}
              />
              {operators.filter(op => op.toLowerCase().includes(operatorSearch.toLowerCase())).map((o) => {
                const active = filters.operators.includes(o);
                return (
                  <TouchableOpacity
                    key={o}
                    style={styles.optionRow}
                    onPress={() => updateFilter("operators", toggleValue(filters.operators, o))}
                  >
                    <View style={styles.optionLeft}>
                      <MaterialIcons name={active ? "check-box" : "check-box-outline-blank"} size={20} color={active ? "#2F80ED" : "#999"} />
                      <Text style={styles.optionText}>{o}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.section}>
              <View style={styles.rowWithTitle}>
                <Text style={styles.sectionTitle}>Pick up points</Text>
                <TouchableOpacity onPress={() => {
                  updateFilter("pickupPoints", []);
                  setPickupSearch("");
                }}>
                  <Text style={styles.clearSub}>Clear</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.listSearch}
                placeholder="Search Pick up points"
                value={pickupSearch}
                onChangeText={setPickupSearch}
              />
              {points.pickup.filter(p => p.toLowerCase().includes(pickupSearch.toLowerCase())).map((p) => {
                const active = filters.pickupPoints.includes(p);
                return (
                  <TouchableOpacity
                    key={p}
                    style={styles.optionRow}
                    onPress={() => updateFilter("pickupPoints", toggleValue(filters.pickupPoints, p))}
                  >
                    <View style={styles.optionLeft}>
                      <MaterialIcons name={active ? "check-box" : "check-box-outline-blank"} size={20} color={active ? "#2F80ED" : "#999"} />
                      <Text style={styles.optionText}>{p}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.section}>
              <View style={styles.rowWithTitle}>
                <Text style={styles.sectionTitle}>Dropping points</Text>
                <TouchableOpacity onPress={() => {
                  updateFilter("droppingPoints", []);
                  setDroppingSearch("");
                }}>
                  <Text style={styles.clearSub}>Clear</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.listSearch}
                placeholder="Search Dropping points"
                value={droppingSearch}
                onChangeText={setDroppingSearch}
              />
              {points.dropping.filter(p => p.toLowerCase().includes(droppingSearch.toLowerCase())).map((p) => {
                const active = filters.droppingPoints.includes(p);
                return (
                  <TouchableOpacity
                    key={p}
                    style={styles.optionRow}
                    onPress={() => updateFilter("droppingPoints", toggleValue(filters.droppingPoints, p))}
                  >
                    <View style={styles.optionLeft}>
                      <MaterialIcons name={active ? "check-box" : "check-box-outline-blank"} size={20} color={active ? "#2F80ED" : "#999"} />
                      <Text style={styles.optionText}>{p}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity onPress={apply} style={styles.applyButton}>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingBottom: 22,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1B1B1B" },
  clearButton: { padding: 6 },
  clearText: { color: "#2F80ED", fontWeight: "600" },

  scrollContainer: { padding: 16, paddingBottom: 80 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#222" },
  sectionLabel: { marginLeft: 8, fontSize: 14, color: "#555" },
  rangeText: { marginTop: 6, marginBottom: 6, fontSize: 14, color: "#444" },
  sliderContainer: {
    alignItems: 'center',
    height: 30,
  },

  toggleRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  toggleRowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  toggleChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  toggleChipActive: {
    backgroundColor: "#2F80ED",
    borderColor: "#2F80ED",
  },
  toggleLabel: {
    color: "#333",
    marginLeft: 6,
    fontSize: 14,
  },
  toggleLabelActive: {
    color: "#fff",
  },
  slotChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  slotChipActive: {
    backgroundColor: "#2F80ED",
    borderColor: "#2F80ED",
  },
  slotLabel: { marginLeft: 6, color: "#333", fontSize: 13 },
  slotLabelActive: { color: "#fff" },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: { backgroundColor: "#2F80ED", borderColor: "#2F80ED" },
  singleRow: { flexDirection: "row", alignItems: "center", marginTop: 6, marginBottom: 8 },
  rowWithTitle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  optionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  optionText: { marginLeft: 10, color: "#333", fontSize: 14 },
  listSearch: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  clearSub: { color: "#2F80ED", fontWeight: "600" },
  sortRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: "#EEE", marginBottom: 8 },
  sortRowActive: { borderColor: "#2F80ED", backgroundColor: "#E8F1FF" },
  sortItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  sortLabel: { marginLeft: 10, fontSize: 15, color: "#333" },
  sortLabelActive: { color: "#2F80ED", fontWeight: "700" },
  applyButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#2F80ED",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
