import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, Modal, Dimensions } from "react-native";
import { ItemData } from "../types/ItemTypes";

type SelectedItem = {
    count: number;
    item: ItemData;
};

const { width, height } = Dimensions.get('window');

const MultiSizeMedicalItem = ({ picture, title, items, selectedItems, setSelectedItems }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMultiSizeItem, setSelectedMultiSizeItem] = useState<
        Record<string, SelectedItem | undefined>
    >({});
    const [isItemSelected, setIsItemSelected] = useState(false);

    useEffect(() => {
        if (Object.keys(selectedItems).length === 0) {
            setSelectedMultiSizeItem({});
            setIsItemSelected(false);
        }
    }, [selectedItems]);

    const handleSelect = (id: string, count: number) => {
        if (selectedMultiSizeItem[id]) {
            setSelectedMultiSizeItem({
                ...selectedMultiSizeItem,
                [id]: {
                    count: selectedMultiSizeItem[id].count + count > 0 ? selectedMultiSizeItem[id].count + count : 0,
                    item: selectedMultiSizeItem[id].item,
                },
            });
        } else {
            setSelectedMultiSizeItem({
                ...selectedMultiSizeItem,
                [id]: {
                    count: count > 0 ? count : 0,
                    item: items.find((item) => item.id === id) as ItemData,
                },
            });
        }
    }

    return (
        <View style={styles.container}>
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
                            {items.map((item) => (
                                <View style={styles.itemOptionRow} key={item.id}>
                                    <Text>{item.title}</Text>
                                    <View style={styles.countContainer}>
                                        <TouchableOpacity onPress={() => {
                                            handleSelect(item.id, -1)
                                        }}>
                                            <Text style={styles.button}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.countText}>{selectedMultiSizeItem[item.id] ? selectedMultiSizeItem[item.id].count : 0}</Text>
                                        <TouchableOpacity onPress={() => {
                                            handleSelect(item.id, 1)
                                        }}>
                                            <Text style={styles.button}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedItems({
                                    ...selectedItems,
                                    ...selectedMultiSizeItem,
                                });
                                setModalVisible(false)
                                setIsItemSelected(Object.keys(selectedMultiSizeItem).some((id) => selectedMultiSizeItem[id]?.count > 0));
                            }}
                            style={styles.confirmButton}
                        >
                            <Text>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={[styles.item, isItemSelected ? styles.selectedItem : {}]}
            >
                <Image source={picture} style={styles.imageStyle} />
                <Text style={styles.itemText} numberOfLines={2}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 150,
        marginHorizontal: 8,
        marginBottom: 10
    },
    item: {
        padding: 10,
        marginVertical: 8,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        height: 130
    },
    selectedItem: {
        backgroundColor: "#74ca74",    
    },
    itemText: {
        color: "black",
        alignSelf: "center",
        fontSize: 13,
        textAlign: "center"
    },
    imageStyle: {
        width: 80,
        height: 80,
        resizeMode: "contain",
        alignSelf: "center"
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
    confirmButton: {
        marginTop: 20,
        backgroundColor: "#2196F3",
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    itemOptionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    countText: {
        alignSelf: "center",
        color: "black",
        fontWeight: "bold",
        marginRight: 10,
        marginLeft: 10,
    },
    countContainer: {
        flexDirection: "row",
    },
    button: {
        color: "black",
        paddingRight: 10,
        paddingLeft: 10,
        fontSize: 20,
        fontWeight: "bold",
        overflow: "hidden",
        backgroundColor: "#74ca74",
        borderRadius: 8,
    },
});

export default MultiSizeMedicalItem;
