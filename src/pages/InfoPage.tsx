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
const InfoPage = () => {
  const [inputText, setInputText] = useState("");
  const [unitName, setUnitName] = useState("kgCO2e");

  const handleDataChange = () => {
    if (unitName === 'kgCO2e') {
      setUnitName('km');
    } else {
      setUnitName('kgCO2e');
    }
  }
  const renderItem = ({ item }) => {
    let totalEmission;
    if (isMultiSizeItem(item)) {
      const totalEmissionsArray = item.items.map(subItem =>
          subItem.total_emission
      );
      const totalEmissionsSum = totalEmissionsArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const averageEmission = totalEmissionsSum / item.items.length;
      totalEmission = averageEmission.toFixed(3);
    } else {
      totalEmission = (
          item.total_emission.toFixed(3));
    }

    const carEmissionsEquivalent = parseFloat((5.57413600892 * (totalEmission)).toFixed(3))
    const isCarEmissions = unitName === 'kgCO2e';

    return (
        <View style={styles.itemContainer}>
          <Image source={item.picture} style={styles.itemImage}/>
          <View style={styles.itemTexts}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemEmission}>{isCarEmissions ? carEmissionsEquivalent : totalEmission}</Text>
          </View>
        </View>
    );
  };

  return (
      <LinearGradient colors={["lightblue", "white"]} style={styles.container}>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Carbon Emissions Tracker</Text>
            <TouchableOpacity style={styles.button} onPress={handleDataChange}>
              <Text style={styles.buttonText}>Change unit to {unitName}</Text>
            </TouchableOpacity>
          </View>
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
  },
  button: {
    height: 35,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#075985"
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff'
  },
});

export default InfoPage;

