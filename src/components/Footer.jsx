import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const FOOTER_IMAGES = {
  CHATBOT: require("../../assets/chatbot.png"),
};

export default function Footer() {
  const navigation = useNavigation();
  const route = useRoute();
  const activeTab = route.name;
  const { phone } = route.params || {};

  const getColor = (tab) => {
    return activeTab === tab ? "#2F80ED" : "#777";
  };

return (
<View style={styles.container}>

  {/* Floating Chatbot */}
  <View style={styles.chatbotWrapper}>
    <TouchableOpacity 
      style={styles.chatbotCircle} 
      onPress={() => navigation.navigate("ChatBot", { phone })}
      activeOpacity={0.8}
    >
      <Image source={FOOTER_IMAGES.CHATBOT} style={styles.chatbotIcon} />
    </TouchableOpacity>
  </View>

  <View style={styles.footer}>

    <TouchableOpacity 
      style={styles.item} 
      onPress={() => navigation.navigate("Home", { phone })}
      activeOpacity={0.7}
    >
      <Ionicons name="home" size={24} color={getColor("Home")} />
      <Text style={[styles.text, { color: getColor("Home") }]}>Home</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.item} 
      onPress={() => navigation.navigate("Bookings", { phone })}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name="ticket-confirmation-outline"
        size={24}
        color={getColor("Bookings")}
      />
      <Text style={[styles.text, { color: getColor("Bookings") }]}>
        My Bookings
      </Text>
    </TouchableOpacity>

    {/* Space for chatbot */}
    <View style={{ width: 60 }} />

    <TouchableOpacity 
      style={styles.item} 
      onPress={() => navigation.navigate("Offers", { phone })}
      activeOpacity={0.7}
    >
      <MaterialIcons name="local-offer" size={24} color={getColor("Offers")} />
      <Text style={[styles.text, { color: getColor("Offers") }]}>Offers</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.item} 
      onPress={() => navigation.navigate("Profile", { phone })}
      activeOpacity={0.7}
    >
      <Ionicons name="person-outline" size={24} color={getColor("Profile")} />
      <Text style={[styles.text, { color: getColor("Profile") }]}>
        Profile
      </Text>
    </TouchableOpacity>

  </View>

</View>
);
}

const styles = StyleSheet.create({

container:{
  position:"absolute",
  bottom:20,
  left:16,
  right:16
},

footer:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",
  backgroundColor:"#fff",
  paddingVertical:12,
  paddingHorizontal:30,
  borderRadius:20,

  elevation:6,
  shadowColor:"#000",
  shadowOffset:{width:0,height:2},
  shadowOpacity:0.2,
  shadowRadius:3
},

item:{
  alignItems:"center"
},

text:{
  fontSize:12,
  marginTop:3
},

chatbotWrapper:{
  position:"absolute",
  alignSelf:"center",
  top:-35,
  zIndex:10
},

chatbotCircle:{
  width:80,
  height:80,
  borderRadius:40,
  backgroundColor:"#fff",
  justifyContent:"center",
  alignItems:"center",

  elevation:8,
  shadowColor:"#000",
  shadowOffset:{width:0,height:3},
  shadowOpacity:0.25,
  shadowRadius:4
},

chatbotIcon:{
  width:55,
  height:55
}

});