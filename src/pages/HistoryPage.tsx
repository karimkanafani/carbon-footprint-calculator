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
import {PieChart} from "react-native-chart-kit";

interface IProcedure {
  name: string;
  emission: number;
  transportation: number;
  production: number;
  packaging: number;
  disposal: number;
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
  const [emissionBreakdown, setEmissionBreakdown] = useState({
    transportation_emissions: 0,
    production_emissions: 0,
    packaging_emissions: 0,
    disposal_emissions: 0,
  });
  const [emissionDay, setEmissionDay] = useState(0);

  const data = [
    {
      name: "Transportation",
      emissions: parseFloat(emissionBreakdown.transportation_emissions.toFixed(3)),
      color: "blue",
      legendFontColor: "#353535FF",
      legendFontSize: 15
    },
    {
      name: "Production",
      emissions: parseFloat(emissionBreakdown.production_emissions.toFixed(3)),
      color: "lightblue",
      legendFontColor: "#353535FF",
      legendFontSize: 15
    },
    {
      name: "Packaging",
      emissions: parseFloat(emissionBreakdown.packaging_emissions.toFixed(3)),
      color: "green",
      legendFontColor: "#353535FF",
      legendFontSize: 15
    },
    {
      name: "Disposal",
      emissions: parseFloat(emissionBreakdown.disposal_emissions.toFixed(3)),
      color: "lightgreen",
      legendFontColor: "#353535",
      legendFontSize: 15
    },

  ];

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

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
              transportation: item.transportationEmission,
              disposal: item.disposalEmission,
              packaging: item.packagingEmission,
              production: item.productionEmission,
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

  const carEmissionsEquivalent = parseFloat((5.57413600892 * (emissionDay)).toFixed(3))

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
            <PieChart
                data={data}
                width={width - 30}
                height={200}
                chartConfig={chartConfig}
                accessor={"emissions"}
                backgroundColor={"#e4feeb"}
                paddingLeft={"-20"}
                center={[20, 5]}
                style={{ borderRadius: 20, }}
            />
            <Text>Total Emission {emissionDay} kg CO2e</Text>
            <Text>{carEmissionsEquivalent} km in a car!</Text>
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
          if(grouped[day.dateString] != undefined){
            const totalDisposal = grouped[day.dateString].reduce((total, procedure) => {
              return total + procedure.disposal;
            }, 0);
            const totalEmission = grouped[day.dateString].reduce((total, procedure) => {
              return total + procedure.emission;
            }, 0);
            const totalPackaging = grouped[day.dateString].reduce((total, procedure) => {
              return total + procedure.packaging;
            }, 0);
            const totalTransportation = grouped[day.dateString].reduce((total, procedure) => {
              return total + procedure.transportation;
            }, 0);
            const totalProduction = grouped[day.dateString].reduce((total, procedure) => {
              return total + procedure.production;
            }, 0);
            let dayEmission = {
              transportation_emissions: totalTransportation,
              production_emissions: totalProduction,
              packaging_emissions: totalPackaging,
              disposal_emissions: totalDisposal,
            };
            setEmissionBreakdown(dayEmission);
            setEmissionDay(totalEmission);
            setModalVisible(true);
          }
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
    borderRadius: 10
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
    width: "95%",
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