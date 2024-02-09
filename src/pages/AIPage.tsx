import NavBar from "../containers/NavBar";
import React, {useState} from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LinearGradient} from "expo-linear-gradient";

const AIPage = () => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = () => {
    console.log("Submitted Text:", inputText);
    setInputText("");
  };
  return (
      <LinearGradient colors={["lightblue", "white"]} style={styles.container}>
        <View style={styles.container}>
          {/* Your main content goes here */}

          {/* Text Input and Submit Button */}
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                                style={styles.inputContainer}>
            <TextInput
                placeholder="Type your message..."
                value={inputText}
                onChangeText={(text) => setInputText(text)}
            />
            <TouchableOpacity onPress={handleSubmit}>
              <Ionicons name="arrow-up-circle" size={30} color="#007bff"/>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 90,
    marginLeft: 15,
    marginRight: 15,
  }
});

export default AIPage;

