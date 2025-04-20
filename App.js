import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ConfirmEmailScreen from './src/screens/ConfirmEmailScreen/ConfirmEmailScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen/ForgotPasswordScreen';
import NewPasswordScreen from './src/screens/NewPasswordScreen/NewPasswordScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import FirstHomeScreen from './src/screens/FirstHomeScreen/FirstHomeScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeDrawer" component={HomeScreen} />
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
