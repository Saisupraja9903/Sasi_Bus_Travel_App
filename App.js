import 'react-native-gesture-handler';
import React from "react";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/screens/SplashScreen";
import OnboardingScreen from "./src/screens/OnBoardingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import OTPScreen from "./src/screens/OTPScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CitySearchScreen from "./src/components/CitySearchScreen";
import BusResultsScreen from "./src/components/BusResultScreen";
import FilterScreen from "./src/components/FilterScreen";
import BookingScreen from "./src/screens/BookingScreen";
import BookingDetailsScreen from "./src/screens/BookingDetailsScreen";
import OfferScreen from "./src/screens/OfferScreen";
import SleeperSeatSelectionScreen from "./src/components/SleeperSeatSelectionScreen";
import SeaterSeatSelectionScreen from "./src/components/SeaterSeatSelectionScreen";
import ChatBotScreen from "./src/screens/ChatBotScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PersonalDetailsScreen from "./src/components/PersonalDetailsScreen";
import ReferScreen from "./src/components/ReferScreen";
import WalletScreen from "./src/components/WalletScreen";
import BoardingDroppingScreen from "./src/components/BoardingDroppingScreen";
import PassengerInfoScreen from "./src/components/PassengerInfoScreen";
import PaymentScreen from "./src/components/PaymentScreen";
import CardPaymentScreen from "./src/components/CardPaymentScreen";
import NetBankingScreen from "./src/components/NetBankingScreen";
import SuccessScreen from "./src/components/SuccessScreen";
import ReviewsScreen from "./src/components/ReviewsScreen";
import StudentCorpRewardScreen from "./src/components/StudentCorpRewardScreen";
import StudentCorpOtpScreen from "./src/components/StudentCorpOtpScreen";

import BusDetailsBottomSheet from "./src/components/BusDetailsBottomSheet";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <NavigationContainer>

        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "none"
          }}
        >

          <Stack.Screen
            name="Splash"
            component={SplashScreen}
          />

          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          {/* ✅ OTP SCREEN ADDED */}

          <Stack.Screen
            name="OTP"
            component={OTPScreen}
          />

          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />

          <Stack.Screen
            name="CitySearch"
            component={CitySearchScreen}
          />

          <Stack.Screen
            name="BusResults"
            component={BusResultsScreen}
          />

          <Stack.Screen
            name="Filter"
            component={FilterScreen}
          />

          <Stack.Screen
            name="Bookings"
            component={BookingScreen}
          />

          <Stack.Screen
            name="BoardingDroppingScreen"
            component={BoardingDroppingScreen}
            options={{ animation: "slide_from_right" }}
          />

          <Stack.Screen
            name="PassengerDetailsScreen"
            component={PassengerInfoScreen}
          />

          <Stack.Screen
            name="PaymentScreen"
            component={PaymentScreen}
          />

          <Stack.Screen
            name="CardPaymentScreen"
            component={CardPaymentScreen}
          />

          <Stack.Screen
            name="NetBankingScreen"
            component={NetBankingScreen}
          />

          <Stack.Screen
            name="SuccessScreen"
            component={SuccessScreen}
          />

          <Stack.Screen
            name="StudentCorpReward"
            component={StudentCorpRewardScreen}
          />

          <Stack.Screen
            name="StudentCorpOtp"
            component={StudentCorpOtpScreen}
          />

          <Stack.Screen
            name="BookingDetails"
            component={BookingDetailsScreen}
          />

          <Stack.Screen
            name="Offers"
            component={OfferScreen}
          />

          <Stack.Screen
            name="SeaterSeatSelection"
            component={SeaterSeatSelectionScreen}
          />

          <Stack.Screen
            name="SleeperSeatSelection"
            component={SleeperSeatSelectionScreen}
          />

          <Stack.Screen
            name="ChatBot"
            component={ChatBotScreen}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />

          <Stack.Screen
            name="PersonalDetails"
            component={PersonalDetailsScreen}
          />

          <Stack.Screen
            name="Refer"
            component={ReferScreen}
          />

          <Stack.Screen
            name="Wallet"
            component={WalletScreen}
          />

          <Stack.Screen
            name="Reviews"
            component={ReviewsScreen}
          />

          <Stack.Screen
            name="BusDetailsBottomSheet"
            component={BusDetailsBottomSheet}
          />

        </Stack.Navigator>

      </NavigationContainer>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
