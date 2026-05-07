
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppModal from "./AppModal";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PersonalDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone, name: paramName, passengers: paramPassengers } = route.params || {};
  const [gender, setGender] = useState("Female");
  const [referral, setReferral] = useState("");

  const initialName = paramName || "Prathyusha";
  const initialMobile = phone || "+91 00000 00000";
  const initialEmail = "example@mail.com";
  const initialDob = new Date(2000, 0, 1); // Default Jan 1, 2000

  const [name, setName] = useState(initialName);
  const [mobile, setMobile] = useState(initialMobile);
  const [email, setEmail] = useState(initialEmail);
  const [dob, setDob] = useState(initialDob);
  const [emailError, setEmailError] = useState("");
  
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isMobileEditing, setIsMobileEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);

  // Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(new Date(initialDob));
  const [calendarView, setCalendarView] = useState("days"); // "days", "months", "years"

  // Referral State
  const [referralStatus, setReferralStatus] = useState("idle"); // idle, loading, success, error

  const handleApplyReferral = () => {
    if (!referral.trim()) return;
    
    setReferralStatus("loading");
    
    // Simulate API call for code verification
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (referral.toUpperCase() === "GOBUS500") {
        setReferralStatus("success");
      } else {
        setReferralStatus("error");
      }
    }, 1200);
  };

  const handleRemoveReferral = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setReferral("");
    setReferralStatus("idle");
  };

  // Passenger State
  const [passengers, setPassengers] = useState(paramPassengers || []);
  const [showAddPassenger, setShowAddPassenger] = useState(false);
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    age: "",
    gender: "Male",
  });
  const [passengerErrors, setPassengerErrors] = useState({ name: "", age: "" });

  // Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [passengerToDelete, setPassengerToDelete] = useState(null);

  const handleSave = () => {
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError(""); // Clear error if valid

    // Navigate back to Profile with updated data
    navigation.navigate("Profile", { name, phone: mobile, passengers, email, dob: dob.toISOString(), gender });
  };

  // Using JSON.stringify for a simple deep comparison of the passengers array
  const hasChanges = React.useMemo(() => 
    name !== initialName ||
    mobile !== initialMobile ||
    email !== initialEmail ||
    dob.getTime() !== initialDob.getTime() ||
    JSON.stringify(passengers) !== JSON.stringify(paramPassengers || []),
  [name, mobile, email, dob, passengers, paramPassengers]);

  // Add Passenger Logic
  const handleAddPassenger = () => {
    const trimmedName = newPassenger.name.trim();
    const ageNumber = parseInt(newPassenger.age, 10);
    const errors = { name: "", age: "" };
    let hasError = false;

    if (!trimmedName || trimmedName.length < 3) {
      errors.name = "Please enter a name with at least 3 characters.";
      hasError = true;
    }
    if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      errors.age = "Please enter a valid age between 1 and 120.";
      hasError = true;
    }
    setPassengerErrors(errors);
    if (hasError) return;
    setPassengers([
      ...passengers,
      { ...newPassenger, name: trimmedName, age: String(ageNumber) },
    ]);
    setNewPassenger({ name: "", age: "", gender: "Male" });
    setShowAddPassenger(false);
  };

  // Delete Passenger Logic
  const handleDeletePassenger = (indexToDelete) => {
    setPassengerToDelete(indexToDelete);
    setDeleteModalVisible(true);
  };

  const confirmDeletePassenger = () => {
    const updatedPassengers = passengers.filter((_, index) => index !== passengerToDelete);
    setPassengers(updatedPassengers);
    setDeleteModalVisible(false);
    setPassengerToDelete(null);
  };

  // Calendar Helpers
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const changeMonth = useCallback((offset) => {
    setDisplayMonth(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      return newDate;
    });
  }, []);

  // Dynamic Data
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const monthsList = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Personal Details</Text>
        </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Full Name */}
        <View style={styles.detailBox}>
          <MaterialIcons name="person-outline" size={22} color="#1E6BD6" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Full Name</Text>
            {isNameEditing ? (
              <TextInput
                style={styles.editInput}
                value={name}
                onChangeText={setName}
                autoFocus={true}
              />
            ) : (
              <Text style={styles.value}>{name}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setIsNameEditing(!isNameEditing)}>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Mobile */}
        <View style={styles.detailBox}>
          <Feather name="phone" size={20} color="#1E6BD6" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Mobile no</Text>
            {isMobileEditing ? (
              <TextInput
                style={styles.editInput}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                autoFocus={true}
              />
            ) : (
              <Text style={styles.value}>{mobile}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setIsMobileEditing(!isMobileEditing)}>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Gender */}
        <View style={[styles.detailBox, styles.genderBox]}>
          <Text style={styles.label}>Gender</Text>

          <View style={styles.genderOptions}>

            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender("Male")}
            >
              <View
                style={[
                  styles.radio,
                  gender === "Male" && styles.radioSelected,
                ]}
              />
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender("Female")}
            >
              <View
                style={[
                  styles.radio,
                  gender === "Female" && styles.radioSelected,
                ]}
              />
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* DOB */}
        <View style={styles.detailBox}>
          <Ionicons name="calendar-outline" size={22} color="#1E6BD6" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>{formatDate(dob)}</Text>
          </View>
          <TouchableOpacity 
            style={{ marginLeft: "auto" }}
            onPress={() => {
              setDisplayMonth(new Date(dob));
              setCalendarView("days");
              setShowCalendar(true);
            }}
          >
            <Text style={styles.edit}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={styles.detailBox}>
          <MaterialIcons name="mail-outline" size={22} color="#1E6BD6" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Email address</Text>
            {isEmailEditing ? (
              <TextInput
                style={styles.editInput}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus={true}
              />
            ) : (
              <Text style={styles.value}>{email}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={{ marginLeft: "auto" }} 
            onPress={() => setIsEmailEditing(!isEmailEditing)}
          >
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Passenger List */}
      <View style={styles.passengerSection}>
        <View style={styles.passengerHeaderRow}>
          <Ionicons name="people-outline" size={22} color="#1E6BD6" />
          <Text style={styles.passengerText}>Passengers List</Text>

          <TouchableOpacity style={{ marginLeft: "auto" }} onPress={() => setShowAddPassenger(true)}>
            <Text style={styles.add}>+Add</Text>
          </TouchableOpacity>
        </View>

        {passengers.map((p, index) => (
          <View key={index} style={styles.passengerItem}>
            <View>
              <Text style={styles.passengerName}>{p.name}</Text>
              <Text style={styles.passengerDetails}>{p.gender}, {p.age} years</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeletePassenger(index)}>
              <MaterialIcons name="delete-outline" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Referral Code Section */}
      <View style={styles.referralContainer}>
        <Text style={styles.referralTitle}>Have a referral code?</Text>

        <View style={[
          styles.referralBox,
          referralStatus === 'success' && styles.referralBoxSuccess,
          referralStatus === 'error' && styles.referralBoxError
        ]}>
          <Feather 
            name={referralStatus === 'success' ? "check-circle" : "gift"} 
            size={20} 
            color={referralStatus === 'success' ? "#4CAF50" : "#1E6BD6"} 
          />

          <TextInput
            placeholder="e.g. GOBUS500"
            style={styles.referralInput}
            value={referral}
            onChangeText={(text) => {
              setReferral(text.toUpperCase());
              if (referralStatus !== 'idle') setReferralStatus('idle');
            }}
            editable={referralStatus !== 'success' && referralStatus !== 'loading'}
            autoCapitalize="characters"
          />

          {referralStatus === 'loading' ? (
            <ActivityIndicator size="small" color="#1E6BD6" />
          ) : referralStatus === 'success' ? (
            <TouchableOpacity onPress={handleRemoveReferral}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.applyButton, !referral.trim() && styles.applyButtonDisabled]}
              onPress={handleApplyReferral}
              disabled={!referral.trim()}
            >
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          )}
        </View>

        {referralStatus === 'success' && (
          <Text style={styles.successMessage}>Applied! Extra discount will be added to your booking.</Text>
        )}
        {referralStatus === 'error' && (
          <Text style={styles.errorMessage}>Invalid code. Please check and try again.</Text>
        )}
      </View>

      {/* SAVE BUTTON */}
      {hasChanges && (
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      {/* CALENDAR MODAL */}
      <Modal transparent={true} visible={showCalendar} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date of Birth</Text>

            {/* Month Navigation */}
            <View style={styles.calendarHeader}>
              {calendarView === 'days' && (
                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}>
                  <MaterialIcons name="chevron-left" size={30} color="#333" />
                </TouchableOpacity>
              )}

              <View style={styles.headerTextContainer}>
                <TouchableOpacity onPress={() => setCalendarView("months")} style={styles.dropdownBtn}>
                  <Text style={[styles.headerTextClickable, calendarView === "months" && styles.activeHeaderText]}>
                    {displayMonth.toLocaleString("default", { month: "long" })}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCalendarView("years")} style={styles.dropdownBtn}>
                  <Text style={[styles.headerTextClickable, calendarView === "years" && styles.activeHeaderText]}>
                    {displayMonth.getFullYear()}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#555" />
                </TouchableOpacity>
              </View>

              {calendarView === 'days' && (
                <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}>
                  <MaterialIcons name="chevron-right" size={30} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            {/* CONTENT VIEWS */}
            {calendarView === "days" ? (
              <View style={styles.calendarGrid}>
                {Array.from(
                  { length: getDaysInMonth(displayMonth.getFullYear(), displayMonth.getMonth()) },
                  (_, i) => i + 1
                ).map((day) => {
                  const currentDate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
                  const isSelected =
                    dob.getDate() === day &&
                    dob.getMonth() === displayMonth.getMonth() &&
                    dob.getFullYear() === displayMonth.getFullYear();

                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.calendarDay, isSelected && styles.selectedDay]}
                      onPress={() => {
                        setDob(currentDate);
                        setShowCalendar(false);
                      }}
                    >
                      <Text style={[styles.calendarDayText, isSelected && styles.selectedDayText]}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : calendarView === "months" ? (
              <View style={styles.monthsGrid}>
                {monthsList.map((m, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.monthItem, displayMonth.getMonth() === index && styles.selectedItem]}
                    onPress={() => {
                      const d = new Date(displayMonth);
                      d.setDate(1); // Fix rollover: set to 1st before changing month
                      d.setMonth(index);
                      setDisplayMonth(d);
                      setCalendarView("days");
                    }}
                  >
                    <Text style={[styles.itemText, displayMonth.getMonth() === index && styles.selectedItemText]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.yearListContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {yearsList.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[styles.yearItem, displayMonth.getFullYear() === year && styles.selectedItem]}
                      onPress={() => {
                        const d = new Date(displayMonth);
                        d.setDate(1); // Fix rollover for leap years
                        d.setFullYear(year);
                        setDisplayMonth(d);
                        setCalendarView("days");
                      }}
                    >
                      <Text style={[styles.itemText, displayMonth.getFullYear() === year && styles.selectedItemText]}>{year}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowCalendar(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ADD PASSENGER MODAL */}
      <Modal transparent={true} visible={showAddPassenger} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Passenger</Text>

            <TextInput
              placeholder="Passenger Name"
              value={newPassenger.name}
              onChangeText={(text) => {
                setNewPassenger({ ...newPassenger, name: text });
                if (passengerErrors.name)
                  setPassengerErrors((p) => ({ ...p, name: "" }));
              }}
              style={styles.modalInput}
              placeholderTextColor="#999"
            />
            {passengerErrors.name ? (
              <Text style={styles.errorText}>{passengerErrors.name}</Text>
            ) : null}

            <TextInput
              placeholder="Age"
              value={newPassenger.age}
              onChangeText={(text) => {
                setNewPassenger({ ...newPassenger, age: text });
                if (passengerErrors.age)
                  setPassengerErrors((p) => ({ ...p, age: "" }));
              }}
              keyboardType="number-pad"
              style={styles.modalInput}
              placeholderTextColor="#999"
            />
            {passengerErrors.age ? (
              <Text style={styles.errorText}>{passengerErrors.age}</Text>
            ) : null}

            <View style={styles.modalGenderContainer}>
              <Text style={styles.modalLabel}>Gender</Text>
              <View style={[styles.genderOptions, { marginTop: 5 }]}>
                <TouchableOpacity
                  style={styles.genderOption}
                  onPress={() => setNewPassenger({ ...newPassenger, gender: "Male" })}
                >
                  <View style={[styles.radio, newPassenger.gender === "Male" && styles.radioSelected]} />
                  <Text style={styles.genderText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.genderOption}
                  onPress={() => setNewPassenger({ ...newPassenger, gender: "Female" })}
                >
                  <View style={[styles.radio, newPassenger.gender === "Female" && styles.radioSelected]} />
                  <Text style={styles.genderText}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddPassenger}>
              <Text style={styles.saveBtnText}>Add Passenger</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => {
                setShowAddPassenger(false);
                setPassengerErrors({ name: "", age: "" });
                setNewPassenger({ name: "", age: "", gender: "Male" });
              }}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <AppModal
        visible={deleteModalVisible}
        title="Delete Passenger"
        message="Are you sure you want to remove this passenger details?"
        type="error"
        showCancel={true}
        confirmText="Delete"
        onConfirm={confirmDeletePassenger}
        onCancel={() => setDeleteModalVisible(false)}
      />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
  },

  detailBox: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  textContainer: {
    marginLeft: 10,
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  value: {
    fontSize: 16,
    marginTop: 2,
  },

  edit: {
    color: "#888",
  },

  saveText: {
    color: "#1E6BD6",
    fontWeight: "600",
  },

  editInput: {
    fontSize: 16,
    marginTop: 2,
    padding: 0,
    color: "#333",
  },

  genderBox: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  genderOptions: {
    flexDirection: "row",
    marginTop: 10,
  },

  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 25,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#aaa",
    marginRight: 8,
  },

  radioSelected: {
    backgroundColor: "#1E6BD6",
    borderColor: "#1E6BD6",
  },

  genderText: {
    fontSize: 15,
  },

  placeholder: {
    marginLeft: 10,
    color: "#888",
  },

  add: {
    color: "#1E6BD6",
    fontWeight: "500",
  },

  passengerSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 15,
  },
  passengerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  passengerText: {
    marginLeft: 10,
    fontSize: 16,
  },

  /* Referral Section Styles */
  referralContainer: {
    marginTop: 15,
    marginBottom: 5,
  },
  referralTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    marginLeft: 4,
  },
  referralBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  referralBoxSuccess: {
    borderColor: "#4CAF50",
    backgroundColor: "#F0FDF4",
  },
  referralBoxError: {
    borderColor: "#F44336",
    backgroundColor: "#FEF2F2",
  },
  referralInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  applyButton: {
    backgroundColor: "#1E6BD6",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  applyText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  removeText: {
    color: "#F44336",
    fontWeight: "600",
    fontSize: 14,
  },
  successMessage: {
    color: "#4CAF50",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
  errorMessage: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },

  saveBtn: {
    backgroundColor: "#1E6BD6",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* Modal Styles */
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
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    height: 40,
  },
  monthText: { fontSize: 16, fontWeight: "600", color: "#333" },
  headerTextContainer: { flexDirection: 'row', alignItems: 'center' },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextClickable: { fontSize: 16, fontWeight: "600", color: "#333", marginHorizontal: 5 },
  activeHeaderText: { color: "#1E6BD6" },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  calendarDay: {
    width: "14.28%", 
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  selectedDay: { backgroundColor: "#1E6BD6", borderRadius: 20 },
  calendarDayText: { color: "#333", fontSize: 14 },
  selectedDayText: { color: "#fff", fontWeight: "bold" },
  closeModalBtn: { 
    paddingVertical: 10,
    alignSelf: "center", 
    marginTop: 15,
  },
  closeModalText: {
    color: "#FF4D4D",
    fontSize: 16,
  },

  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  modalGenderContainer: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  passengerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 15,
    paddingVertical: 10,
  },
  passengerName: { fontSize: 16, fontWeight: "600", color: "#333" },
  passengerDetails: { fontSize: 14, color: "#666", marginTop: 2 },

  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },

  /* Selection Views */
  monthsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
},
  monthItem: { width: '30%', paddingVertical: 10, alignItems: 'center', marginBottom: 10, borderRadius: 8, backgroundColor: '#f5f5f5' },
  
  yearListContainer: { height: 300, width: '100%' },
  yearItem: { paddingVertical: 12, alignItems: 'center', width: '100%', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  
  selectedItem: { backgroundColor: "#1E6BD6" },
  selectedItemText: { color: "#fff", fontWeight: "600" },
  itemText: { color: "#333", fontSize: 15 },
});