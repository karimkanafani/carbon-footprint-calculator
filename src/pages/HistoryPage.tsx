import React, {useState} from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {ItemData, MultiSizeItem} from "../types/ItemTypes";

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
                <Text>History</Text>
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
  });


export default HistoryPage;