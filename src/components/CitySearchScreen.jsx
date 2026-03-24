import React, { useState } from "react";
import { 
View, 
Text, 
TextInput, 
StyleSheet, 
TouchableOpacity, 
FlatList 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const cities = [
"Hyderabad",
"Bangalore",
"Goa",
"Vijayawada",
"Kakinada",
"Tirupathi",
"Jaipur",
"Vishakapatnam",
"Delhi",
"Kolkata"
];

export default function CitySearchScreen({ navigation, route }) {

const { currentLocation, type } = route.params;

const [search, setSearch] = useState("");

const filteredCities = cities.filter(city =>
city.toLowerCase().includes(search.toLowerCase())
);

const selectCity = (city) => {
navigation.navigate({
      name: "Home",
      params: { selectedCity: city, type: type },
      merge: true,
    });
};

return (

<SafeAreaView style={styles.safeArea}>

<View style={styles.container}>

{/* HEADER */}

<View style={styles.header}>

<TouchableOpacity onPress={() => navigation.goBack()}>
<MaterialIcons name="arrow-back" size={24} color="#000"/>
</TouchableOpacity>

<TextInput
style={styles.search}
placeholder="Search by Boarding point"
placeholderTextColor="#777"
value={search}
onChangeText={setSearch}
/>

</View>


{/* SELECTED CITY */}

<View style={styles.selectedCity}>
<Text style={styles.selectedText}>{currentLocation}</Text>
</View>


{/* RECENT SEARCH */}

<Text style={styles.sectionTitle}>
Recently Searched Routes
</Text>

<Text style={styles.recentRoute}>
Hyderabad - Bangalore
</Text>


{/* POPULAR CITIES */}

<Text style={styles.sectionTitle}>
Popular Cities
</Text>

<FlatList
data={filteredCities}
keyExtractor={(item) => item}
showsVerticalScrollIndicator={false}
renderItem={({ item }) => (

<TouchableOpacity
style={styles.cityRow}
onPress={() => selectCity(item)}
>

<MaterialIcons name="location-city" size={18} color="#888"/>

<Text style={styles.cityText}>
{item}
</Text>

</TouchableOpacity>

)}
/>

</View>

</SafeAreaView>
);
}

const styles = StyleSheet.create({

safeArea:{
flex:1,
backgroundColor:"#fff"
},

container:{
flex:1,
paddingHorizontal:20
},

header:{
flexDirection:"row",
alignItems:"center",
marginTop:5,
marginBottom:15
},

search:{
flex:1,
backgroundColor:"#E6EFFA",
marginLeft:10,
borderRadius:25,
paddingHorizontal:15,
paddingVertical:12,
fontSize:14
},

selectedCity:{
backgroundColor:"#E5E5E5",
paddingVertical:12,
paddingHorizontal:18,
borderRadius:25,
marginBottom:20,
alignSelf:"flex-start"
},

selectedText:{
fontSize:14,
fontFamily:"Poppins_500Medium"
},

sectionTitle:{
color:"#2F80ED",
fontSize:14,
fontFamily:"Poppins_600SemiBold",
marginBottom:10
},

recentRoute:{
fontSize:13,
marginBottom:20,
color:"#333"
},

cityRow:{
flexDirection:"row",
alignItems:"center",
paddingVertical:14,
borderBottomWidth:1,
borderBottomColor:"#eee"
},

cityText:{
marginLeft:12,
fontSize:14,
fontFamily:"Poppins_400Regular"
}

});