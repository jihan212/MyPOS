import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ConfirmEmailScreen from './src/screens/ConfirmEmailScreen/ConfirmEmailScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen/ForgotPasswordScreen';
import NewPasswordScreen from './src/screens/NewPasswordScreen/NewPasswordScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import Navigation from './src/navigation';
import FirstHomeScreen from './src/screens/FirstHomeScreen/FirstHomeScreen';

const Stack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName='FirstHome'
				screenOptions={{ headerShown: false }}
			>
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
				<Stack.Screen
					name='Home'
					component={HomeScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F9FBFC',
	},
});
