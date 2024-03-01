import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IProcedure {
  name: string;
  emission: number;
}

const HistoryPage = () => {
  
  const isFocused = useIsFocused();

  const [savedProcedures, setSavedProcedures] = useState<IProcedure[]>([]);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const result = (await AsyncStorage.multiGet(keys)).map((item) => (JSON.parse(item[1])));
          let procedures: IProcedure[] = [];
          result.forEach((item, i) => {
            procedures.push({
              name: keys[i],
              emission: item.totalEmission
            });
          })
          setSavedProcedures(procedures);          
        } catch (e) {
          console.log(e.message);
        }
      })();
    }
  }, [isFocused]);

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      setSavedProcedures([]);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <LinearGradient colors={["lightblue", "white"]} style={styles.container}>
      <View></View>
      <View style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>History Log</Text>
          <TouchableOpacity onPress={clearStorage}>
            <Text>Clear</Text>
          </TouchableOpacity>
        </View>
        {savedProcedures.map((p, index) => (
          <View key={index} style={styles.procedureContainer}>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.emission}>{`${p.emission} kg CO2e`}</Text>
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
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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