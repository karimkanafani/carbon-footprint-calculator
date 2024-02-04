import { useContext } from "react";
import {StyleSheet, Text} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home2, SearchNormal1, Ticket2, Bag, User } from 'iconsax-react-native';

// Screens
import SelectionScreen from '../../pages/SelectionPage';
import AIScreen from '../../pages/AIPage';

// Screen Names
const selectionName = 'Selection';
const AIName = 'AI';

const Tab = createBottomTabNavigator();

const NavBar = () => {

  return (
      <Tab.Navigator
          initialRouteName={selectionName}
  screenOptions={ ({route}) => ({
    tabBarIcon: ({focused, color, size}) => {
      let rn = route.name;

      if (rn === selectionName) {
        if(focused){
          return <Home2 size={size} color={color} variant="Bold"/>
        }else {
          return <Home2 size={size} color={color}/>
        }
      } else if (rn === AIName) {
        if(focused){
          return <SearchNormal1 size={size} color={color} variant="Bold"/>
        }else {
          return <SearchNormal1 size={size} color={color}/>
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