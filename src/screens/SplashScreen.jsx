import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { moderateScale } from "react-native-size-matters";

import { IMAGES } from "../constants/images";

export default function SplashScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>

      {/* BUS AREA */}
      <View style={styles.busArea}>

        <Text style={styles.find}>FIND</Text>
        <Text style={styles.bus}>BUS</Text>

        <Image
          source={IMAGES.BUS}
          style={styles.busImage}
          resizeMode="contain"
        />

      </View>

      {/* TITLE */}
      <View style={styles.textArea}>
        <Text style={styles.title}>Your</Text>
        <Text style={styles.title}>Journey</Text>
        <Text style={styles.title}>Starts Here</Text>
      </View>

      {/* BUTTON */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Onboarding")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#1E73C8",
  },

  /* BUS AREA */

  busArea: {
    height: hp("38%"),
    justifyContent: "center",
    alignItems: "center",
  },

  find: {
    position: "absolute",
    top: hp("10%"),
    fontSize: moderateScale(wp("22%")),
    fontWeight: "700",
    color: "rgba(255,255,255,0.18)",
  },

  bus: {
  position: "absolute",
  top: hp("28%"),
  fontSize: wp("26%"),
  fontWeight: "700",
  color: "rgba(255,255,255,0.18)",
  },

  busImage: {
    width: wp("70%"),
    height: hp("16%"),
    marginTop: hp("16%"),
  },

  /* TITLE AREA */

  textArea: {
    marginTop: hp("14%"),
    paddingLeft: wp("16%"),
  },

  title: {
    fontSize: moderateScale(46),
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: moderateScale(50),
  },

  /* BUTTON AREA */

  buttonArea: {
    marginTop: hp("10%"),
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    width: wp("75%"),
    height: hp("2%"),
    alignItems: "center",
  },

  button: {
    width: wp("75%"),
    height: hp("7%"),
    backgroundColor: "#EAEAEA",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: moderateScale(16),
    color: "#0070FF",
    fontWeight: "600",
  },

});