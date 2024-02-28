import {useContext} from "react";
import {StyleSheet, Text} from "react-native";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home2, SearchNormal1, Information, Save2} from 'iconsax-react-native';

// Screens
import SelectionScreen from '../../pages/SelectionPage';
import AIScreen from '../../pages/AIPage';
import InfoScreen from '../../pages/InfoPage';
import HistoryPage from '../../pages/HistoryPage';

// Screen Names
const selectionName = 'Selection';
const AIName = 'AI';
const InfoName = "Info";
const HistoryName = "History";

const Tab = createBottomTabNavigator();

const NavBar = () => {

  return (
      <Tab.Navigator
          initialRouteName={selectionName}
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let rn = route.name;

              if (rn === selectionName) {
                if (focused) {
                  return <Home2 size={size} color={color} variant="Bold"/>
                } else {
                  return <Home2 size={size} color={color}/>
                }
              } else if (rn === AIName) {
                if (focused) {
                  return <SearchNormal1 size={size} color={color} variant="Bold"/>
                } else {
                  return <SearchNormal1 size={size} color={color}/>
                }
              } else if (rn === InfoName) {
                if (focused) {
                  return <Information size={size} color={color} variant="Bold"/>
                } else {
                  return <Information size={size} color={color}/>
                }
              } else if (rn === HistoryName) {
                if (focused) {
                  return <Save2 size={size} color={color} variant="Bold"/>
                } else {
                  return <Save2 size={size} color={color} />
                }
              }
            },
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#2196F3",
            tabBarInactiveTintColor: "#000",
            tabBarStyle: styles.tabBarStyle,
          })}>
        <Tab.Screen name={selectionName} component={SelectionScreen}/>
        <Tab.Screen name={AIName} component={AIScreen}/>
        <Tab.Screen name={InfoName} component={InfoScreen}/>
        <Tab.Screen name={HistoryName} component={HistoryPage}/>
      </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    opacity: 0.6,
    // backgroundColor: theme.colors.background,
    // borderTopColor: theme.colors.foreground,
    borderTopWidth: 1
  },
  // colorsPal: theme.colors,
  // activeColor: theme.colors.primary,
  // inactiveColor: theme.colors.secondary,

})

export default NavBar;