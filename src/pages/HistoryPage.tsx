import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ItemData, MultiSizeItem } from "../types/ItemTypes";

const HistoryPage = () => {

  const procedures = [
    {
      name: "test1",
      emissions: 10,
    },
    {
      name: "test2",
      emissions: 20,
    },
    {
      name: "test3",
      emissions: 30,
    },
    {
      name: "test4",
      emissions: 40,
    },
    {
      name: "test5",
      emissions: 50,
    }
  ];

  return (
    <LinearGradient colors={["lightblue", "white"]} style={styles.container}>
      <View style={styles.container}>
        {procedures.map((p, index) => (
          <View key={index} style={styles.procedureContainer}>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.emission}>{p.emissions}</Text>
          </View>
        ))}
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "10%",
    paddingHorizontal: 10
  },
  procedureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 10,
  },
  name: {
    flex: 1,
    marginRight: 10,
    fontWeight: 'bold',
    paddingLeft: 10, 
    paddingRight: 5, 
  },
  emission: {
    flex: 1,
    textAlign: 'right',
    paddingRight: 10, 
    paddingLeft: 5, 
  },
});



export default HistoryPage;