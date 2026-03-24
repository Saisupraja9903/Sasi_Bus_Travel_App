import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { IMAGES } from "../constants/images";

export default function OTPScreen() {

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const cardTranslate = useRef(new Animated.Value(100)).current;
  const route = useRoute();
  const navigation = useNavigation();
  const { phone } = route.params || {};

  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();

    Animated.spring(cardTranslate, {
      toValue: 0,
      speed: 14,
      bounciness: 8,
      useNativeDriver: true,
    }).start();

    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      const keyboardHeight = event?.endCoordinates?.height || 0;
      const targetY = -Math.min(keyboardHeight * 0.5, hp("35%"));

      setKeyboardOpen(true);
      Animated.spring(cardTranslate, {
        toValue: targetY,
        speed: 18,
        bounciness: 6,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOpen(false);
      Animated.spring(cardTranslate, {
        toValue: 0,
        speed: 22,
        bounciness: 4,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [cardTranslate]);

  const scaleAnim = useRef(
    [new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]
  ).current;

  /* ---------------- TIMER ---------------- */

  useEffect(() => {

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  /* ---------------- VERIFY OTP ---------------- */

  const verifyOtp = (code) => {
    if (code === "1234") {
      navigation.replace("Home", { phone });
      return;
    }

    Alert.alert("Invalid OTP", "Invalid OTP. Please try again.");
  };

  /* ---------------- HANDLE INPUT ---------------- */

  const handleChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];

    if (text.length > 1) {
      const pasted = text.replace(/\D/g, "").slice(0, 4).split("");
      for (let i = 0; i < 4; i++) {
        newOtp[i] = pasted[i] || "";
      }
      setOtp(newOtp);
      if (pasted.length === 4) {
        inputs.current[3]?.focus();
        verifyOtp(newOtp.join(""));
      }
    } else {
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 3) {
        inputs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        verifyOtp(newOtp.join(""));
      }
    }

    Animated.sequence([
      Animated.timing(scaleAnim[index], {
        toValue: 1.15,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim[index], {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* ---------------- BACKSPACE ---------------- */

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  /* ---------------- RESEND OTP ---------------- */

  const resendOtp = () => {

    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    inputs.current[0].focus();

  };

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      {/* BLUE TOP AREA */}

      <View style={styles.topSection}>

        <View style={styles.logoRow}>
          <Image source={IMAGES.BUS} style={styles.logo} />
          <Text style={styles.logoText}>Logo and Name</Text>
        </View>

        {/* BACKGROUND TEXT */}

        <Text style={styles.find}>FIND</Text>
        <Text style={styles.bus}>BUS</Text>

        {/* BUS IMAGE */}

        <Image
          source={IMAGES.BUS}
          style={styles.busImage}
          resizeMode="contain"
        />

      </View>

      {/* OTP CARD */}

      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: cardTranslate }] },
          isKeyboardOpen && styles.cardShadowStrong,
        ]}
      >

        <Text style={styles.title}>OTP Verification</Text>

        <Text style={styles.subtitle}>
          Enter OTP sent to +91 {phone?.replace(/(\d{5})(\d{5})/, "$1 $2")}
        </Text>

        {/* OTP INPUT BOXES */}

        <View style={styles.otpContainer}>

          {otp.map((digit, index) => (
            <Animated.View
              key={index}
              style={{ transform: [{ scale: scaleAnim[index] }] }}
            >
              <TextInput
                ref={(ref) => (inputs.current[index] = ref)}
                style={[
                  styles.otpBox,
                  activeOtpIndex === index && styles.otpBoxActive,
                ]}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setActiveOtpIndex(index)}
                onBlur={() => setActiveOtpIndex(-1)}
              />
            </Animated.View>
          ))}

        </View>

        {/* RESEND */}

        <Text style={styles.resend}>

          Didn’t receive?{" "}

          {canResend ? (
            <Text style={styles.resendLink} onPress={resendOtp}>
              Resend OTP
            </Text>
          ) : (
            <Text style={styles.timer}>Resend in {timer}s</Text>
          )}

        </Text>

        {/* VERIFY BUTTON */}

        <TouchableOpacity
          style={[
            styles.verifyBtn,
            otp.join("").length !== 4 && styles.verifyDisabled,
          ]}
          disabled={otp.join("").length !== 4}
          onPress={() => verifyOtp(otp.join(""))}
        >
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, I agree to the Terms & Conditions
        </Text>

      </Animated.View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#1E73C8",
  },

  /* TOP AREA */

  topSection: {
    height: hp("55%"),
    justifyContent: "center",
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: hp("8%"),
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DDD",
    marginRight: 10,
  },

  logoText: {
    color: "#FFF",
    fontSize: wp("4%"),
  },

  /* FIND BUS TEXT */

  find: {
    position: "absolute",
    fontSize: wp("25%"),
    color: "rgba(255,255,255,0.15)",
    fontWeight: "800",
    letterSpacing: 4,
    top: hp("14%"),
  },

  bus: {
    position: "absolute",
    fontSize: wp("25%"),
    color: "rgba(255,255,255,0.15)",
    fontWeight: "800",
    letterSpacing: 4,
    top: hp("34%"),
  },

  busImage: {
    width: wp("75%"),
    height: hp("20%"),
    position: "absolute",
    bottom: hp("14%"),
    zIndex: 2,
  },

  /* OTP CARD */

  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "center",
    paddingTop: hp("4%"),
    paddingBottom: hp("10%"),
    paddingHorizontal: wp("8%"),
    marginTop: hp("1%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  cardShadowStrong: {
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
  },

  title: {
    fontSize: wp("5%"),
    fontWeight: "600",
  },

  subtitle: {
    marginTop: 6,
    color: "#777",
    fontSize: wp("3.5%"),
  },

  /* OTP BOXES */

  otpContainer: {
    flexDirection: "row",
    marginTop: hp("4%"),
  },

  otpBox: {
    width: 60,
    height: 60,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginHorizontal: 6,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  otpBoxActive: {
    borderColor: "#1E73C8",
    shadowColor: "#1E73C8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  resend: {
    marginTop: hp("2%"),
    fontSize: wp("3.5%"),
    color: "#777",
  },

  resendLink: {
    color: "#1E73C8",
    fontWeight: "500",
  },

  timer: {
    color: "#777",
  },

  /* VERIFY BUTTON */

  verifyBtn: {
    marginTop: hp("4%"),
    backgroundColor: "#1E73C8",
    width: "100%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  verifyText: {
    color: "#FFF",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
  verifyDisabled:{
  backgroundColor:"#A9A9A9"
  },

  terms: {
    marginTop: hp("2%"),
    fontSize: wp("3%"),
    color: "#777",
  },

});