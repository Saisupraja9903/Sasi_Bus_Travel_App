import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PersonalDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone, name: paramName } = route.params || {};
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
  
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isMobileEditing, setIsMobileEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);

  // Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(new Date(initialDob));
  const [calendarView, setCalendarView] = useState("days"); // "days", "months", "years"

  // Passenger State
  const [passengers, setPassengers] = useState([]);
  const [showAddPassenger, setShowAddPassenger] = useState(false);
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    age: "",
    gender: "Male",
  });

  const handleSave = () => {
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Navigate back to Profile with updated name and mobile
    navigation.navigate("Profile", { name, phone: mobile });
  };

  const hasChanges = name !== initialName || mobile !== initialMobile || email !== initialEmail || dob !== initialDob;

  // Add Passenger Logic
  const handleAddPassenger = () => {
    if (!newPassenger.name || !newPassenger.age) {
      Alert.alert("Missing Details", "Please enter passenger name and age.");
      return;
    }
    setPassengers([...passengers, newPassenger]);
    setNewPassenger({ name: "", age: "", gender: "Male" });
    setShowAddPassenger(false);
  };

  // Calendar Helpers
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const changeMonth = (offset) => {
    const newDate = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + offset,
      1
    );
    setDisplayMonth(newDate);
  };

  // Dynamic Data
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const monthsList = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Personal Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Main Card */}
      <View style={styles.card}>

        {/* Full Name */}
        <View style={styles.row}>
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

        <View style={styles.divider} />

        {/* Mobile */}
        <View style={styles.row}>
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

        <View style={styles.divider} />

        {/* Gender */}
        <View style={styles.genderRow}>
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

        <View style={styles.divider} />

        {/* DOB */}
        <View style={styles.row}>
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

        <View style={styles.divider} />

        {/* Email */}
        <View style={styles.row}>
          <MaterialIcons name="mail-outline" size={22} color="#1E6BD6" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Email address</Text>
            {isEmailEditing ? (
              <TextInput
                style={styles.editInput}
                value={email}
                onChangeText={setEmail}
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
      </View>

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
            <Text style={styles.passengerName}>{p.name}</Text>
            <Text style={styles.passengerDetails}>{p.gender}, {p.age} years</Text>
          </View>
        ))}
      </View>

      {/* Referral Code */}
      <Text style={styles.referralTitle}>Have a referal code</Text>

      <View style={styles.referralBox}>
        <Feather name="gift" size={20} color="#1E6BD6" />

        <TextInput
          placeholder="Enter the code"
          style={styles.input}
          value={referral}
          onChangeText={setReferral}
        />

        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
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
              onChangeText={(text) => setNewPassenger({ ...newPassenger, name: text })}
              style={styles.modalInput}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Age"
              value={newPassenger.age}
              onChangeText={(text) => setNewPassenger({ ...newPassenger, age: text })}
              keyboardType="number-pad"
              style={styles.modalInput}
              placeholderTextColor="#999"
            />

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

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowAddPassenger(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 90,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
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

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },

  genderRow: {
    paddingVertical: 15,
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
    marginTop: 20,
    borderRadius: 15,
    padding: 18,
  },
  passengerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  passengerText: {
    marginLeft: 10,
    fontSize: 16,
  },

  referralTitle: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 15,
  },

  referralBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  input: {
    flex: 1,
    marginLeft: 10,
  },

  applyButton: {
    backgroundColor: "#CFCFCF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  applyText: {
    color: "white",
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
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 15,
    paddingTop: 10,
  },
  passengerName: { fontSize: 16, fontWeight: "600", color: "#333" },
  passengerDetails: { fontSize: 14, color: "#666", marginTop: 2 },

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