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
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MedicalItem from "../components/MedicalItem";
import MultiSizeMedicalItem from "../components/MultiSizeMedicalItem";
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

type ItemData = {
  id: string;
  picture: Image;
  title: string;
  total_emission: number;
  transportation_emissions: any;
  production_emissions: any;
  packaging_emissions: any;
  disposal_emissions: any;
};

type MultiSizeItem = {
  id: string;
  picture: Image;
  title: string;
  items: Omit<ItemData, "picture">[];
}

type SelectedItem = {
  count: number;
  item: ItemData;
};


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
    title: "Latex Surgical Gloves (Pair)",
    total_emission: 1.2,
    transportation_emissions: 1.07,
    production_emissions: 0.048,
    packaging_emissions: 0.03,
    disposal_emissions: 0.042,
  },
  {
    id: "2",
    picture: require("../assets/pictures/surgical_mask.png"),
    title: "Surgical Mask",
    total_emission: 2.249,
    transportation_emissions: 0.16,
    production_emissions: 2.15,
    packaging_emissions: 0.041,
    disposal_emissions: 0.005,
  },
  {
    id: "3",
    picture: require("../assets/pictures/syringe.png"),
    title: "Syringe",
    items: [
      {
        id: "3-1",
        title: "2mL Syringe",
        total_emission: 0.5898,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 2 * 8.27,
        packaging_emissions: 0.0005 * 2 * 1.58,
        disposal_emissions: 0.0005 * 2 * 1.139,
      },
      {
        id: "3-2",
        title: "5mL Syringe",
        total_emission: 0.6475,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 5 * 8.27,
        packaging_emissions: 0.0005 * 5 * 1.58,
        disposal_emissions: 0.0005 * 5 * 1.139,
      },
      {
        id: "3-3",
        title: "10mL Syringe",
        total_emission: 0.7834,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 10 * 8.27,
        packaging_emissions: 0.0005 * 10 * 1.58,
        disposal_emissions: 0.0005 * 10 * 1.139,
      },
      {
        id: "3-4",
        title: "20mL Syringe",
        total_emission: 0.9,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 20 * 8.27,
        packaging_emissions: 0.0005 * 20 * 1.58,
        disposal_emissions: 0.075,
      },
      {
        id: "3-5",
        title: "30mL Syringe",
        total_emission: 1.1,
        transportation_emissions: 0.178,
        production_emissions: 0.0005 * 30 * 8.27,
        packaging_emissions: 0.0005 * 30 * 1.58,
        disposal_emissions: 0.0005 * 30 * 1.139,
      },
      {
        id: "3-6",
        title: "50mL Syringe",
        total_emission: 1.4,
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
    total_emission: 3.822,
    transportation_emissions: 0.18,
    production_emissions: 1.525,
    packaging_emissions: 0.2688,
    disposal_emissions: 0.075,
  },
  {
    id: "5",
    picture: require("../assets/pictures/n95-no-valve.png"),
    title: "N95 Mask (no valve)",
    total_emission: 1.904,
    transportation_emissions: 0.18,
    production_emissions: 0.96,
    packaging_emissions: 0.007,
    disposal_emissions: 0.005,
  },
  {
    id: "6",
    picture: require("../assets/pictures/cotton-gauze.png"),
    title: "Cotton Gauze (Box of 10x10)",
    total_emission: 1.904,
    transportation_emissions: 1.07,
    production_emissions: 0.0367,
    packaging_emissions: 0.65,
    disposal_emissions: 2.0,
  },
  {
    id: "7",
    picture: require("../assets/pictures/iv-tubing.png"),
    title: "IV Tubing",
    total_emission: 1.904, // temp data
    transportation_emissions: 1.07, // temp data
    production_emissions: 0.0367, // temp data
    packaging_emissions: 0.65, // temp data
    disposal_emissions: 2.0, // temp data
  },
  {
    id: "8",
    picture: require("../assets/pictures/hypodermic-needle.png"),
    title: "Hypodermic Needle",
    items: [
      {
        id: "8-1",
        title: "Hypodermic Needle 16G",
        total_emission: 0.205,
        transportation_emissions: 0.178,
        production_emissions: 0.00127,
        packaging_emissions: 0.0005 * 32.5 * 1.58,
        disposal_emissions: 0.000505,
      },
      {
        id: "8-2",
        title: "Hypodermic Needle 21G",
        total_emission: 0.203, // temp data
        transportation_emissions: 0.178,
        production_emissions: 0.000309,
        packaging_emissions:  0.0005 * 31.5 * 1.58,
        disposal_emissions:  0.000124,
      },
      {
        id: "8-3",
        title: "Hypodermic Needle 23G",
        total_emission: 0.2, // temp data
        transportation_emissions: 0.178,
        production_emissions: 0.000149,
        packaging_emissions:  0.0005 * 27.5 * 1.58,
        disposal_emissions: 0.000119,
      }
    ]
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
    navigation.navigate("Total", { totalEmission, emissionBreakdown });
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
