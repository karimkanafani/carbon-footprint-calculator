import React, {useState} from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform, FlatList, Image
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LinearGradient} from "expo-linear-gradient";
import {DATA, isMultiSizeItem} from "./SelectionPage";

const renderItem = ({ item }) => {
  let totalEmission;
  if (isMultiSizeItem(item)) {
    const totalEmissionsArray = item.items.map(subItem =>
        subItem.total_emission
    );
    const totalEmissionsSum = totalEmissionsArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const averageEmission = totalEmissionsSum / item.items.length;
    totalEmission = averageEmission.toFixed(3) + " kg CO2e (AVG)";
  } else {
    totalEmission = (
        item.total_emission + " CO2e");
  }

  return (
      <View style={styles.itemContainer}>
        <Image source={item.picture} style={styles.itemImage}/>
        <View style={styles.itemTexts}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemEmission}>{totalEmission}</Text>
        </View>
      </View>
  );
};


const InfoPage = () => {
  const [inputText, setInputText] = useState("");

  return (
      <LinearGradient colors={["lightblue", "white"]} style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Carbon Emissions Tracker for Medical Devices</Text>
          <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
          />
        </View>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "10%",
    paddingHorizontal: 10
  }, title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    width: "100%",
    flexDirection: "row",
    alignItems: "center"
  },
  itemImage: {
    height: 50,
    width: 50,
    resizeMode: "cover",
    marginRight: 10
  },
  itemTitle: {
    marginRight: 10
  },
  itemEmission: {
    color: "darkblue",
    textAlign: "right"
  },
  itemTexts: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default InfoPage;

