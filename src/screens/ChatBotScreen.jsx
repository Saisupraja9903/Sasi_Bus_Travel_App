import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  Platform,
  Vibration,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const CHATBOT_ICON = require("../../assets/chatbot.png");

// Explicit Colors for Production Consistency
const COLORS = {
  PRIMARY: "#007AFF",
  TEXT: "#000000",
  TEXT_LIGHT: "#555555",
  WHITE: "#FFFFFF",
  GREY: "#8E8E93",
  ERROR: "#FF3B30",
};

const INITIAL_MESSAGE =
  "Hi 👋 Welcome to SasiBus! I'm here to help you with booking tickets, managing your journeys, and answering your travel questions. Please choose an option below to get started.";

const FAREWELL_TEMPLATES = [
  "Thank you for choosing SasiBus, {name}! We're always here to help you with your travel needs. Have a safe and wonderful journey! 👋",
  "It was a pleasure assisting you today, {name}. SasiBus wishes you a safe and comfortable trip. See you soon! 🚌",
  "Thanks for stopping by, {name}! If you need anything else, we're just a chat away. Safe travels! ✨",
  "Farewell, {name}! We appreciate your trust in SasiBus. May your journey be as smooth as this chat! 🌏",
];

const getFarewellMessage = (name = "Traveler") => {
  const randomIndex = Math.floor(Math.random() * FAREWELL_TEMPLATES.length);
  return FAREWELL_TEMPLATES[randomIndex].replace("{name}", name);
};

const FIRST_OPTIONS = [
  {
    id: "cancel_ticket",
    text: "Do you want to Cancel your ticket?",
    userText: "Cancel Ticket",
  },
  {
    id: "callback",
    text: "Request a callback from customer support",
    userText: "Callback Request",
  },
  {
    id: "support_chat",
    text: "Chat with customer support",
    userText: "Chat with Customer Support",
  },
];

const FEEDBACK_OPTIONS = [
  { id: "feedback_yes", text: "Yes 👍" },
  { id: "feedback_no", text: "No 👎" },
];

const END_OPTIONS = [
  { id: "back_to_menu", text: "Back to Menu" },
  { id: "end_chat", text: "End Chat" },
];

const SUPPORT_ISSUE_OPTIONS = [
  { id: "support_refund", text: "Refund Status" },
  { id: "support_booking", text: "Booking Modification" },
  { id: "support_tracking", text: "Bus Tracking" },
  { id: "support_boarding", text: "Boarding Point Help" },
  { id: "others_support", text: "Other Issues", filled: true },
];

const OTP_RESEND_TIME = 30; // Standard 30-second window
const MAX_RESEND_ATTEMPTS = 3;
const KEYBOARD_INPUT_GAP = 16;
const INPUT_VERTICAL_PADDING = 10;
const INPUT_RESTING_PADDING = 16;

const DEFAULT_BOOKING_DETAILS = {
  pnr: "8829471052",
  passengerName: "Lokesh Naidu",
  seats: ["U1", "U2"],
  travelDate: "15 May 2026, 10:00 PM",
  fare: 1500,
};

const createInitialMessages = () => [
  { type: "bot", text: INITIAL_MESSAGE },
  { type: "options", options: FIRST_OPTIONS },
];

const CANCELLATION_REASONS = [
  "Plan changed",
  "Booked by mistake",
  "Medical emergency",
  "Personal reasons",
  "Bus timing not suitable",
];

const validateBookingId = (bookingId) => /^\d{10}$/.test(String(bookingId || "").trim());

const validateOtp = (otp) => /^\d{6}$/.test(String(otp || "").trim());

const getFormattedMobile = (mobile) => {
  const digits = String(mobile || "").replace(/\D/g, "");
  const normalized = digits.length >= 10 ? digits.slice(-10) : null;
  return normalized ? `+91 ${normalized}` : null;
};

const validateMobileNumber = (mobile) => /^[6-9]\d{9}$/.test(String(getFormattedMobile(mobile) || "").replace(/\D/g, "").slice(-10));

const getBookingDetails = (bookingId, details) => ({
  ...DEFAULT_BOOKING_DETAILS,
  ...(details || {}),
  bookingId,
});

// Safe Text Wrapper to prevent rendering errors
const SafeText = ({ children, style, ...props }) => {
  const safeValue = Array.isArray(children)
    ? children
        .filter((child) => typeof child === "string" || typeof child === "number")
        .join("")
    : typeof children === "string" || typeof children === "number"
      ? children
      : "";
  return <Text style={style} {...props}>{safeValue}</Text>;
};

const ChatBotScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { phone, mobile, mobileNumber, user, bookingDetails } = route.params || {};
  const userMobile = phone || mobile || mobileNumber || user?.phone || user?.mobile || null;
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState(createInitialMessages());
  const [input, setInput] = useState("");
  const [expectedInput, setExpectedInput] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputBarHeight, setInputBarHeight] = useState(72);
  const [isTyping, setIsTyping] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);

  const insets = useSafeAreaInsets();
  const inputBarTranslateY = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Countdown Timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const triggerShake = useCallback(() => {
    Vibration.vibrate(Platform.OS === 'android' ? 50 : [0, 50]); 
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardDidShowListener = Keyboard.addListener(showEvent, (e) => {
      const rawHeight = e?.endCoordinates?.height || 0;
      const height = Platform.OS === "ios" ? Math.max(rawHeight - insets.bottom, 0) : rawHeight;
      const lift = height > 0 ? height + KEYBOARD_INPUT_GAP : 0;

      setKeyboardHeight(height);

      Animated.spring(inputBarTranslateY, {
        toValue: -lift,
        useNativeDriver: true,
        friction: 9,
        tension: 110,
      }).start();

      // Small delay to ensure layout has updated before scrolling
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      Animated.spring(inputBarTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 9,
        tension: 110,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [insets.bottom, inputBarTranslateY]); // Re-run effect if insets.bottom changes

  useEffect(() => {
    if (isTyping || messages.length > 0) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [isTyping, messages.length]);

  const calculateTypingDelay = (text) => {
    const base = 500;
    return Math.min(Math.max(base + (text?.length || 0) * 10, 800), 2000);
  };

  const appendMessages = useCallback((nextMessages) => {
    setMessages((current) => [...current, ...nextMessages]);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const showFeedback = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      appendMessages([
        { type: "bot", text: "Was this information helpful?" },
        { type: "options", options: FEEDBACK_OPTIONS, compact: true },
      ]);
    }, 1200);
  };

  const getUserMobile = useCallback(() => getFormattedMobile(userMobile), [userMobile]);

  const appendBotMessagesWithDelay = useCallback((nextMessages, delay) => {
    setIsTyping(true);
    const finalDelay = delay || calculateTypingDelay(nextMessages[0]?.text);
    setTimeout(() => {
      setIsTyping(false);
      appendMessages(nextMessages);
    }, finalDelay);
  }, [appendMessages]);

  const showEndOptions = useCallback((delay = 500) => {
    setTimeout(() => {
      appendMessages([{ type: "options", options: END_OPTIONS, compact: true }]);
    }, delay);
  }, [appendMessages]);

  const resetOtpFlow = useCallback(() => {
    setResendTimer(0);
    setResendAttempts(0);
  }, []);

  const startOtpFlow = useCallback((delay = 0) => {
    setTimeout(() => {
      setResendTimer(OTP_RESEND_TIME);
      setExpectedInput("otp");
    }, delay);
  }, []);

  const startCancelTicketFlow = useCallback((includeUserMessage = false, userText = "Cancel Ticket") => {
    if (includeUserMessage) {
      appendMessages([{ type: "user", text: userText }]);
    }

    appendBotMessagesWithDelay([{ type: "bot", text: "Please enter booking id to proceed" }], 900);
    setTimeout(() => setExpectedInput("booking_id"), 900);
  }, [appendBotMessagesWithDelay, appendMessages]);

  const startCallbackFlow = useCallback((includeUserMessage = false, userText = "Request Callback") => {
    const formattedMobile = getUserMobile();

    if (includeUserMessage) {
      appendMessages([{ type: "user", text: userText }]);
    }

    if (formattedMobile) {
      appendBotMessagesWithDelay([
        { type: "bot", text: `We will connect you shortly to our support team at ${formattedMobile}.` },
        { type: "bot", text: "Your callback request has been registered. Our team will contact you shortly." },
        { type: "options", options: END_OPTIONS, compact: true },
      ], 1000);
      setExpectedInput(null);
      return;
    }

    appendBotMessagesWithDelay([
      {
        type: "bot",
        text: "We can arrange a call back from our support team. Please share your mobile number to proceed.",
      },
    ], 900);
    setTimeout(() => setExpectedInput("callback_number"), 900);
  }, [appendBotMessagesWithDelay, appendMessages, getUserMobile]);

  const startSupportChatFlow = useCallback((includeUserMessage = false, userText = "Chat with Support") => {
    const formattedMobile = getUserMobile();

    if (includeUserMessage) {
      appendMessages([{ type: "user", text: userText }]);
    }

    if (!formattedMobile) {
      appendBotMessagesWithDelay([
        { type: "bot", text: "Please share your mobile number to connect with customer support." },
      ], 900);
      setTimeout(() => setExpectedInput("support_mobile"), 900);
      return;
    }

    appendBotMessagesWithDelay([
      { type: "bot", text: `We will connect you shortly to our support team at ${formattedMobile}.` },
      { type: "bot", text: "To help us assist you better, please select the nature of your issue:" },
      {
        type: "options",
        options: SUPPORT_ISSUE_OPTIONS,
        compact: true,
      },
    ], 1200);
  }, [appendBotMessagesWithDelay, appendMessages, getUserMobile]);

  const handleSmartReply = useCallback((message) => {
    const text = String(message || "").toLowerCase();

    if (/\b(hi|hello|hey)\b/.test(text)) {
      appendBotMessagesWithDelay([
        { type: "bot", text: INITIAL_MESSAGE },
        { type: "options", options: FIRST_OPTIONS },
      ], 800);
      return;
    }

    if (/\b(cancel|cancellation|ticket cancel)\b/.test(text)) {
      startCancelTicketFlow(false);
      return;
    }

    if (/\b(refund|money|amount)\b/.test(text)) {
      appendBotMessagesWithDelay([
        { type: "bot", text: "Refund will be processed within 5–7 working days after cancellation." },
        { type: "options", options: END_OPTIONS, compact: true },
      ], 800);
      return;
    }

    if (/\b(callback|call me|call back)\b/.test(text)) {
      startCallbackFlow(false);
      return;
    }

    if (/\b(support|help|agent|customer care)\b/.test(text)) {
      startSupportChatFlow(false);
      return;
    }

    appendBotMessagesWithDelay([
      { type: "bot", text: "I didn’t understand that. Please choose an option below." },
      { type: "options", options: FIRST_OPTIONS },
    ], 800);
  }, [appendBotMessagesWithDelay, startCallbackFlow, startCancelTicketFlow, startSupportChatFlow]);

  const handleOptionPress = (option) => {
    if (!option?.id || isTyping) return;
    const optionText = option?.text || "";
    Vibration.vibrate(10); // Standard micro-interaction tap

    if (option.id === "cancel_ticket") {
      startCancelTicketFlow(true, optionText);
      return;
    }

    if (option.id === "callback") {
      startCallbackFlow(true, optionText);
      return;
    }

    if (option.id === "support_chat") {
      setExpectedInput(null);
      setInput("");
      resetOtpFlow();
      startSupportChatFlow(true, optionText);
      return;
    }

    if (option.id.startsWith("support_") && option.id !== "support_chat") {
      appendMessages([{ type: "user", text: optionText }]);
      appendBotMessagesWithDelay([
        { type: "bot", text: `I've noted that your concern is regarding "${optionText}".` },
        { type: "bot", text: "Connecting you to the relevant support specialist. Please stay online..." },
      ], 1000);
      setTimeout(showFeedback, 3000);
      return;
    }

    if (option.id === "others_support") {
      appendMessages([{ type: "user", text: optionText }]);
      appendBotMessagesWithDelay([
        { type: "bot", text: "Please describe your issue in detail so I can assist you better." },
      ], 800);
      setTimeout(() => setExpectedInput("support_description"), 850);
      return;
    }

    if (option.id === "view_bookings") {
      appendMessages([{ type: "user", text: optionText }]);
      appendBotMessagesWithDelay([{ type: "bot", text: "Navigating to your bookings page... You can find your 10-digit ID there." }], 600);
      setTimeout(() => navigation.navigate("Bookings"), 1500);
      return;
    }

    if (option.id === "retry_booking_id") {
      appendMessages([{ type: "user", text: optionText }]);
      appendBotMessagesWithDelay([{ type: "bot", text: "Sure, please enter your 10-digit numeric Booking ID." }], 600);
      setTimeout(() => setExpectedInput("booking_id"), 800);
      return;
    }

    if (option.id === "confirm_cancel_no") {
      appendMessages([{ type: "user", text: optionText }]);
      setTimeout(showFeedback, 500);
      return;
    }

    if (option.id === "confirm_cancel_yes") {
      appendMessages([{ type: "user", text: optionText }]);
      resetOtpFlow();
      const formattedMobile = getUserMobile() || "your registered mobile number";
      appendBotMessagesWithDelay([
        {
          type: "bot",
          text: `Please Enter the OTP sent to the registered number ${formattedMobile} to proceed`,
        },
      ], 900);
      startOtpFlow(900);
      return;
    }

    if (option.id === "callback_submit") {
      appendMessages([{ type: "user", text: optionText }]);
      appendBotMessagesWithDelay([
        { type: "bot", text: "Your callback request has been registered. Our team will contact you shortly." },
        { type: "options", options: END_OPTIONS, compact: true },
      ], 900);
      return;
    }

    if (option.id === "resend_otp") {
      if (expectedInput !== "otp" || resendTimer > 0 || resendAttempts >= MAX_RESEND_ATTEMPTS) return;
      Vibration.vibrate(50);

      const newAttempts = resendAttempts + 1;
      setResendAttempts(newAttempts);

      appendMessages([{ type: "user", text: "Resend OTP" }]);
      const formattedMobile = getUserMobile() || "your registered mobile number";

      const botMessages = [{ type: "bot", text: `A new OTP has been sent to ${formattedMobile}.` }];

      if (newAttempts >= MAX_RESEND_ATTEMPTS) {
        botMessages.push({ type: "bot", text: "Maximum resend attempts reached. If you still haven't received the OTP, please contact support." });
        botMessages.push({ type: "options", options: [{ id: "support_chat", text: "Chat with Support" }], compact: true });
      }

      appendBotMessagesWithDelay(botMessages, 1000);
      setTimeout(() => {
        setResendTimer(newAttempts < MAX_RESEND_ATTEMPTS ? OTP_RESEND_TIME : 0);
        setExpectedInput("otp");
      }, 1000);
      return;
    }

    if (option.id === "callback_retry") {
      appendMessages([{ type: "user", text: optionText }]);
      appendBotMessagesWithDelay([
        { type: "bot", text: "Please enter the mobile number you would like us to call." },
      ], 800);
      setTimeout(() => setExpectedInput("callback_number"), 800);
      return;
    }

    if (option.id === "feedback_yes") {
      appendMessages([
        { type: "user", text: optionText },
        { type: "bot", text: "Glad we could help! 😊" },
      ]);
      showEndOptions();
      return;
    }

    if (option.id === "feedback_no") {
      appendMessages([{ type: "user", text: optionText }]);
      appendBotMessagesWithDelay([
        { type: "bot", text: "We're sorry for the inconvenience. You can also try calling our support team." },
        { type: "options", options: END_OPTIONS, compact: true },
      ], 900);
      return;
    }

    if (option.id === "back_to_menu") {
      setMessages(createInitialMessages());
      setExpectedInput(null);
      setInput("");
      resetOtpFlow();
      return;
    }

    if (option.id === "end_chat") {
      const displayName = user?.name || bookingDetails?.passengerName || "Traveler";
      const farewell = getFarewellMessage(displayName);

      appendMessages([{ type: "user", text: optionText }]);
      appendBotMessagesWithDelay([{ type: "bot", text: farewell }], 800);

      // Professional transition: Allow user to read the message then reset the stack
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home", params: { phone: userMobile } }],
        });
      }, 3500); // 800ms typing + 2700ms reading time for a high-quality transition
      return;
    }
  };

  const handleBookingConfirmCancellation = (bookingId) => {
    if (isTyping) return;

    appendMessages([{ type: "user", text: "Confirm Cancellation" }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      resetOtpFlow();
      startOtpFlow();
      const formattedMobile = getUserMobile() || "your registered mobile number";
      appendMessages([
        {
          type: "bot",
          text: `An OTP has been sent to ${formattedMobile}. Please enter the OTP to confirm cancellation of booking ${bookingId}.`,
        },
      ]);
    }, 1500);
  };

  const handleBookingCancel = () => {
    if (isTyping) return;

    appendMessages([{ type: "user", text: "Cancel" }]);
    setExpectedInput(null);
    setInput("");
    resetOtpFlow();
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      appendMessages([
        { type: "bot", text: INITIAL_MESSAGE },
        { type: "options", options: FIRST_OPTIONS },
      ]);
    }, 800);
  };

  const sendMessage = () => {
    const value = input.trim();
    if (!value || isTyping) return;

    if (expectedInput === "booking_id") {
      if (!validateBookingId(value)) {
        triggerShake();
        setInput(""); // Clear input but don't append to chat for a cleaner error state
        appendBotMessagesWithDelay([
          { type: "bot", text: `"${value}" is not a valid 10-digit Booking ID. Would you like to check your bookings or try again?` },
          { 
            type: "options", 
            options: [
              { id: "view_bookings", text: "View My Bookings" },
              { id: "retry_booking_id", text: "Try Again" },
              { id: "back_to_menu", text: "Main Menu" }
            ], 
            compact: true 
          },
        ], 800);
        setExpectedInput(null);
        return;
      }

      appendMessages([{ type: "user", text: value }]);
      setInput("");

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        appendMessages([
          { type: "bot", text: "Fetching your booking details..." },
          {
            type: "booking_details_card",
            ...getBookingDetails(value, bookingDetails),
          },
        ]);
        requestAnimationFrame(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        });
      }, 2000);
      setExpectedInput(null);
      return;
    }

    if (expectedInput === "otp") {
      appendMessages([{ type: "user", text: value }]);
      setInput("");

      if (!validateOtp(value)) {
        triggerShake();
        appendBotMessagesWithDelay([
          { type: "bot", text: "Invalid OTP. Please enter the correct 6-digit OTP sent to your mobile." },
        ], 700);
        return;
      }

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        Vibration.vibrate(Platform.OS === 'android' ? [0, 50, 30, 50] : [0, 50]);
        resetOtpFlow();
        // Mark the booking card as cancelled in the message history
        setMessages((current) =>
          current.map((msg) =>
            msg.type === "booking_details_card" ? { ...msg, isCancelled: true } : msg
          )
        );
        appendMessages([
          {
            type: "bot",
            text: "Your ticket has been successfully canceled. Refund will be processed within 5–7 working days.",
          },
        ]);
        setTimeout(showFeedback, 1000);
      }, 1800);
      setExpectedInput(null);
      return;
    }

    if (expectedInput === "callback_number") {
      const isPhoneValid = validateMobileNumber(value);
      appendMessages([{ type: "user", text: value }]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        if (!isPhoneValid) triggerShake();
        setIsTyping(false);
        if (!isPhoneValid) {
          appendMessages([
            { type: "bot", text: "Please enter a valid mobile number to continue." },
            { type: "options", options: [{ id: "callback_retry", text: "Retry" }], compact: true },
          ]);
          return;
        }

        appendMessages([
          { type: "bot", text: `We will connect you shortly to our support team at ${getFormattedMobile(value)}.` },
          { type: "bot", text: "Your callback request has been registered. Our team will contact you shortly." },
          { type: "options", options: END_OPTIONS, compact: true },
        ]);
      }, 1200);
      setExpectedInput(null);
      return;
    }

    if (expectedInput === "support_description") {
      appendMessages([{ type: "user", text: value }]);
      setInput("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        appendMessages([
          { type: "bot", text: "Thank you for describing the issue. Our support executive has received your message and will join this chat within 2 minutes." },
        ]);
        setTimeout(showFeedback, 2000);
      }, 1500);
      setExpectedInput(null);
      return;
    }

    if (expectedInput === "support_mobile") {
      const isPhoneValid = validateMobileNumber(value);
      appendMessages([{ type: "user", text: value }]);
      setInput("");

      if (!isPhoneValid) {
        triggerShake();
        appendBotMessagesWithDelay([
          { type: "bot", text: "Please enter valid details to continue." },
        ], 700);
        return;
      }

      appendBotMessagesWithDelay([
        { type: "bot", text: `We will connect you shortly to our support team at ${getFormattedMobile(value)}.` },
        { type: "bot", text: "To help us assist you better, please select the nature of your issue:" },
        {
          type: "options",
          options: SUPPORT_ISSUE_OPTIONS,
          compact: true,
        },
      ], 900);
      setExpectedInput(null);
      return;
    }

    appendMessages([{ type: "user", text: value }]);
    setInput("");
    handleSmartReply(value);
  };

  const renderItem = (item, index) => {
    if (item.type === "options") {
      return (
        <View
          key={`opt-${index}`}
          style={[
            styles.optionsContainer,
            item.compact && styles.compactOptions,
            item.align === "right" && styles.rightOptions,
          ]}
        >
          {(item.options || []).map((option) => (
            <OptionButton
              key={option?.id || option?.text || `option-${index}`}
              option={option}
              compact={item.compact}
              onPress={() => handleOptionPress(option)}
            />
          ))}
        </View>
      );
    } else if (item.type === "booking_details_card") {
      return (
        <BookingDetailsCard
          key={`card-${index}`}
          bookingId={item.bookingId}
          pnr={item.pnr}
          passengerName={item.passengerName}
          seats={item.seats}
          travelDate={item.travelDate}
          fare={item.fare}
          onConfirm={() => handleBookingConfirmCancellation(item.bookingId)}
          onCancel={handleBookingCancel}
          isCancelled={item.isCancelled}
        />
      );
    } else {
      return (
        <AnimatedMessageWrapper key={`msg-${index}`}>
          <MessageBubble message={item} />
        </AnimatedMessageWrapper>
      );
    }
  };

  const inputBottomPadding = keyboardHeight > 0 ? INPUT_VERTICAL_PADDING : Math.max(insets.bottom, INPUT_RESTING_PADDING);
  const keyboardAwareBottomPadding =
    inputBarHeight + inputBottomPadding + 18 + (keyboardHeight > 0 ? keyboardHeight + KEYBOARD_INPUT_GAP : 0);
  const trimmedInput = input.trim();
  const canSendMessage = !isTyping && trimmedInput.length > 0 && (expectedInput !== "otp" || trimmedInput.length === 6);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.PRIMARY} style={{ marginRight: 8 }} />
        </TouchableOpacity>
        <Image source={CHATBOT_ICON} style={styles.headerIcon} />
        <View style={styles.headerCopy}>
          <SafeText style={styles.headerTitle}>SasiBus Assistant</SafeText>
          <SafeText style={styles.headerSub}>AI-Powered Travel Support</SafeText>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chatContainer}
        contentContainerStyle={[
          styles.chatContent, 
          { paddingBottom: keyboardAwareBottomPadding }
        ]}
        keyboardShouldPersistTaps="always"
      >
        {messages.map(renderItem)}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      <Animated.View 
        onLayout={(e) => setInputBarHeight(e.nativeEvent.layout.height)}
        style={[
          styles.inputContainerWrapper, 
          { transform: [{ translateY: inputBarTranslateY }, { translateX: shakeAnim }] }
        ]}>
        {expectedInput === "otp" && (
          <OTPTimer
            timer={resendTimer}
            attempts={resendAttempts}
            maxAttempts={MAX_RESEND_ATTEMPTS}
            onResend={() => handleOptionPress({ id: "resend_otp", text: "Resend OTP" })}
          />
        )}
        <View 
          style={[
            styles.inputContainer, 
            { paddingBottom: inputBottomPadding }
          ]}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={input}
              onChangeText={(text) => {
                if (["booking_id", "otp", "callback_number", "support_mobile"].includes(expectedInput)) {
                  setInput(text.replace(/[^0-9]/g, ''));
                } else {
                  setInput(text);
                }
              }}
              placeholder={
                expectedInput === "booking_id" ? "Enter 10-digit ID" :
                expectedInput === "otp" ? "Enter 6-digit OTP" :
                "Type message here..."
              }
              placeholderTextColor={COLORS.GREY}
              style={[
                styles.input,
                expectedInput === "booking_id" && input.length > 0 && { paddingRight: 45 }
              ]}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              editable={!isTyping}
              keyboardType={["booking_id", "otp", "callback_number", "support_mobile"].includes(expectedInput) ? "number-pad" : "default"}
              maxLength={expectedInput === "booking_id" ? 10 : expectedInput === "otp" ? 6 : 500}
            />
            {expectedInput === "booking_id" && input.length > 0 && (
              <View style={[
                styles.counterBadge,
                (10 - input.length <= 2) && styles.counterBadgeWarning
              ]}>
                <SafeText style={[
                  styles.counterText,
                  (10 - input.length <= 2) && styles.counterTextWarning
                ]}>
                  {10 - input.length}
                </SafeText>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.sendBtn, 
              !canSendMessage && styles.disabledSendBtn
            ]}
            onPress={sendMessage}
            disabled={!canSendMessage}
            activeOpacity={0.85}
          >
            <MaterialIcons name="send" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const AnimatedMessageWrapper = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; // Start 30 pixels below

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {children}
    </Animated.View>
  );
};

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  const dotStyle = (anim) => ({
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.PRIMARY,
    marginHorizontal: 2,
    opacity: anim,
  });

  return (
    <View style={[styles.messageRow, styles.leftAlign]}>
      <Image source={CHATBOT_ICON} style={styles.botIcon} />
      <View style={[styles.messageBubble, styles.botBubble, { flexDirection: 'row', alignItems: 'center', minHeight: 32 }]}>
        <Animated.View style={dotStyle(dot1)} />
        <Animated.View style={dotStyle(dot2)} />
        <Animated.View style={dotStyle(dot3)} />
      </View>
    </View>
  );
};

