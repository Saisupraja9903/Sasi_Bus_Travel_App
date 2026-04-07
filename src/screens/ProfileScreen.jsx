import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppModal from "../components/AppModal";

const menuItems = [
  {
    title: "Personal Details",
    icon: "person-outline",
    lib: MaterialIcons,
    route: "PersonalDetails",
  },
  {
    title: "My Bookings",
    icon: "ticket-outline",
    lib: MaterialCommunityIcons,
    route: "Bookings",
  },
  {
    title: "Refer & Earn",
    icon: "share-alt",
    lib: FontAwesome,
    route: "Refer",
  },
  {
    title: "Help",
    icon: "help-outline",
    lib: MaterialIcons,
    route: "Help",
  },
  {
    title: "Wallet",
    icon: "account-balance-wallet",
    lib: MaterialIcons,
    route: "Wallet",
  },
  {
    title: "Delete Account",
    icon: "delete-outline",
    lib: MaterialIcons,
    isDanger: true,
    route: null,
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone, name, passengers } = route.params || {};
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletionDate, setDeletionDate] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // Modal States
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", type: "info" });
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    const savedImage = await AsyncStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  };

  const handleProfileImage = () => {
    setImagePickerVisible(true);
  };

  const openGallery = async () => {
    setImagePickerVisible(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      showAlert("Permission Denied", "Gallery access is required to select photos!", "error");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const selectedUri = pickerResult.assets[0].uri;
      setProfileImage(selectedUri);
      await AsyncStorage.setItem("profileImage", selectedUri);
    }
  };

  const openCamera = async () => {
    setImagePickerVisible(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== "granted") {
      showAlert("Permission Denied", "Camera access is required to take photos!", "error");
      return;
    }
    const cameraResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!cameraResult.canceled && cameraResult.assets && cameraResult.assets.length > 0) {
      const capturedUri = cameraResult.assets[0].uri;
      setProfileImage(capturedUri);
      await AsyncStorage.setItem("profileImage", capturedUri);
    }
  };

  const showAlert = (title, message, type = "info") => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const openDeleteModal = () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // Account will be deleted in 30 days
    const formattedDate = futureDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setDeletionDate(formattedDate);
    showAlert("Delete Account", `Are you sure you want to delete your account? This action is irreversible. Your account will be permanently deleted on ${formattedDate}.`, "error");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* HEADER BACKGROUND */}
        <View style={styles.headerBg}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <MaterialIcons name="person" size={45} color="#2F80ED" />
              )}
            </View>
            <TouchableOpacity style={styles.editIconBtn} onPress={handleProfileImage}>
              <MaterialIcons name="edit" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.username}>{name || "User Name"}</Text>
          <Text style={styles.phone}>{phone || "+91 98765 43210"}</Text>

        </View>

        {/* MENU OPTIONS */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => {
            const IconLib = item.lib;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  if (item.isDanger) {
                    openDeleteModal();
                  } else if (item.route) {
                    navigation.navigate(item.route, { phone, name: name || "User Name", passengers });
                  }
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconBox,
                    item.isDanger && { backgroundColor: "#FFEBEE" },
                  ]}
                >
                  <IconLib
                    name={item.icon}
                    size={20}
                    color={item.isDanger ? "#D32F2F" : "#555"}
                  />
                </View>

                <Text
                  style={[
                    styles.menuText,
                    item.isDanger && { color: "#D32F2F" },
                  ]}
                >
                  {item.title}
                </Text>

                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color="#CCC"
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("Login")}
        >
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* APP MODAL (Handles Delete Confirmation & Errors) */}
      <AppModal
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showCancel={alertConfig.title === "Delete Account"}
        cancelText="Cancel"
        confirmText={alertConfig.title === "Delete Account" ? "Delete" : "OK"}
        onCancel={() => setAlertVisible(false)}
        onConfirm={() => {
          setAlertVisible(false);
          if (alertConfig.title === "Delete Account") {
            navigation.navigate("Login");
          }
        }}
      />

      {/* IMAGE PICKER MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={imagePickerVisible}
        onRequestClose={() => setImagePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>Profile Photo</Text>
            
            <TouchableOpacity style={styles.pickerOption} onPress={openCamera}>
              <View style={styles.pickerIcon}>
                <MaterialIcons name="camera-alt" size={24} color="#2F80ED" />
              </View>
              <Text style={styles.pickerText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pickerOption} onPress={openGallery}>
              <View style={styles.pickerIcon}>
                <MaterialIcons name="photo-library" size={24} color="#2F80ED" />
              </View>
              <Text style={styles.pickerText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <View style={styles.divider}/>

            <TouchableOpacity style={styles.pickerCancel} onPress={() => setImagePickerVisible(false)}>
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerBg: {
    backgroundColor: "#2F80ED",
    height: 210,
    paddingTop: 80,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  backButton: {
    padding: 4,
  },
  /* PROFILE CARD */
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -50,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 12,
    position: "relative",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EBF3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIconBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2F80ED",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    fontSize: 20,
    color: "#333",
    fontWeight: "700",
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  editProfileBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  /* MENU SECTION */
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor:"#0070FF",
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
    shadowColor: "#FF5252",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pickerContent: { width: "100%", backgroundColor: "#fff", borderRadius: 24, padding: 24, elevation: 10 },
  pickerTitle: { fontSize: 18, fontWeight: "700", marginBottom: 20, textAlign: "center", color: "#333" },
  pickerOption: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  pickerIcon: { width: 40, alignItems: "center", marginRight: 10 },
  pickerText: { fontSize: 16, color: "#333" },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
  pickerCancel: { alignItems: "center", paddingVertical: 10 },
  pickerCancelText: { fontSize: 16, color: "#D32F2F", fontWeight: "600" },
});