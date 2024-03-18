import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Calendar } from 'react-native-calendars';

interface IProcedure {
  name: string;
  emission: number;
  date: string;
}

const { width, height } = Dimensions.get('window');

const formatDate = (date: Date): string => {
  let year = date.toLocaleString("default", { year: "numeric" });
  let month = date.toLocaleString("default", { month: "2-digit" });
  let day = date.toLocaleString("default", { day: "2-digit" });

  return year + "-" + month + "-" + day;
}

const HistoryPage = () => {

  const isFocused = useIsFocused();

  const [savedProcedures, setSavedProcedures] = useState<IProcedure[]>([]);
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

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
              emission: item.totalEmission,
              date: formatDate(new Date())
            });
          })
          setSavedProcedures(procedures);

          let markedDates = {};
          procedures.forEach((p) => {
            markedDates[p.date] = { marked: true };
          });
          setMarkedDates(markedDates);

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

  const groupProceduresByDate = (arr: IProcedure[]) => {
    const grouped = {};
  
    arr.forEach((item: IProcedure) => {
      const { date, ...rest } = item;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(rest);
    });
  
    return grouped;
  }

  return (
    <LinearGradient colors={["lightblue", "white"]} style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.fullScreenCentered}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
      <Calendar
        style={styles.calendar}
        markedDates={markedDates}
        onDayPress={day => {
          const grouped = groupProceduresByDate(savedProcedures);
          console.log(grouped[day.dateString]); // This will log all procedures for the selected date
          setModalVisible(true);
        }}
      />

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
  calendar: {
    marginBottom: 100,
  },
  fullScreenCentered: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute', // Ensures it overlays over everything
    top: 0,
    left: 0,
  },
  modalView: {
    width: '90%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  }
});



export default HistoryPage;