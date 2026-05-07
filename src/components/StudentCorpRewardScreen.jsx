import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Image,
  Platform,
  ScrollView,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import IMAGES from "../constants/images.js";

export default function StudentCorpRewardScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Professional retrieval: Pre-fill with email from previous screen params if available
  const [email, setEmail] = useState(route.params?.email || "");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const contentWidth = Math.min(width - 28, 560);
  const heroHeight = Math.max(280, Math.min(width * 0.9, 350));
  const imageWidth = Math.max(132, Math.min(width * 0.42, 190));
  const imageHeight = imageWidth * 1.18;
  const titleFontSize = width < 360 ? 17 : 20;

  const handleSendOtp = () => {
    const trimmedEmail = email.trim();

    // Production-level validation checks
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedEmail.toLowerCase().endsWith("@gmail.com")) {
      setError("Personal Gmail accounts are not eligible. Please use your student or corporate ID.");
      return;
    }

    setError("");
    Keyboard.dismiss();
    navigation.navigate("StudentCorpOtp", { email: trimmedEmail });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.hero, { height: heroHeight, paddingTop: insets.top + 28 }]}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={[styles.backButton, { top: insets.top + 8 }]}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={26} color="#333" />
            </TouchableOpacity>
            <View style={[styles.heroInner, { width: contentWidth }]}>
              <Text style={[styles.heroTitle, { fontSize: titleFontSize }]}>
                Exclusive Deals for Students{"\n"}& Employees
              </Text>

              <Text style={styles.heroText}>
                Verify your student or corporate{"\n"}
                email to unlock special discounts{"\n"}
                and exclusive offers.
              </Text>

              <Image
                source={IMAGES.STUDENT}
                style={[
                  styles.studentImage,
                  {
                    width: imageWidth,
                    height: imageHeight,
                    left: width < 360 ? 18 : 32,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={[styles.formCard, { width: contentWidth }]}>
            <Text style={styles.label}>Enter your college / corporate Email Id</Text>

            <TextInput
              value={email}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError("");
              }}
              style={[
                styles.input,
                error && styles.inputError,
                isFocused && styles.inputFocused,
              ]}
              placeholder="Enter your Email Id"
              placeholderTextColor="#B5B5B5"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="send"
              onSubmitEditing={handleSendOtp}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSendOtp} activeOpacity={0.86}>
              <Text style={styles.primaryButtonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDF2FF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  hero: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 24,
    overflow: "hidden",
  },
  backButton: {
    position: "absolute",
    left: 12,
    padding: 8,
    zIndex: 10,
  },
  heroInner: {
    alignSelf: "center",
    flex: 1,
    alignItems: "center",
  },
  heroTitle: {
    color: "#006FFF",
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center",
    marginTop: 18,
  },
  heroText: {
    position: "absolute",
    right: 60,
    bottom: 100,
    color: "#111111",
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontWeight: "500",
    textAlign: "center",
  },
  studentImage: {
    position: "absolute",
    bottom: -15,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 24,
  },
  label: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 28,
  },
  input: {
    height: 51,
    borderWidth: 1,
    borderColor: "#B7B7B7",
    borderRadius: 9,
    paddingHorizontal: 18,
    color: "#222222",
    fontSize: 16,
    fontWeight: "500",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  inputFocused: {
    borderColor: "#0878FF",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 11,
    marginTop: 8,
  },
  primaryButton: {
    height: 57,
    borderRadius: 10,
    backgroundColor: "#0878FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400",
  },
});
