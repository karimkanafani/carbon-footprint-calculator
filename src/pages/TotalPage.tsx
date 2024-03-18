import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  PieChart,
} from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectedItem } from "../types/ItemTypes";
import { TextInput } from "react-native-gesture-handler";

const { width, height } = Dimensions.get('window');

const TotalPage = ({ route }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const moveAnimation = useRef(new Animated.Value(0)).current;
  const [inputText, setInputText] = useState("");

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [emissionBreakdown, setEmissionBreakdown] = useState({
    transportation_emissions: 0,
    production_emissions: 0,
    packaging_emissions: 0,
    disposal_emissions: 0,
  });
  const [totalEmission, setTotalEmission] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(moveAnimation, {
        toValue: 1,
        duration: 7000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  useEffect(() => {
    const selectedItems: Record<string, SelectedItem | undefined> = route.params.selectedItems;
    const accEmission = Object.values(selectedItems)
      .filter((selectedItem) => selectedItem !== undefined)
      .reduce((total, selectedItem) => {
        if (selectedItem) {
          return total + selectedItem.count * selectedItem.item.total_emission;
        }
        return total;
      }, 0);

    setTotalEmission(parseFloat(accEmission.toFixed(3)));

    const sepEmission = Object.values(selectedItems)
      .filter((selectedItem) => selectedItem !== undefined)
      .reduce(
        (totals, selectedItem) => {
          if (selectedItem) {
            totals.transportation_emissions += selectedItem.count * selectedItem.item.transportation_emissions;
            totals.production_emissions += selectedItem.count * selectedItem.item.production_emissions;
            totals.packaging_emissions += selectedItem.count * selectedItem.item.packaging_emissions;
            totals.disposal_emissions += selectedItem.count * selectedItem.item.disposal_emissions;
          }
          return totals;
        },
        {
          transportation_emissions: 0,
          production_emissions: 0,
          packaging_emissions: 0,
          disposal_emissions: 0,
        }
      );

    setEmissionBreakdown(sepEmission);
  }, [])

  const carEmissionsEquivalent = parseFloat((5.57413600892 * (totalEmission)).toFixed(3))

  const BreakdownButton = () => (
    <TouchableOpacity onPress={() => setShowBreakdown(!showBreakdown)} style={styles.breakdownButton}>
      <Text style={styles.breakdownButtonText}>{showBreakdown ? "Hide" : "Show"} Breakdown</Text>
    </TouchableOpacity>
  );

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

  const BreakdownView = () => (
    <>
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
    </>
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    /* Show modal for user to enter name of procedure and to save the procedure */
    setModalVisible(true);
  }

  const storeProcedureData = async (procedureName: string, itemsInfo: Record<string, SelectedItem | undefined>) => {
    try {
      const totalEmission = Object.values(itemsInfo)
      .filter((selectedItem) => selectedItem !== undefined)
      .reduce((total, selectedItem) => {
        if (selectedItem) {
          return total + selectedItem.count * selectedItem.item.total_emission;
        }
        return total;
      }, 0);
      const productionEmission = Object.values(itemsInfo)
      .filter((selectedItem) => selectedItem !== undefined)
      .reduce((total, selectedItem) => {
        if (selectedItem) {
          return total + selectedItem.count * selectedItem.item.production_emissions;
        }
        return total;
      }, 0);
      const packagingEmission = Object.values(itemsInfo)
      .filter((selectedItem) => selectedItem !== undefined)
      .reduce((total, selectedItem) => {
        if (selectedItem) {
          return total + selectedItem.count * selectedItem.item.packaging_emissions;
        }
        return total;
      }, 0);
      const transportationEmission = Object.values(itemsInfo)
      .filter((selectedItem) => selectedItem !== undefined)
      .reduce((total, selectedItem) => {
        if (selectedItem) {
          return total + selectedItem.count * selectedItem.item.transportation_emissions;
        }
        return total;
      }, 0);
      const disposalEmission = Object.values(itemsInfo)
      .filter((selectedItem) => selectedItem !== undefined)
      .reduce((total, selectedItem) => {
        if (selectedItem) {
          return total + selectedItem.count * selectedItem.item.disposal_emissions;
        }
        return total;
      }, 0);
      const itemsInfoWithTotalEmission = {...itemsInfo,
        totalEmission: parseFloat(totalEmission.toFixed(3)),
        transportationEmission: parseFloat(transportationEmission.toFixed(3)),
        disposalEmission: parseFloat(disposalEmission.toFixed(3)),
        packagingEmission: parseFloat(packagingEmission.toFixed(3)),
        productionEmission: parseFloat(productionEmission.toFixed(3)),
      }
      const jsonItemsInfo = JSON.stringify(itemsInfoWithTotalEmission);
      await AsyncStorage.setItem(procedureName, jsonItemsInfo);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Procedure 1');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <LinearGradient colors={["#5ea65e", "white"]} style={styles.container}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.fullScreenCentered}>
          <View style={styles.modalView}>
            <View style={{ width: '100%' }}>
              <Text style={styles.inputText}>Enter Procedure Name:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setInputText}
                value={inputText}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    storeProcedureData(inputText, route.params.selectedItems);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>
        Results
      </Text>

      <Text style={styles.totalEmission}>
        {totalEmission} {"kg CO2e"}
      </Text>
      <Text style={styles.emissions_title}>Estimated Carbon Emission</Text>

      <BreakdownButton />
      {showBreakdown && <BreakdownView />}
      <View style={styles.emissionsContainer}>
        <Text style={styles.emissionsText}>
          {"Equivalent to "}{carEmissionsEquivalent}{"km driven by car!"}
        </Text>
      </View>
      <View style={styles.carContainer}>
        <Animated.Image
          source={require("../assets/pictures/car.png")}
          style={[
            styles.carImage,
            {
              transform: [
                {
                  translateX: moveAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, width],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    position: "absolute",
    top: 80,
    left: 25,
    fontSize: 40,
    fontWeight: "bold"
  },
  emissions_title: {
    fontSize: 18,
    color: "black",
    marginBottom: 20,
  },
  totalEmission: {
    fontSize: 35,
    fontWeight: "bold",
    color: "black",
    bottom: 10,
  },
  carContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  carImage: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
  emissionsContainer: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
    width: '100%',
  },
  emissionsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  breakdownButton: {
    backgroundColor: '#5c3312',
    padding: 7,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 20
  },
  breakdownButtonText: {
    color: 'white',
    fontSize: 15,
  },
  breakdownView: {
    padding: 20,
    marginTop: 10,
  },
  breakdownText: {
    fontSize: 15,
  },
  backButton: {
    position: 'absolute',
    top: 130,
    left: 25,
    backgroundColor: 'transparent',
    padding: 7,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: 'black',
  },
  backButtonText: {
    color: 'black',
  },
  saveButton: {
    position: 'absolute',
    top: 130,
    right: 25,
    backgroundColor: 'transparent',
    padding: 7,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: 'black',
  },
  saveText: {
    color: 'black',
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
    width: '90%',
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    padding: 10,
  },
  inputText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: "#009900", // green save button
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
});

export default TotalPage;
