import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function BoardingScreen({ navigation, route }) {
  const selectedSeats = route?.params?.selectedSeats || [];
  const bus = route?.params?.bus || {};
  const date = route?.params?.date;
  const [tab, setTab] = useState("boarding");
  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedDropping, setSelectedDropping] = useState(null);

  // ✅ Enable only when BOTH selected
  const isEnabled = selectedBoarding !== null && selectedDropping !== null;

  const boardingPoints = [
    {
      id: 1,
      name: "Lingampalli",
      sub: "Jyothi theater towards lingampalli",
      time: "19:30",
    },
    {
      id: 2,
      name: "Chanda nagar",
      sub: "Near kinara grand hotel",
      time: "19:30",
    },
    { id: 3, name: "Gangaram", sub: "Mangaly shopping mall", time: "19:30" },
    {
      id: 4,
      name: "Deepthi sri nagar",
      sub: "RS Brother shopping mall",
      time: "19:30",
    },
    {
      id: 5,
      name: "Madinaguda",
      sub: "Bajaj electronics showroom",
      time: "19:30",
    },
    {
      id: 6,
      name: "Miyapur Allwin X roads",
      sub: "Hotel Sithara opp temple",
      time: "19:30",
    },
  ];

  const droppingPoints = [
    { id: 1, name: "Madhavapatnam", sub: "Dmr travels", time: "07:50" },
    { id: 2, name: "Pratap Nagar", sub: "Near Bus stop", time: "07:55" },
    { id: 3, name: "Govt Hospital", sub: "Kakinada", time: "08:00" },
  ];

  const data = tab === "boarding" ? boardingPoints : droppingPoints;
  const selectedBoardingPoint = boardingPoints.find((item) => item.id === selectedBoarding);
  const selectedDroppingPoint = droppingPoints.find((item) => item.id === selectedDropping);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>Select boarding & dropping points</Text>
          <Text style={styles.subTitle}>Hyderabad - Kakinada</Text>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("boarding")}>
          <Text
            style={[styles.tabText, tab === "boarding" && styles.activeTab]}
          >
            Boarding points
          </Text>
          {tab === "boarding" && <View style={styles.underline} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("dropping")}>
          <Text
            style={[styles.tabText, tab === "dropping" && styles.activeTab]}
          >
            Dropping points
          </Text>
          {tab === "dropping" && <View style={styles.underline} />}
        </TouchableOpacity>
      </View>

      <Text style={styles.allText}>All {tab} points</Text>

      {/* LIST */}
      <ScrollView>
        {data.map((item) => {
          const isSelected =
            tab === "boarding"
              ? selectedBoarding === item.id
              : selectedDropping === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => {
                if (tab === "boarding") {
                  setSelectedBoarding(item.id);

                  // ✅ Auto switch to dropping
                  setTab("dropping");
                } else {
                  setSelectedDropping(item.id);
                }
              }}
            >
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>{item.sub}</Text>
              </View>

              <View style={styles.right}>
                <Text style={styles.time}>{item.time}</Text>

                <View
                  style={[styles.radio, isSelected && styles.radioActive]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.proceedBtn, !isEnabled && styles.disabledBtn]}
        disabled={!isEnabled}
        onPress={() => {
          if (isEnabled) {
            navigation.navigate("PassengerDetailsScreen", {
              selectedSeats,
              boardingPoint: selectedBoardingPoint,
              droppingPoint: selectedDroppingPoint,
              bus,
              date,
            });
          }
        }}
      >
        <Text style={[styles.proceedText, !isEnabled && styles.disabledText]}>
          Proceed
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF2FB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  subTitle: {
    fontSize: 12,
    color: "#777",
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },

  tabText: {
    fontSize: 14,
    color: "#555",
  },

  activeTab: {
    color: "#1E73E8",
    fontWeight: "600",
  },

  underline: {
    height: 2,
    backgroundColor: "#1E73E8",
    marginTop: 4,
  },

  allText: {
    margin: 12,
    color: "#555",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#1E73E8",
  },

  name: {
    fontWeight: "600",
  },

  sub: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  time: {
    color: "#555",
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#999",
  },

  radioActive: {
    backgroundColor: "#1E73E8",
    borderColor: "#1E73E8",
  },

  proceedBtn: {
    backgroundColor: "#1E73E8",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  proceedText: {
    color: "#fff",
    fontWeight: "600",
  },

  disabledBtn: {
    backgroundColor: "#CFCFCF",
  },

  disabledText: {
    color: "#888",
  },
});
