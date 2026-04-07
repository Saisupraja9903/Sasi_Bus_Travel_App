import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Share,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AppModal from "./AppModal";

export default function PersonalInfoScreen({ navigation }) {
  const route = useRoute();
  const { selectedSeats = [], boardingPoint, droppingPoint, bus, date: dateString } = route.params || {};
  const [insurance, setInsurance] = useState(true);

  const [showTripDetails, setShowTripDetails] = useState(false);
  const [isContactEditOpen, setIsContactEditOpen] = useState(false);

  const phoneNumber = route.params?.phone || "+91 9393939393";
  const boardingLocation = boardingPoint?.sub || bus?.pickupPoint || "Hyderabad";

  const [contactNumber, setContactNumber] = useState(phoneNumber);
  const [contactCity, setContactCity] = useState(boardingLocation);

  // Passenger State
  const [passengers, setPassengers] = useState([
    { id: 1, name: "", age: "", gender: "Male" },
  ]);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [modalPassengers, setModalPassengers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDeletingFromMain, setIsDeletingFromMain] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [passengerToDelete, setPassengerToDelete] = useState(null);

  const departureTime = boardingPoint?.time || bus?.departure || "21:00 PM";
  const arrivalTime = droppingPoint?.time || bus?.arrival || "06:15 PM";
  const sourceCity = boardingPoint?.name || bus?.pickupPoint || "Hyderabad";
  const destinationCity = droppingPoint?.name || bus?.droppingPoint || "Kakinada";
  const duration = bus?.duration 
    ? `${Math.floor(bus.duration)}hrs ${Math.round((bus.duration % 1) * 60)}mins` 
    : "9hrs 15mins";

  const travelDate = dateString ? new Date(dateString) : new Date();

  // Helper to format date
  const formatDateWithWeekday = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatShortDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(/\s/g, ' ');
  };

  // Logic to determine if arrival is next day
  const departureHour = parseInt((departureTime || "00:00").split(':')[0]);
  const arrivalHour = parseInt((arrivalTime || "00:00").split(':')[0]);
  const isNextDay = arrivalHour < departureHour || (departureTime.includes('PM') && arrivalTime.includes('AM'));

  const arrivalDate = new Date(travelDate);
  if (isNextDay) {
    arrivalDate.setDate(travelDate.getDate() + 1);
  }

  const departureDateLabel = travelDate.toDateString() === new Date().toDateString() ? 'Today' : formatShortDate(travelDate).split(' ').slice(0, 2).join(' ');
  const arrivalDateLabel = arrivalDate.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() ? 'Tomorrow' : formatShortDate(arrivalDate).split(' ').slice(0, 2).join(' ');

  const onShare = async () => {
    try {
      await Share.share({
        message: `My Bus Trip Details:\n\nBus: ${bus?.name || "Srivastav Travels"} (${bus?.typeTag || "A/c Sleeper (2+1)"})\nRoute: ${sourceCity} to ${destinationCity}\nDate: ${formatDateWithWeekday(travelDate)}\nDeparture: ${departureTime} from ${boardingLocation}\nArrival: ${arrivalTime} at ${droppingPoint?.sub || destinationCity}\nSeats: ${seatLabel}`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const seatLabel = selectedSeats.length ? selectedSeats.join(", ") : "L10";
  const seatType = bus?.typeTag || "Sleeper";
  
  // Fare Calculation
  const ticketPrice = bus?.price || 1000;
  const baseFare = ticketPrice * selectedSeats.length;
  const platformFee = 20;
  const insuranceFee = insurance ? 20 : 0;
  const discount = 100;
  const totalPaid = baseFare + platformFee + insuranceFee - discount;

  // Passenger Modal Handlers
  const handleOpenPassengerModal = () => {
    // Deep copy to avoid mutating original state until save
    setModalPassengers(JSON.parse(JSON.stringify(passengers)));
    setErrors({});
    setIsPassengerModalOpen(true);
  };

  const handleClosePassengerModal = () => {
    setIsPassengerModalOpen(false);
  };

  const handleSavePassengers = () => {
    let newErrors = {};
    let isValid = true;

    modalPassengers.forEach((p) => {
      let pErr = {};
      if (!p.name.trim()) {
        pErr.name = "Please fill the name";
        isValid = false;
      }
      const ageNum = parseInt(p.age, 10);
      if (!p.age.trim() || isNaN(ageNum) || ageNum < 1) {
        pErr.age = "Enter valid age (1-100)";
        isValid = false;
      }
      if (Object.keys(pErr).length > 0) {
        newErrors[p.id] = pErr;
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setPassengers(modalPassengers);
    handleClosePassengerModal();
  };

  const handleAddPassenger = () => {
    setModalPassengers([
      ...modalPassengers,
      { id: Date.now(), name: "", age: "", gender: "Male" },
    ]);
  };

  const handleDeletePassenger = (id, fromMain = false) => {
    setPassengerToDelete(id);
    setIsDeletingFromMain(fromMain);
    setDeleteModalVisible(true);
  };

  const confirmDeletePassenger = () => {
    if (passengerToDelete) {
      if (isDeletingFromMain) {
        setPassengers(passengers.filter((p) => p.id !== passengerToDelete));
      } else {
        setModalPassengers(modalPassengers.filter((p) => p.id !== passengerToDelete));
      }
      setDeleteModalVisible(false);
      setPassengerToDelete(null);
      setIsDeletingFromMain(false);
    }
  };

  const handlePassengerChange = (id, field, value) => {
    let finalValue = value;

    if (field === "age") {
      // Only allow numeric characters and restrict max to 100
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue !== "") {
        const num = parseInt(numericValue, 10);
        finalValue = num > 100 ? "100" : numericValue;
      } else {
        finalValue = "";
      }
    }

    setModalPassengers(
      modalPassengers.map((p) => (p.id === id ? { ...p, [field]: finalValue } : p))
    );
    // Clear specific field error when user starts typing
    if (errors[id] && errors[id][field]) {
      setErrors(prev => {
        const next = { ...prev };
        const pErrors = { ...next[id] };
        delete pErrors[field];
        next[id] = pErrors;
        return next;
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Passenger Info</Text>
        </View>

        {/* OFFER BANNER */}
        <View style={styles.offerBanner}>
          <Text style={styles.offerText}>
            🎉 You are saving 100 off on first booking
          </Text>
        </View>

        {/* TRIP SUMMARY */}
        <View style={styles.tripContainer}>
          <View style={styles.timeRow}>
            <View>
              <Text style={styles.date}>{departureDateLabel}</Text>
              <Text style={styles.time}>{departureTime}</Text>
              <Text style={styles.city}>{sourceCity}</Text>
              <Text style={styles.location}>{boardingLocation}</Text>
            </View>

            <Text style={styles.duration}>{duration}</Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.date}>{arrivalDateLabel}</Text>
              <Text style={styles.time}>{arrivalTime}</Text>
              <Text style={styles.city}>{destinationCity}</Text>
              <Text style={styles.location}>{droppingPoint?.sub || destinationCity}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => setShowTripDetails(true)}>
            <Text style={styles.viewDetails}>View details</Text>
          </TouchableOpacity>

          <Modal
            animationType="fade"
            transparent={true}
            visible={showTripDetails}
            onRequestClose={() => setShowTripDetails(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>Trip Details</Text>
                  <View style={styles.modalHeaderActions}>
                    <TouchableOpacity onPress={onShare} style={styles.modalActionButton}>
                      <Ionicons name="share-social-outline" size={22} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTripDetails(false)} style={styles.modalActionButton}>
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                </View>

              {/* Content */}
              {/* 1. Travel Date */}
              <Text style={styles.tripDate}>{formatDateWithWeekday(travelDate)}</Text>
              <View style={styles.dividerLight} />

              {/* 2. From -> To */}
              <View style={styles.routeRow}>
                <View>
                  <Text style={styles.cityLabel}>From</Text>
                  <Text style={styles.cityName}>{sourceCity}</Text>
                </View>

                <View style={styles.durationWrapper}>
                  <Text style={styles.durationText}>{duration}</Text>
                  <View style={styles.durationLineContainer}>
                    <View style={styles.dot} />
                    <View style={styles.line} />
                    <View style={styles.dot} />
                  </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.cityLabel}>To</Text>
                  <Text style={styles.cityName}>{destinationCity}</Text>
                </View>
              </View>

              {/* 3. Travel Details */}
              <View style={styles.travelRow}>
                <Text style={styles.travelLabel}>Travel</Text>
                <Text style={styles.travelValue}>
                  {bus?.name || "Srivastav Travels"}
                </Text>
                <Text style={styles.travelSub}>
                  {bus?.typeTag || "A/c Sleeper (2+1)"}
                </Text>
              </View>

              {/* 4. Points */}
              <View style={styles.pointsRow}>
                <View style={styles.pointCol}>
                  <Text style={styles.pointLabel}>Boarding Point</Text>
                  <Text style={styles.pointValue}>{boardingLocation}</Text>
                  <Text style={styles.pointTime}>{formatShortDate(travelDate)} ({departureTime})</Text>
                </View>

                <View style={[styles.pointCol, { alignItems: "flex-end" }]}>
                  <Text style={styles.pointLabel}>Dropping Point</Text>
                  <Text style={styles.pointValue}>
                    {droppingPoint?.sub || destinationCity}
                  </Text>
                  <Text style={styles.pointTime}>{formatShortDate(arrivalDate)} ({arrivalTime})</Text>
                </View>
              </View>
              </View>
            </View>
          </Modal>
        </View>

        {/* CONTACT DETAILS */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Contact Details</Text>
            <TouchableOpacity onPress={() => setIsContactEditOpen(true)}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.smallText}>Required to communicate</Text>

          <View style={styles.contactRow}>
            <Ionicons name="call" size={16} color="#555" />
            <Text style={styles.contactText}>{phoneNumber}</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="location" size={16} color="#555" />
            <Text style={styles.contactText}>{boardingLocation}</Text>
          </View>
        </View>

        {/* CONTACT EDIT MODAL */}
        <Modal
          visible={isContactEditOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsContactEditOpen(false)}
        >
          <TouchableOpacity 
            style={styles.contactModalOverlay} 
            activeOpacity={1} 
            onPress={() => setIsContactEditOpen(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.contactModalContent}>
                {/* Header */}
                <View style={styles.contactModalHeader}>
                  <Text style={styles.contactModalTitle}>Contact Details</Text>
                  <TouchableOpacity onPress={() => setIsContactEditOpen(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <View style={styles.contactModalDivider} />

                {/* Inputs */}
                <Text style={styles.inputLabel}>Enter Mobile Number</Text>
                <View style={styles.inputRowWrapper}>
                  <Text style={styles.prefix}>+91</Text>
                  <TextInput
                    value={contactNumber.replace('+91 ', '')}
                    onChangeText={(text) => setContactNumber(`+91 ${text}`)}
                    keyboardType="phone-pad"
                    style={styles.contactInput}
                    placeholder="9999999999"
                    placeholderTextColor="#999"
                    maxLength={10}
                  />
                </View>

                <Text style={styles.inputLabel}>Enter Location</Text>
                <View style={styles.inputRowWrapper}>
                  <TextInput
                    value={contactCity}
                    onChangeText={setContactCity}
                    style={styles.contactInput}
                    placeholder="City / Location"
                    placeholderTextColor="#999"
                  />
                </View>

                <TouchableOpacity style={styles.modalSaveBtn} onPress={() => setIsContactEditOpen(false)}>
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

        {/* PASSENGER DETAILS */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Passenger Details</Text>
            <TouchableOpacity onPress={handleOpenPassengerModal}>
              <Text style={styles.add}>+Add</Text>
            </TouchableOpacity>
          </View>

          {passengers.map((passenger, index) => (
            <View key={passenger.id} style={styles.passengerRow}>
              <Ionicons name="person-circle" size={32} color="#555" />
              <View style={{ flex: 1 }}>
                <Text style={styles.passengerTitle}>
                  {passenger.name || `Passenger ${index + 1}`}
                </Text>
                <Text style={styles.smallText}>
                  {passenger.age ? `${passenger.age} years, ` : ""}
                  {passenger.gender}
                </Text>
              </View>
              <View style={styles.mainActionRow}>
                <TouchableOpacity 
                  onPress={() => handleDeletePassenger(passenger.id, true)}
                  style={{ marginLeft: 0 }}
                >
                  <MaterialIcons name="delete" size={20} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <Text style={[styles.smallText, { marginTop: 8 }]}>
            Seats: {seatLabel} ({seatType})
          </Text>
        </View>

        {/* PASSENGER MODAL */}
        <Modal
          visible={isPassengerModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={handleClosePassengerModal}
        >
          <TouchableOpacity
            style={styles.contactModalOverlay}
            activeOpacity={1}
            onPress={handleClosePassengerModal}
          >
            <TouchableWithoutFeedback>
              <View style={styles.passengerModalContent}>
                <View style={styles.contactModalHeader}>
                  <Text style={styles.contactModalTitle}>Add Passenger</Text>
                  <TouchableOpacity onPress={handleClosePassengerModal}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <View style={styles.contactModalDivider} />

                <ScrollView showsVerticalScrollIndicator={false}>
                  {modalPassengers.length === 0 && (
                    <TouchableOpacity style={styles.addPassengerBtn} onPress={handleAddPassenger}>
                      <Ionicons name="add-circle-outline" size={20} color="#1A73E8" />
                      <Text style={styles.addPassengerBtnText}>Add Passenger</Text>
                    </TouchableOpacity>
                  )}
                  {modalPassengers.map((p, index) => (
                    <View key={p.id} style={styles.passengerInputGroup}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.passengerLabel}>
                          Passenger {index + 1}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {index === 0 && (
                            <TouchableOpacity onPress={handleAddPassenger} style={{ marginRight: 10 }}>
                              <Text style={styles.addInlineText}>+Add</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity onPress={() => handleDeletePassenger(p.id)}>
                            <MaterialIcons name="delete" size={20} color="#D32F2F" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      <Text style={styles.inputLabelSmall}>Full Name</Text>
                      <TextInput
                        placeholder="Full Name"
                        style={[styles.input, errors[p.id]?.name && styles.inputError]}
                        value={p.name}
                        onChangeText={(text) => handlePassengerChange(p.id, "name", text)}
                        autoCapitalize="words"
                        maxLength={50}
                      />
                      {errors[p.id]?.name && <Text style={styles.errorTextSmall}>{errors[p.id].name}</Text>}
                      
                      <Text style={[styles.inputLabelSmall, { marginTop: 10 }]}>Age</Text>
                      <TextInput
                        placeholder="Age"
                        keyboardType="numeric"
                        style={[styles.input, errors[p.id]?.age && styles.inputError]}
                        value={p.age}
                        onChangeText={(text) => handlePassengerChange(p.id, "age", text)}
                        maxLength={3}
                      />
                      {errors[p.id]?.age && <Text style={styles.errorTextSmall}>{errors[p.id].age}</Text>}

                      <Text style={[styles.inputLabelSmall, { marginTop: 15 }]}>Gender</Text>
                      <View style={styles.radioGroup}>
                        <TouchableOpacity
                          style={styles.radioContainer}
                          onPress={() => handlePassengerChange(p.id, "gender", "Male")}
                        >
                          <View style={[styles.radioButton, p.gender === "Male" && styles.radioButtonActive]}>
                            {p.gender === "Male" && <View style={styles.radioInner} />}
                          </View>
                          <Text style={styles.radioLabel}>Male</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.radioContainer}
                          onPress={() => handlePassengerChange(p.id, "gender", "Female")}
                        >
                          <View style={[styles.radioButton, p.gender === "Female" && styles.radioButtonActive]}>
                            {p.gender === "Female" && <View style={styles.radioInner} />}
                          </View>
                          <Text style={styles.radioLabel}>Female</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSavePassengers}>
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

        <AppModal
          visible={deleteModalVisible}
          title="Remove Passenger"
          message="Are you sure you want to remove this passenger? This action cannot be undone."
          type="error"
          showCancel={true}
          confirmText="Remove"
          onConfirm={confirmDeletePassenger}
          onCancel={() => setDeleteModalVisible(false)}
        />

        {/* OFFERS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Offers For You</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Offers")}> 
            <Text style={styles.viewAll}>View All Coupons</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.couponBox}>
          <Ionicons name="pricetag-outline" size={20} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Enter coupon code"
            style={styles.couponInput}
            placeholderTextColor="#999"
          />
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.apply}>APPLY</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.couponItem}>
          <Text>🎉 Student/Corp.reward</Text>
          <Ionicons name="chevron-forward" size={18} />
        </TouchableOpacity>

        {/* TRAVEL PROTECTION */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>Travel Protection</Text>
              <Text style={styles.smallText}>
                Insure your ride with just Rs 20
              </Text>
              <Text style={styles.link}>More Details</Text>
            </View>

            <Switch
              value={insurance}
              onValueChange={() => setInsurance(!insurance)}
            />
          </View>
        </View>

        {/* FARE BREAKUP */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Fare Breakup</Text>
            <Text style={styles.price}>₹{totalPaid}</Text>
          </View>

          <View style={styles.fareRow}>
            <Text>Base Fare</Text>
            <Text>₹{baseFare}</Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={{ color: "#2F80ED" }}>Discount</Text>
            <Text>- ₹{discount}</Text>
          </View>

          <View style={styles.fareRow}>
            <Text>Platform fee</Text>
            <Text>₹{platformFee}</Text>
          </View>

          <View style={styles.fareRow}>
            <Text>Travel Protection</Text>
            <Text>₹{insuranceFee}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.fareRow}>
            <Text style={styles.total}>Total Paid</Text>
            <Text style={styles.total}>₹{totalPaid}</Text>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalPaid}>Total Paid</Text>
          <Text style={styles.totalAmount}>₹{totalPaid} for {selectedSeats.length} Seat(s)</Text>
        </View>

        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#EAF2FA",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "relative",
  },

  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  offerBanner: {
    backgroundColor: "#DFF5E4",
    padding: 10,
    alignItems: "center",
  },

  offerText: {
    fontSize: 13,
  },

  tripContainer: {
    backgroundColor: "#fff",
    padding: 16,
  },

  editContactCard: {
    backgroundColor: "#F7FBFF",
    padding: 12,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CCE5FF",
  },

  addPassengerCard: {
    backgroundColor: "#F7FBFF",
    padding: 12,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CCE5FF",
  },

  saveButton: {
    backgroundColor: "#2F80ED",
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 10,
    alignItems: "center",
  },

  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },

  genderBox: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  genderOption: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    paddingVertical: 8,
    backgroundColor: "#fff",
    flex: 1,
    alignItems: 'center',
  },

  genderSelected: {
    borderColor: "#2F80ED",
    backgroundColor: "#E8F0FF",
  },

  genderText: {
    fontSize: 14,
    color: "#333",
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  date: { fontSize: 11, color: "#777" },
  time: { fontSize: 18, fontWeight: "600" },
  city: { fontSize: 14, fontWeight: "500" },
  location: { fontSize: 11, color: "#777" },

  duration: {
    alignSelf: "center",
    color: "#888",
  },

  viewDetails: {
    color: "#1A73E8",
    marginTop: 10,
    textAlign: "right",
  },

  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  edit: { color: "#1A73E8" },
  add: { color: "#1A73E8" },

  smallText: {
    fontSize: 12,
    color: "#777",
    marginVertical: 4,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  contactText: {
    marginLeft: 6,
  },

  passengerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  passengerTitle: {
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  viewAll: {
    color: "#1A73E8",
  },

  couponBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
  },
  couponInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  apply: {
    color: "#1A73E8",
    fontWeight: "700",
    fontSize: 14,
  },

  couponItem: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  link: {
    color: "#1A73E8",
    marginTop: 4,
  },

  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },

  total: {
    fontWeight: "600",
  },

  price: {
    color: "#1A73E8",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalPaid: {
    fontSize: 12,
    color: "#777",
  },

  totalAmount: {
    fontWeight: "600",
  },

  payButton: {
    backgroundColor: "#1A73E8",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  payText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderActions: {
    flexDirection: 'row',
  },
  modalActionButton: {
    padding: 4,
    marginLeft: 12,
  },
  tripDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    fontWeight: "500",
  },
  dividerLight: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cityLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  cityName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  durationWrapper: {
    alignItems: "center",
  },
  durationText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },
  durationLineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
  },
  line: {
    width: 60,
    height: 1,
    backgroundColor: "#ccc",
  },
  travelRow: {
    marginBottom: 16,
  },
  travelLabel: { fontSize: 11, color: "#999", marginBottom: 2 },
  travelValue: { fontSize: 13, fontWeight: "600", color: "#333" },
  travelSub: { fontSize: 11, color: "#666" },
  pointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pointCol: {
    flex: 1,
  },
  pointLabel: { fontSize: 11, color: "#999", marginBottom: 2 },
  pointValue: { fontSize: 13, fontWeight: "600", color: "#333" },
  pointTime: { fontSize: 11, color: "#666" },

  /* CONTACT EDIT MODAL STYLES */
  contactModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  contactModalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  contactModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  contactModalDivider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  inputRowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  prefix: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginRight: 8,
  },
  contactInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  modalSaveBtn: {
    backgroundColor: "#1A73E8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  modalSaveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  passengerModalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  passengerInputGroup: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  passengerLabel: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 10,
  },
  addPassengerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1A73E8',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginTop: 10,
  },
  addPassengerBtnText: {
    color: '#1A73E8',
    marginLeft: 8,
    fontWeight: '600',
  },
  inputLabelSmall: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
    fontWeight: '500',
  },
  addInlineText: {
    color: '#1A73E8',
    fontWeight: '700',
    fontSize: 14,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },
  radioContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonActive: {
    borderColor: '#1A73E8',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1A73E8',
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  mainActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  errorTextSmall: {
    color: "#D32F2F",
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
});