const MessageBubble = ({ message }) => {
  const isUser = message.type === "user";
  const text = typeof message?.text === "string" ? message.text : "";
  if (!text && !message.options) return null;

  return (
    <View style={[styles.messageRow, isUser ? styles.rightAlign : styles.leftAlign]}>
      {!isUser && <Image source={CHATBOT_ICON} style={styles.botIcon} />}
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        <SafeText style={[styles.messageText, isUser ? styles.userText : styles.botText]}>{text}</SafeText>
      </View>
    </View>
  );
};

const OptionButton = ({ option, compact, onPress }) => {
  if (!option?.id) return null;
  const displayText = option?.text || "";

  return (
    <TouchableOpacity
      style={[
        styles.optionBtn,
        compact && styles.compactOptionBtn,
        option.filled && styles.filledOptionBtn,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <SafeText style={[
        styles.optionText, 
        option.filled && styles.filledOptionText,
      ]}>
        {displayText}
      </SafeText>
    </TouchableOpacity>
  );
};

const OTPTimer = ({ timer, attempts, maxAttempts, onResend }) => {
  const isLimitReached = attempts >= maxAttempts;
  const isWaiting = timer > 0 && !isLimitReached;

  if (isLimitReached) {
    return (
      <View style={styles.otpTimerContainer}>
        <SafeText style={styles.otpTimerText}>Resend limit reached</SafeText>
      </View>
    );
  }

  if (isWaiting) {
    return (
      <View style={styles.otpTimerContainer}>
        <SafeText style={styles.otpTimerText}>{`Resend in ${timer}s`}</SafeText>
      </View>
    );
  }

  return (
    <View style={styles.otpTimerContainer}>
      <TouchableOpacity style={styles.otpResendButton} onPress={onResend} activeOpacity={0.85}>
        <SafeText style={styles.otpResendText}>Resend OTP</SafeText>
      </TouchableOpacity>
    </View>
  );
};

const BookingDetailsCard = ({
  pnr,
  passengerName,
  seats = [],
  travelDate,
  fare = 0,
  onConfirm,
  onCancel,
  isCancelled,
}) => {
  const safeSeats = Array.isArray(seats) ? seats : [];
  const [cancellationType, setCancellationType] = useState("full");
  const [selectedSeats, setSelectedSeats] = useState(safeSeats);
  const [refundMethod, setRefundMethod] = useState("wallet");
  const [reason, setReason] = useState("Customer Request");
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const numericFare = Number.isFinite(Number(fare)) ? Number(fare) : 0;
  const seatFare = safeSeats.length > 0 ? numericFare / safeSeats.length : 0;
  const currentFare = selectedSeats.length * seatFare;
  const cancellationCharges = Math.round(currentFare * 0.15); // Dynamic 15% policy
  const refundAmount = Math.max(0, currentFare - cancellationCharges);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) => (prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]));
  };

  const handleTypeChange = (type) => {
    setCancellationType(type);
    if (type === "full") setSelectedSeats(safeSeats);
  };

  const toggleReasonDropdown = () => {
    setShowReasonDropdown(!showReasonDropdown);
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      onConfirm();
    }, 1500);
  };

  return (
    <View style={styles.bookingCardRow}>
      <Image source={CHATBOT_ICON} style={styles.botIcon} />
      <View style={styles.bookingCard}>
        <View style={styles.bookingCardHeader}>
          <SafeText style={styles.bookingCardTitle}>
            {isCancelled ? "Cancellation Summary" : "Cancel Ticket"}
          </SafeText>
          {isCancelled && (
            <View style={styles.statusBadge}>
              <MaterialIcons name="check-circle" size={12} color={COLORS.WHITE} />
              <SafeText style={styles.statusBadgeText}>CANCELLED</SafeText>
            </View>
          )}
        </View>

        <View style={styles.bookingSection}>
          <SafeText style={styles.bookingSectionTitle}>Booking Summary</SafeText>
          <View style={styles.summaryGrid}>
            <DetailRow label="PNR:" value={pnr} />
            <DetailRow label="Passenger:" value={passengerName} />
            <DetailRow label="Seats:" value={safeSeats.join(", ")} />
            <DetailRow label="Travel Date:" value={travelDate} />
            <DetailRow label="Total Fare:" value={`₹${Math.round(numericFare)}`} />
          </View>
        </View>

        <View style={styles.bookingSection}>
          <SafeText style={styles.bookingSectionTitle}>Cancellation Options</SafeText>
          <TouchableOpacity 
            style={styles.radioItem} 
            onPress={() => !isCancelled && handleTypeChange("full")}
            disabled={isCancelled}
          >
            <RadioButton selected={cancellationType === "full"} />
            <SafeText style={styles.radioLabel}>Full Cancellation</SafeText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.radioItem} 
            onPress={() => !isCancelled && handleTypeChange("partial")}
            disabled={isCancelled}
          >
            <RadioButton selected={cancellationType === "partial"} />
            <SafeText style={styles.radioLabel}>Partial Cancellation </SafeText>
            <SafeText style={styles.radioHelper}>(select seats)</SafeText>
          </TouchableOpacity>

          {cancellationType === "partial" && (
            <View style={styles.seatSelector}>
              <SafeText style={styles.selectorLabel}>Select seats to cancel:</SafeText>
              <View style={styles.chipsContainer}>
                {safeSeats.map((seat) => (
                  <SeatChip
                    key={seat}
                    seat={seat}
                    isSelected={selectedSeats.includes(seat)}
                    price={Math.round(seatFare)}
                    onPress={() => toggleSeat(seat)}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.bookingSection}>
          <SafeText style={styles.bookingSectionTitle}>Cancellation Reason</SafeText>
          <TouchableOpacity 
            style={styles.dropdownTrigger} 
            onPress={() => !isCancelled && toggleReasonDropdown()}
            activeOpacity={isCancelled ? 1 : 0.7}
            disabled={isCancelled}
          >
            <SafeText style={styles.dropdownValue}>{reason}</SafeText>
            {!isCancelled && <MaterialIcons 
              name={showReasonDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={20} 
              color="#666" 
            />}
          </TouchableOpacity>
          
          {showReasonDropdown && (
            <View style={styles.dropdownContent}>
              {CANCELLATION_REASONS.map((item) => (
                <TouchableOpacity 
                  key={item} 
                  style={styles.dropdownItem} 
                  onPress={() => {
                    setReason(item);
                    toggleReasonDropdown();
                  }}
                >
                  <SafeText style={[styles.dropdownItemText, reason === item && styles.activeDropdownItemText]}>{item}</SafeText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bookingSection}>
          <SafeText style={styles.bookingSectionTitle}>Refund Details</SafeText>
          <RefundRow label={`Fare for ${selectedSeats.length} Seat(s)`} value={`₹${Math.round(currentFare)}`} />
          <RefundRow label="Cancellation Charges" value={`- ₹${cancellationCharges}`} isNegative />
          <View style={styles.totalRefundRow}>
            <SafeText style={styles.totalRefundLabel}>Refund Amount</SafeText>
            <SafeText style={styles.totalRefundValue}>{`₹${Math.round(refundAmount)}`}</SafeText>
          </View>
        </View>

        <View style={styles.bookingSection}>
          <SafeText style={styles.bookingSectionTitle}>Refund Method</SafeText>
          <View style={styles.methodRow}>
            <TouchableOpacity style={styles.radioItem} onPress={() => setRefundMethod("wallet")}>
              <RadioButton selected={true} /> {/* Always selected */}
              <SafeText style={styles.radioLabel}>SasiBus Wallet Credit</SafeText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bookingActions}>
          {isCancelled ? (
            <View style={styles.finalizedContainer}>
              <SafeText style={styles.finalizedText}>This transaction is finalized</SafeText>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.confirmCancelButton, selectedSeats.length === 0 && styles.disabledBtn]}
                onPress={handleConfirm}
                disabled={selectedSeats.length === 0 || isConfirming}
                activeOpacity={0.8}
              >
                {isConfirming ? <ActivityIndicator color={COLORS.WHITE} size="small" /> : <SafeText style={styles.confirmCancelText}>Confirm Cancellation</SafeText>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelOutlineButton} onPress={onCancel} activeOpacity={0.8}>
                <SafeText style={styles.cancelOutlineText}>Cancel</SafeText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const SeatChip = ({ seat, isSelected, price, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const safeSeat = typeof seat === "string" || typeof seat === "number" ? seat : "";
  const safePrice = Number.isFinite(Number(price)) ? Math.round(Number(price)) : 0;

  const handlePress = () => {
    // Trigger a quick shrink and then spring back to original size
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(seat);
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <Animated.View style={[styles.seatChip, isSelected && styles.seatChipActive, { transform: [{ scale }] }]}>
        <View style={{ alignItems: 'center' }}>
          <SafeText style={[styles.seatText, isSelected && styles.seatTextActive]}>{safeSeat}</SafeText>
          <SafeText style={[styles.seatPrice, isSelected && styles.seatTextActive]}>{`₹${safePrice}`}</SafeText>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const RadioButton = ({ selected }) => (
  <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
    {selected && <View style={styles.radioInner} />}
  </View>
);

const DetailRow = ({ label, value }) => {
  const safeLabel = typeof label === "string" || typeof label === "number" ? `${label} ` : "";
  const safeValue = typeof value === "string" || typeof value === "number" ? value : "";

  return (
    <View style={styles.detailRow}>
      <SafeText style={styles.detailLabel}>{safeLabel}</SafeText>
      <SafeText style={styles.detailValue}>{safeValue}</SafeText>
    </View>
  );
};

const RefundRow = ({ label, value, isNegative }) => {
  const safeLabel = typeof label === "string" || typeof label === "number" ? label : "";
  const safeValue = typeof value === "string" || typeof value === "number" ? value : "";

  return (
    <View style={[styles.refundRow, { borderTopWidth: 0, paddingVertical: 4 }]}>
      <SafeText style={styles.refundLabel}>{safeLabel}</SafeText>
      <SafeText style={[styles.refundValue, isNegative && { color: COLORS.ERROR }]}>{safeValue}</SafeText>
    </View>
  );
};

export default ChatBotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 55 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  headerCopy: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007AFF",
  },
  headerSub: {
    marginTop: 2,
    fontSize: 13,
    color: "#555555",
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  leftAlign: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  rightAlign: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  botIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    marginTop: 2,
  },
  messageBubble: {
    maxWidth: "82%",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: "#000000",
  },
  userText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
  optionsContainer: {
    marginLeft: 32,
    marginRight: 22,
    marginBottom: 14,
  },
  compactOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  rightOptions: {
    alignItems: "flex-end",
    marginRight: 0,
  },
  optionBtn: {
    borderWidth: 1.5,
    borderColor: "#B000D4",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 9,
    backgroundColor: "#FFFFFF",
  },
  compactOptionBtn: {
    minWidth: 86,
    marginBottom: 6,
  },
  filledOptionBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    paddingHorizontal: 20,
  },
  optionText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  filledOptionText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  bookingCardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  bookingCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
    maxWidth: "90%",
  },
  bookingCardHeader: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingCardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  bookingSection: {
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
  },
  bookingSectionBody: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
  },
  bookingSectionTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 6,
  },
  summaryGrid: {
    marginTop: 4,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  methodRow: {
    flexDirection: "row",
    gap: 20,
  },
  seatSelector: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  selectorLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  seatChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#F9F9F9",
  },
  seatChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  seatText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  seatPrice: {
    fontSize: 10,
    color: "#888",
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  dropdownValue: {
    fontSize: 13,
    color: '#333',
  },
  dropdownContent: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#555',
  },
  activeDropdownItemText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  seatTextActive: {
    color: "#FFF",
  },
  reasonInput: {
    fontSize: 13,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  disabledBtn: {
    backgroundColor: "#CCC",
  },
  detailLabel: {
    color: "#666",
    fontSize: 12,
  },
  detailValue: {
    flex: 1,
    color: "#000000",
    fontSize: 13,
    lineHeight: 18,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioOuterActive: {
    borderColor: "#007AFF",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  radioLabel: {
    color: "#000000",
    fontSize: 12,
    lineHeight: 17,
  },
  radioHelper: {
    color: "#007AFF",
    fontSize: 12,
    lineHeight: 17,
    marginLeft: 4,
  },
  reasonBox: {
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  reasonText: {
    color: "#000000",
    fontSize: 13,
  },
  refundRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
  },
  refundLabel: {
    flex: 1,
    color: "#000000",
    fontSize: 12,
    lineHeight: 16,
  },
  refundValue: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    marginLeft: 10,
  },
  totalRefundRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  totalRefundLabel: {
    fontWeight: "700",
    fontSize: 13,
  },
  totalRefundValue: {
    fontWeight: "700",
    fontSize: 15,
    color: "#007AFF",
  },
  paymentOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  bookingActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
  },
  finalizedContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  finalizedText: {
    color: '#666',
    fontSize: 13,
    fontStyle: 'italic',
  },
  confirmCancelButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  confirmCancelText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  cancelOutlineButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  cancelOutlineText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  inputContainerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF', // Ensure background is solid
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    zIndex: 10, // Ensure it's above other content
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 8,
    // paddingBottom handled by insets.bottom + 10
    backgroundColor: "#FFFFFF", // Explicitly set background
  },
  otpTimerContainer: {
    minHeight: 34,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    backgroundColor: "#FFFFFF",
  },
  otpTimerText: {
    color: COLORS.GREY,
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.72,
  },
  otpResendButton: {
    minHeight: 30,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    backgroundColor: "#FFFFFF",
  },
  otpResendText: {
    color: COLORS.PRIMARY,
    fontSize: 12,
    fontWeight: "700",
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  counterBadge: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  counterText: {
    fontSize: 10,
    color: COLORS.GREY,
    fontWeight: '800',
  },
  counterBadgeWarning: {
    borderColor: COLORS.ERROR,
    backgroundColor: '#FFF5F5',
  },
  counterTextWarning: {
    color: COLORS.ERROR,
  },
  input: {
    flex: 1,
    minHeight: 42,
    backgroundColor: "#FFFFFF",
    color: "#000000",
    borderRadius: 22,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#007AFF",
    fontSize: 14,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  disabledSendBtn: {
    backgroundColor: "#CCCCCC",
  },
});
