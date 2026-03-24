import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

const menuItems = [
  {
    title: "Personal Details",
    icon: "user",
    lib: Feather,
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
    route: null,
  },
  {
    title: "Help",
    icon: "help-outline",
    lib: MaterialIcons,
    route: "Help",
  },
  {
    title: "Wallet",
    icon: "wallet",
    lib: AntDesign,
    route: null,
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
  const { phone, name } = route.params || {};

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
              <MaterialIcons name="person" size={45} color="#2F80ED" />
            </View>
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
                onPress={() => item.route && navigation.navigate(item.route, { phone, name: name || "User Name" })}
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
});