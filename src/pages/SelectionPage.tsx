import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image, Modal,
  Dimensions, Linking
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MedicalItem from "../components/MedicalItem";
import MultiSizeMedicalItem from "../components/MultiSizeMedicalItem";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ItemData, MultiSizeItem, SelectedItem } from "../types/ItemTypes";

const { width, height } = Dimensions.get('window');

export const isMultiSizeItem = (item: ItemData | MultiSizeItem): item is MultiSizeItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'items' in item
  );
}

export const DATA: (ItemData | MultiSizeItem)[] = [
  {
    id: "1",
    picture: require("../assets/pictures/surgical_gloves.png"),
    title: "Non-Sterile Surgical Gloves (Pair)",
    total_emission: 0.735 + 0.04 + 0.0002853 + 0.042,
    transportation_emissions: 0.735,
    production_emissions: 0.04,
    packaging_emissions: 0.0002853,
    disposal_emissions: 0.042,
  },
  {
    id: "2",
    picture: require("../assets/pictures/sterile_gloves.png"),
    title: "Sterile Surgical Gloves (Pair)",
    total_emission: 0.735 + 0.1 + 0.18+ 0.042,
    transportation_emissions: 0.735,
    production_emissions: 0.1,
    packaging_emissions: 0.18,
    disposal_emissions: 0.042,
  },
  {
    id: "3",
    picture: require("../assets/pictures/syringe.png"),
    title: "Syringe",
    items: [
      {
        id: "3-1",
        title: "2mL Syringe",
        total_emission: 0.178 + 0.0005 * 2 * 8.27 + 0.0005 * 2 * 1.58 + 0.0005 * 2 * 1.139,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 2 * 8.27,
        packaging_emissions: 0.0005 * 2 * 1.58,
        disposal_emissions: 0.0005 * 2 * 1.139,
      },
      {
        id: "3-2",
        title: "5mL Syringe",
        total_emission: 0.178 + 0.0005 * 5 * 8.27 + 0.0005 * 5 * 1.58 + 0.0005 * 5 * 1.139,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 5 * 8.27,
        packaging_emissions: 0.0005 * 5 * 1.58,
        disposal_emissions: 0.0005 * 5 * 1.139,
      },
      {
        id: "3-3",
        title: "10mL Syringe",
        total_emission: 0.178 + 0.0005 * 10 * 8.27 + 0.0005 * 10 * 1.58 + 0.0005 * 10 * 1.139,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 10 * 8.27,
        packaging_emissions: 0.0005 * 10 * 1.58,
        disposal_emissions: 0.0005 * 10 * 1.139,
      },
      {
        id: "3-4",
        title: "20mL Syringe",
        total_emission: 0.178 + 0.0005 * 20 * 8.27 + 0.0005 * 20 * 1.58 + 0.075,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 20 * 8.27,
        packaging_emissions: 0.0005 * 20 * 1.58,
        disposal_emissions: 0.075,
      },
      {
        id: "3-5",
        title: "30mL Syringe",
        total_emission: 0.178 + 0.0005 * 30 * 8.27 + 0.0005 * 30 * 1.58 + 0.0005 * 30 * 1.139,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 30 * 8.27,
        packaging_emissions: 0.0005 * 30 * 1.58,
        disposal_emissions: 0.0005 * 30 * 1.139,
      },
      {
        id: "3-6",
        title: "50mL Syringe",
        total_emission: 0.178 + 0.0005 * 50 * 8.27 + 0.0005 * 50 * 1.58 + 0.0005 * 50 * 1.139,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 50 * 8.27,
        packaging_emissions: 0.0005 * 50 * 1.58,
        disposal_emissions: 0.0005 * 50 * 1.139,
      },
    ]
  },
  {
    id: "4",
    picture: require("../assets/pictures/n95-with-valve.png"),
    title: "N95 Mask (with valve)",
    total_emission: 0.18 + 1.525 + 0.2688 + 0.075,
    transportation_emissions: 0.18,
    production_emissions: 1.525,
    packaging_emissions: 0.2688,
    disposal_emissions: 0.075,
  },
  {
    id: "5",
    picture: require("../assets/pictures/n95-no-valve.png"),
    title: "N95 Mask (no valve)",
    total_emission: 0.18 + 0.96 + 0.007+ 0.005,
    transportation_emissions: 0.18,
    production_emissions: 0.96,
    packaging_emissions: 0.007,
    disposal_emissions: 0.005,
  },
  {
    id: "6",
    picture: require("../assets/pictures/cotton-gauze.png"),
    title: "Cotton Gauze (Box of 10x10)",
    total_emission: 1.07 + 0.0367 + 0.65 + 2.0,
    transportation_emissions: 1.07,
    production_emissions: 0.0367,
    packaging_emissions: 0.65,
    disposal_emissions: 2.0,
  },
  {
    id: "7",
    picture: require("../assets/pictures/iv-tubing.png"),
    title: "IV Tubing",
    total_emission: 0.2132 + 1.5 * 30.33 * 0.001 + 6 * 2.4 * 0.001 + 0.03033 * 0.253,
    transportation_emissions: 0.2132,
    production_emissions: 1.5 * 30.33 * 0.001, // 0.045495
    packaging_emissions: 6 * 2.4 * 0.001, //0.0144
    disposal_emissions: 0.03033 * 0.253, //0.00767349
  },
  {
    id: "8",
    picture: require("../assets/pictures/hypodermic-needle.png"),
    title: "Hypodermic Needle",
    items: [
      {
        id: "8-1",
        title: "Hypodermic Needle 16G",
        total_emission: 0.178 + 0.00127 + 0.0005 * 32.5 * 1.58 + 0.000505,
        transportation_emissions: 0.178,
        production_emissions: 0.00127,
        packaging_emissions: 0.0005 * 32.5 * 1.58,
        disposal_emissions: 0.000505,
      },
      {
        id: "8-2",
        title: "Hypodermic Needle 21G",
        total_emission: 0.178 + 0.000309 + 0.0005 * 31.5 * 1.58 + 0.000124,
        transportation_emissions: 0.178,
        production_emissions: 0.000309,
        packaging_emissions:  0.0005 * 31.5 * 1.58,
        disposal_emissions:  0.000124,
      },
      {
        id: "8-3",
        title: "Hypodermic Needle 23G",
        total_emission: 0.178 + 0.000149 + 0.0005 * 27.5 * 1.58 + 0.000119,
        transportation_emissions: 0.178,
        production_emissions: 0.000149,
        packaging_emissions:  0.0005 * 27.5 * 1.58,
        disposal_emissions: 0.000119,
      }
    ]
  },
  {
    id: "9",
    picture: require("../assets/pictures/surgical_mask.png"),
    title: "Surgical Mask",
    total_emission: 0.16 + 2.15 + 0.041 + 0.005,
    transportation_emissions: 0.16,
    production_emissions: 2.15,
    packaging_emissions: 0.041,
    disposal_emissions: 0.005,
  }
];

