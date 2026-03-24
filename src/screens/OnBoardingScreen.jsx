import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PagerView from "react-native-pager-view";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { IMAGES } from "../constants/images";

const slides = [
  {
    image: IMAGES.ONBOARDING1,
    title: "Find suitable bus transport",
    description:
      "Choose the most suitable transport to your way to vacation or anywhere in the states",
  },
  {
    image: IMAGES.ONBOARDING2,
    title: "Buy tickets online",
    description:
      "Enjoy the easy to use payment flow for buying tickets and not to waste time on queues",
  },
  {
    image: IMAGES.ONBOARDING3,
    title: "Use live tracking",
    description:
      "Choose the most suitable transport to your way to vacation or anywhere in the states",
  },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      {/* PAGER */}
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {slides.map((item, index) => (
          <View key={index} style={styles.slide}>

            <Image source={item.image} style={styles.image} />

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.description}>{item.description}</Text>

          </View>
        ))}
      </PagerView>

      {/* DOT INDICATOR */}
      <View style={styles.bottomContainer}>

        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                page === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* SKIP BUTTON */}
        <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.skipText}>Skip Ad</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  pager: {
    flex: 1,
  },

  slide: {
    alignItems: "center",
    paddingHorizontal: wp("10%"),
    marginTop: hp("6%"),
  },

  image: {
    width: wp("85%"),
    height: hp("52%"),
    resizeMode: "contain",
  },

  title: {
    fontSize: wp("6%"),
    fontWeight: "700",
    color: "#1E73C8",
    textAlign: "center",
    marginTop: hp("3%"),
  },

  description: {
    fontSize: wp("3.8%"),
    color: "#555",
    textAlign: "center",
    marginTop: hp("2%"),
    lineHeight: 22,
  },

  bottomContainer: {
    alignItems: "center",
    marginBottom: hp("5%"),
  },

  dotsContainer: {
    flexDirection: "row",
    marginBottom: hp("2%"),
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C4C4C4",
    marginHorizontal: 6,
  },

  activeDot: {
    backgroundColor: "#1E73C8",
  },

  skipButton: {
    alignItems: "center",
  },

  skipText: {
    fontSize: wp("4%"),
    color: "#000",
  },

});