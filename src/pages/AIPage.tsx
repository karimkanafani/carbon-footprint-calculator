import NavBar from "../containers/NavBar";
import React, { useState } from "react";
import {View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const AIPage = () => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = () => {
    console.log("Submitted Text:", inputText);
    setInputText("");
  };
  return (
       <View >
    {/* Your main content goes here */}
    <NavBar />
    
    {/* Text Input and Submit Button */}
    <View >
      <TextInput
        placeholder="Type your message..."
        value={inputText}
        onChangeText={(text) => setInputText(text)}
      />
      <TouchableOpacity onPress={handleSubmit}>
        <Ionicons name="arrow-up-circle" size={30} color="#007bff" />
      </TouchableOpacity>
    </View>
  </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     position: "absolute",
//     bottom: 50, // Adjust the value to position it higher or lower
//     left: 0,
//     right: 0,
//     backgroundColor: "white",
//   },
//   textInput: {
//     flex: 1,
//     borderBottomWidth: 1,
//     borderColor: "#007bff",
//     marginRight: 16,
//   },
//   submitButton: {
//     marginLeft: 16,
//   },
// });

export default AIPage;