const SelectionPage = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState<
    Record<string, SelectedItem | undefined>
  >({});

  const [searchQuery, setSearchQuery] = useState("");
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const filteredData = DATA.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (id, change) => {
    if (!selectedItems[id]) {
      setSelectedItems((prevSelectedItems) => ({
        ...prevSelectedItems,
        [id]: { count: 1, item: DATA.find((item) => item.id === id) },
      }));
    } else if (selectedItems[id].count + change < 1) {
      setSelectedItems({ ...selectedItems, [id]: undefined });
    } else {
      setSelectedItems({
        ...selectedItems,
        [id]: { ...selectedItems[id], count: selectedItems[id].count + change },
      });
    }
  };

  const handleNext = () => {
    let totalEmission = Object.values(selectedItems)
      .filter((selectedItem) => selectedItem !== undefined)
      .reduce((total, selectedItem) => {
        if (selectedItem) {
          return total + selectedItem.count * selectedItem.item.total_emission;
        }
        return total;
      }, 0);

    totalEmission = parseFloat(totalEmission.toFixed(3));

    const emissionBreakdown = Object.values(selectedItems)
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
    navigation.navigate("Total", { selectedItems });
  };

  const shouldShowResetButton = Object.values(selectedItems).some(
    (selectedItem) => selectedItem !== undefined
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["lightblue", "white"]} style={styles.container}>
        <TouchableOpacity
          onPress={() => setInfoModalVisible(true)}
          style={styles.infoButton}
        >
          <Ionicons name="information-circle-outline" size={25} style={styles.infoButton} />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={infoModalVisible}
          onRequestClose={() => setInfoModalVisible(false)}
        >
          <View style={styles.fullScreenCentered}>
            <View style={styles.modalView}>
              {/* Modal Content */}
              <Text style={{ fontSize: 18, marginBottom: 10 }}>Please remember to change your mask every 2 hours.</Text>
              <Text style={{color: 'blue'}}  onPress={() => Linking.openURL('https://itag.gitbook.io/privacy-policy')}>Privacy Policy</Text>
              <TouchableOpacity
                onPress={() => setInfoModalVisible(false)}
                style={styles.closeButton}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={styles.title}>Carbon Emissions Calculator</Text>
        <TextInput
          style={styles.input}
          placeholder="Search for medical items..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        <FlatList
          data={filteredData}
          numColumns={2}
          renderItem={({ item }) => (
            (isMultiSizeItem(item)) ?
              <MultiSizeMedicalItem
                title={item.title}
                picture={item.picture}
                items={item.items}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              /> :
              <MedicalItem
                title={item.title}
                onSelect={(change) => handleSelect(item.id, change)}
                isSelected={!!selectedItems[item.id]}
                count={selectedItems[item.id]?.count}
                picture={item.picture}
              />
          )}
          contentContainerStyle={styles.flatListContent}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />

        {shouldShowResetButton && (
          <TouchableOpacity style={styles.resetButton} onPress={() => setSelectedItems({})}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: "black",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 70
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  flatListContent: {
    paddingHorizontal: 7,
  },
  infoButton: {
    position: "absolute",
    top: 30,
    right: 10,
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
  closeButton: {
    marginTop: 15,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  resetButton: {
    position: "absolute",
    top: 175,  // Adjust the top position as needed
    right: 20,
    width: 45,  // Adjust the width as needed
    height: 20,  // Adjust the height as needed
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  resetButtonText: {
    color: "black",
  },
});

export default SelectionPage;
