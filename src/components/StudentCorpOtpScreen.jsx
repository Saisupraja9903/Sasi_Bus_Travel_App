import React, { useRef, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import IMAGES from "../constants/images.js";

const OTP_LENGTH = 4;

export default function StudentCorpOtpScreen({ navigation, route }) {
  const email = route.params?.email || "you@domain.com";
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state for loading indicator
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const inputRefs = useRef([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current; // For shake animation
  const successScale = useRef(new Animated.Value(1)).current; // For success pop animation

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const maskedEmail = email.replace(/^(.{2})(.*)(@.*)$/, (_, first, rest, domain) => {
    const maskedPart = rest.length > 3 ? "*".repeat(5) : "*".repeat(rest.length);
    return `${first}${maskedPart}${domain}`;
  });

  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleVerify = (enteredOtp) => {
    // Use the passed enteredOtp length instead of stale state 'otp'
    if (!enteredOtp || enteredOtp.length !== OTP_LENGTH) {
      setIsError(true);
      setMessage("Please enter the 4 digit OTP.");
      triggerShakeAnimation();
      return;
    }

    setIsVerifying(true); // Start loading
    setIsError(false);
    setMessage("");

    // Simulate Production API call delay (800ms)
    setTimeout(() => {
      if (enteredOtp === "1234") {
        setIsSuccess(true);
        setIsError(false);
        setMessage("OTP verified successfully!");
        setIsVerifying(false);

        // Professional Success Animation Sequence
        Animated.sequence([
          Animated.timing(successScale, { toValue: 1.1, duration: 200, useNativeDriver: true }),
          Animated.spring(successScale, { toValue: 1, friction: 3, useNativeDriver: true }),
        ]).start(() => {
          // Brief delay for the user to register success before navigating
          setTimeout(() => {
            // Redirect to PassengerDetailsScreen (the name used in the Navigator).
            // We use merge: true to update the existing screen parameters without
            // losing the trip details (seats, bus info, etc.) already stored there.
            navigation.navigate({
              name: "PassengerDetailsScreen",
              params: {
                rewardApplied: true,
                rewardDiscount: 150, // Total Discount: 100 + 150 = 250
                verifiedEmail: email
              },
              merge: true,
            });
          }, 1000);
        });
      } else {
        setIsVerifying(false);
        setIsError(true);
        setMessage("Incorrect OTP. Please try again.");
        triggerShakeAnimation();
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    }, 800);
  };

  const handleChange = (value, index) => {
    const nextValue = value.replace(/[^0-9]/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = nextValue;
    setOtp(nextOtp);
    setIsSuccess(false);
    setIsError(false);
    setMessage("");
    
    if (nextValue && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();

    // Production-level Auto-submit Logic
    const fullOtp = nextOtp.join("");
    if (fullOtp.length === OTP_LENGTH) {
      setTimeout(() => handleVerify(fullOtp), 150);
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(30);
    setIsSuccess(false);
    setIsError(false);
    setCanResend(false);
    setMessage("A new OTP has been sent to your email.");
    inputRefs.current[0]?.focus();
    // Add your API call for resending OTP here
    // For now, let's also clear any previous shake animation state
    shakeAnimation.setValue(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </TouchableOpacity>

        <Text style={styles.topText}>Verify your Email Id</Text>

        <View style={styles.illustration}>
          <Image
            source={IMAGES.OTP}
            style={styles.otpImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>
            Enter OTP sent to <Text style={styles.boldEmail}>{maskedEmail}</Text>
          </Text>

          <Animated.View 
            style={[
              styles.otpRow, 
              { 
                transform: [{ translateX: shakeAnimation }, { scale: successScale }] 
              }
            ]}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onFocus={() => setActiveInput(index)}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                style={[
                  styles.otpInput,
                  activeInput === index && styles.otpInputActive,
                  isSuccess && styles.otpInputSuccess,
                  isError && styles.otpInputError,
                ]}
                editable={!isVerifying && !isSuccess}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </Animated.View>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={!canResend || isSuccess}>
              <Text style={[styles.resendLink, !canResend && styles.resendDisabled]}>
                {canResend ? "Resend OTP" : `Resend in ${timer}s`}
              </Text>
            </TouchableOpacity>
          </View>

          {message ? (
            <Text style={[
              styles.message, 
              isError ? styles.errorMessage : styles.successMessage
            ]}>{message}</Text>
          ) : null}

          <TouchableOpacity 
            style={[styles.primaryButton, isSuccess && styles.successButton]} 
            onPress={() => handleVerify(otp.join(""))} 
            disabled={isVerifying || isSuccess}
          >
            {isVerifying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : isSuccess ? (
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Verify</Text>)}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginLeft: -10,
  },
  topText: {
    textAlign: "center",
    color: "#111111",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 28,
    marginTop: 0,
  },
  illustration: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  otpImage: {
    width: 345,
    height: 290,
  },
  content: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "500",
  },
  subtitle: {
    color: "#6E6E6E",
    fontSize: 14,
    marginTop: 8,
  },
  demoNote: {
    fontSize: 12,
    color: "#0878FF",
    marginTop: 4,
  },
  boldEmail: {
    fontWeight: "700",
    color: "#111111",
  },
  otpRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
  },
  otpInput: {
    width: 40,
    height: 44,
    borderRadius: 5,
    backgroundColor: "#F4F4F4",
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
  },
  otpInputActive: {
    borderColor: "#0878FF",
    borderWidth: 1.5,
    backgroundColor: "#FFFFFF",
  },
  otpInputSuccess: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8F4",
    color: "#2E7D32",
  },
  otpInputError: {
    borderColor: "#D32F2F",
    backgroundColor: "#FFF5F5",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  resendText: {
    color: "#777777",
    fontSize: 10,
  },
  resendLink: {
    color: "#0878FF",
    fontSize: 10,
    fontWeight: "700",
  },
  message: {
    fontSize: 11,
    marginTop: 10,
  },
  successMessage: {
    color: "#0878FF",
  },
  errorMessage: {
    color: "#D32F2F",
  },
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 8,
    backgroundColor: "#0878FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  successButton: {
    backgroundColor: "#4CAF50",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
