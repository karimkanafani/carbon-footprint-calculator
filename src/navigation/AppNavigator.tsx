import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SelectionPage from "../pages/SelectionPage";
import TotalPage from "../pages/TotalPage";
import NavBar from "../containers/NavBar";
import InfoPage from "../pages/InfoPage";
import HistoryPage from "../pages/HistoryPage";

const Stack = createStackNavigator();

const navigationOptions = () => {
  return {
    headerTitle: "",
    headerTransparent: true,
    // headerLeft: () => {
    //   return <HeaderBack onPress={() => navigation.goBack()} paddingTop={darkTheme.spacing.s} />
    // }
  }
}

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={navigationOptions}>
      <Stack.Screen
          name="NavBar"
          component={NavBar}
      />
      <Stack.Screen
        name="Selection"
        component={SelectionPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Total"
        component={TotalPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
          name="Info"
          component={InfoPage}
          options={{ headerShown: false }}
      />
      <Stack.Screen
          name="History"
          component={HistoryPage}
          options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
