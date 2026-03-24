import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { IMAGES } from "../constants/images";

const googleIconSvg = `<svg height="200" width="200" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
	<g fill="none" fillRule="evenodd">
		<path d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86" fill="#F44336" opacity=".987"/>
		<path d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92" fill="#FFC107" opacity=".997"/>
		<path d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49" fill="#448AFF" opacity=".999"/>
		<path d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z" fill="#43A047" opacity=".993"/>
	</g>
</svg>`;

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();
  const [isCaptchaChecked, setCaptchaChecked] = useState(false);
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const bottomSheetTranslate = useRef(new Animated.Value(0)).current;

  const isOtpButtonDisabled = phone.length !== 10 || !isCaptchaChecked;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      const keyboardHeight = event?.endCoordinates?.height || 0;
      const targetTranslateY = -Math.min(keyboardHeight * 0.5, hp("35%"));

      setKeyboardOpen(true);
      Animated.spring(bottomSheetTranslate, {
        toValue: targetTranslateY,
        speed: 18,
        bounciness: 6,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOpen(false);
      Animated.spring(bottomSheetTranslate, {
        toValue: 0,
        speed: 22,
        bounciness: 3,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [bottomSheetTranslate]);

  const onPhoneChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 10);
    setPhone(cleaned);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.screen}>
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <Image source={IMAGES.BUS} style={styles.logo} />
              <Text style={styles.logoText}>Logo and Name</Text>
            </View>
            <Text style={styles.heading}>Your</Text>
            <Text style={styles.heading}>Journey</Text>
            <Text style={styles.heading}>Starts Here</Text>
          </View>

          <Animated.View
            style={[
              styles.card,
              { transform: [{ translateY: bottomSheetTranslate }] },
              isKeyboardOpen && styles.cardShadowStrong,
            ]}
          >
            <Text style={styles.loginTitle}>Login or Sign up</Text>
            <Text style={styles.subtitle}>Welcome back! Let’s get you on board</Text>

            <View style={styles.inputRow}>
              <View style={styles.phoneInput}>
                <Text style={styles.code}>+91</Text>
                <TextInput
                  placeholder="Mobile Number"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  returnKeyType="done"
                  value={phone}
                  onChangeText={onPhoneChange}
                  style={styles.input}
                  maxLength={10}
                  importantForAutofill="no"
                  autoComplete="tel"
                />
              </View>

              <TouchableOpacity
                style={[styles.otpButton, isOtpButtonDisabled && styles.otpButtonDisabled]}
                disabled={isOtpButtonDisabled}
                onPress={() => navigation.navigate("OTP", { phone })}
              >
                <Text style={styles.otpText}>Get OTP</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.captchaRow}
              onPress={() => setCaptchaChecked((prev) => !prev)}
            >
              <View style={styles.radio}>{isCaptchaChecked && <View style={styles.radioSelected} />}</View>
              <Text style={styles.captchaText}>I'm not a robot</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.or}>or</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
              <SvgXml xml={googleIconSvg} width="24" height="24" style={styles.googleIcon} />
              <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E73C8",
  },
  screen: {
    flex: 1,
    backgroundColor: "#1E73C8",
    justifyContent: "flex-start",
  },
  topSection: {
    paddingTop: hp("12%"),
    paddingHorizontal: wp("8%"),
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("2%"),
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    marginRight: 12,
  },
  logoText: {
    color: "#FFF",
    fontSize: wp("5%"),
    fontWeight: "600",
  },
  heading: {
    fontSize: wp("10%"),
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 1,
    lineHeight: hp("7%"),
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: wp("7%"),
    paddingTop: hp("3%"),
    paddingBottom: hp("34%"),
    minHeight: hp("48%"),
    maxHeight: hp("80%"),
    marginTop: hp("16%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  cardShadowStrong: {
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 14,
  },
  loginTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginTop: 6,
    marginBottom: hp("3%"),
    fontSize: wp("3.8%"),
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2.5%"),
  },
  phoneInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
  },
  code: {
    marginRight: 8,
    fontWeight: "600",
    color: "#000",
  },
  input: {
    flex: 1,
    fontSize: wp("4%"),
    color: "#000",
  },
  otpButton: {
    backgroundColor: "#1E73C8",
    marginLeft: 10,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  otpText: {
    color: "#FFF",
    fontWeight: "600",
  },
  otpButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  captchaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#1E73C8",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1E73C8",
  },
  captchaText: {
    fontSize: wp("3.5%"),
    color: "#333",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("2%"),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD",
  },
  or: {
    marginHorizontal: 10,
    color: "#777",
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    fontWeight: "500",
  },
});