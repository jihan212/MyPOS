// Add this import at the top with other imports
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ConfirmEmailScreen from './src/screens/ConfirmEmailScreen/ConfirmEmailScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen/ForgotPasswordScreen';
import NewPasswordScreen from './src/screens/NewPasswordScreen/NewPasswordScreen';
import HomeContent from './src/screens/HomeScreen/HomeScreen';
import FirstHomeScreen from './src/screens/FirstHomeScreen/FirstHomeScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AboutScreen from './src/screens/AboutScreen/AboutScreen';
import ProfileScreen from './src/screens/ProfileScreen/ProfileScreen';
import { theme } from './src/constants/theme';
import { useNavigation } from '@react-navigation/native';  // Add this import at the top

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeDrawerNavigator() {
  return (
    <Drawer.Navigator 
      initialRouteName="Dashboard"
      screenOptions={({navigation}) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerRight: () => (
          <Ionicons 
            name="person-circle-outline" 
            size={32} 
            color={theme.colors.primary}
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate('Profile')}
          />
        ),
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: 280,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textLight
      })}
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
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="information-circle-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function HomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeDrawer" component={HomeDrawerNavigator} />
        </Stack.Navigator>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size='large'
                    color='#0000ff'
                />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen
                        name='Home'
                        component={HomeStackNavigator}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name='FirstHome'
                            component={FirstHomeScreen}
                        />
                        <Stack.Screen
                            name='SignIn'
                            component={SignInScreen}
                        />
                        <Stack.Screen
                            name='SignUp'
                            component={SignUpScreen}
                        />
                        <Stack.Screen
                            name='ConfirmEmail'
                            component={ConfirmEmailScreen}
                        />
                        <Stack.Screen
                            name='ForgotPassword'
                            component={ForgotPasswordScreen}
                        />
                        <Stack.Screen
                            name='NewPassword'
                            component={NewPasswordScreen}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
