import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { theme } from '../constants/theme';
import { screenOptions } from './screenOptions';
import HomeContent from '../screens/HomeScreen/HomeScreen';
import AboutScreen from '../screens/AboutScreen/AboutScreen';

const Drawer = createDrawerNavigator();

export const HomeDrawerNavigator = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="Dashboard"
      screenOptions={screenOptions}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={HomeContent}
        options={{
          title: 'Dashboard',
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      {/* Other drawer screens */}
    </Drawer.Navigator>
  );
};