import {
	View,
	Text,
	StyleSheet,
	Image,
	useWindowDimensions,
} from 'react-native';
import React from 'react';
import Logo from '../../../assets/images/logo.png';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AboutScreen from '../AboutScreen/AboutScreen';
import { Ionicons } from '@expo/vector-icons';
import ContactUsScreen from '../ContactUs/ContactUsScreen';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { Alert } from 'react-native';

const Drawer = createDrawerNavigator();

const HomeContent = () => {
	const { height } = useWindowDimensions();
	return (
		<View style={styles.root}>
			<Image
				source={Logo}
				style={[styles.logo, { height: height * 0.3 }]}
				resizeMode='contain'
			/>
			<Text style={styles.text}>Welcome to Homepage !</Text>
		</View>
	);
};

const HomeScreen = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Navigation will be handled automatically by App.js auth state listener
        } catch (error) {
            Alert.alert('Logout Error', error.message);
        }
    };

    return (
        <Drawer.Navigator
            screenOptions={({ navigation }) => ({
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#000',
                headerLeft: () => (
                    <Ionicons
                        name="menu"
                        size={24}
                        style={{ marginLeft: 10 }}
                        onPress={() => navigation.toggleDrawer()}
                    />
                ),
            })}
        >
            <Drawer.Screen 
                name="Dashboard" 
                component={HomeContent}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen 
                name="About" 
                component={AboutScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="information-circle" size={size} color={color} />
                    ),
                }}
            />
			<Drawer.Screen 
                name="Contact Us" 
                component={ContactUsScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="information-circle" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen 
                name="Logout"
                component={EmptyComponent}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="log-out" size={size} color={color} />
                    ),
                }}
                listeners={({ navigation }) => ({
                    drawerItemPress: (e) => {
                        e.preventDefault();
                        Alert.alert(
                            'Logout',
                            'Are you sure you want to logout?',
                            [
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                },
                                {
                                    text: 'OK',
                                    onPress: handleLogout,
                                },
                            ]
                        );
                    },
                })}
            />
        </Drawer.Navigator>
    );
};

// Empty component for logout option
const EmptyComponent = () => null;

const styles = StyleSheet.create({
	root: {
		alignItems: 'center',
		padding: 50,
		paddingTop: 20,
		marginTop: 50,
		justifyContent: 'center',
	},
	text: {
		maxWidth: 300,
		height: 100,
		fontSize: 24,
	},
	logo: {
		width: '75%',
		maxWidth: 300,
		height: 100,
	},
});

export default HomeScreen;
