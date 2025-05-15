import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import HomeContent from './src/screens/HomeScreen/HomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AboutScreen from './src/screens/AboutScreen/AboutScreen';
import { theme } from './src/constants/theme';
import ProductsScreen from './src/screens/ProductsScreen/ProductsScreen';
import CustomersScreen from './src/screens/CustomersScreen/CustomersScreen';
import SalesScreen from './src/screens/SalesScreen/SalesScreen';
import InvoicesScreen from './src/screens/InvoicesScreen/InvoicesScreen';
import ReportsScreen from './src/screens/ReportsScreen/ReportsScreen';
import SettingsScreen from './src/screens/SettingsScreen/SettingsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen/CategoriesScreen';
import AddEditProduct from './src/screens/ProductsScreen/AddEditProduct';
import AddEditCustomer from './src/screens/CustomersScreen/AddEditCustomer';
import { signOut } from 'firebase/auth';
import LogoutScreen from './src/screens/LogoutScreen/LogoutScreen';
import FirstHomeScreen from './src/screens/FirstHomeScreen/FirstHomeScreen';
import SignInScreen from './src/screens/SignInScreen/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen/SignUpScreen';
import ConfirmEmailScreen from './src/screens/ConfirmEmailScreen/ConfirmEmailScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen/ForgotPasswordScreen';
import NewPasswordScreen from './src/screens/NewPasswordScreen/NewPasswordScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import { initializeData } from './src/utils/dataStorage';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeDrawerNavigator() {
	return (
		<Drawer.Navigator
			initialRouteName='Dashboard'
			screenOptions={({ navigation }) => ({
				headerShown: true,
				headerStyle: {
					backgroundColor: theme.colors.surface,
					elevation: 0,
					shadowOpacity: 0,
				},
				headerTintColor: theme.colors.text,
				drawerStyle: {
					backgroundColor: theme.colors.surface,
					width: 280,
				},
				drawerActiveTintColor: theme.colors.primary,
				drawerInactiveTintColor: theme.colors.textLight,
			})}
		>
			<Drawer.Screen
				name='Dashboard'
				component={HomeContent}
				options={{
					title: 'Dashboard',
					drawerIcon: ({ color }) => (
						<Ionicons
							name='home-outline'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name='Sales'
				component={SalesScreen}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name='cart-outline'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name='Products'
				component={ProductsScreen}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name='cube-outline'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name='Categories'
				component={CategoriesScreen}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name='pricetag-outline'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name='Customers'
				component={CustomersScreen}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name='people-outline'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name='Invoices'
				component={InvoicesScreen}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name='receipt-outline'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name='Reports'
				component={ReportsScreen}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name='bar-chart-outline'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			{/* <Drawer.Screen
				name='Settings'
				component={SettingsScreen}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name='settings-outline'
							size={24}
							color={color}
						/>
					),
				}}
			/> */}
			<Drawer.Screen
				name='About'
				component={AboutScreen}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name='information-circle-outline'
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name='Logout'
				component={LogoutScreen}
				options={{
					drawerIcon: ({ color }) => (
						<Ionicons
							name='log-out-outline'
							size={24}
							color={color}
						/>
					),
				}}
				listeners={({ navigation }) => ({
					drawerItemPress: () => {
						signOut(auth)
							.then(() => {
								navigation.getParent().reset({
									index: 0,
									routes: [{ name: 'FirstHome' }],
								});
							})
							.catch((error) => {
								console.error('Logout error:', error);
							});
					},
				})}
			/>
		</Drawer.Navigator>
	);
}

function HomeStackNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name='HomeDrawer'
				component={HomeDrawerNavigator}
			/>
			<Stack.Screen
				name='AddProduct'
				component={AddEditProduct}
			/>
			<Stack.Screen
				name='EditProduct'
				component={AddEditProduct}
			/>
			<Stack.Screen
				name='AddCustomer'
				component={AddEditCustomer}
			/>
			<Stack.Screen
				name='EditCustomer'
				component={AddEditCustomer}
			/>
			<Stack.Screen
				name='Categories'
				component={CategoriesScreen}
			/>
		</Stack.Navigator>
	);
}

function AuthStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
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
		</Stack.Navigator>
	);
}

export default function App() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [dataInitialized, setDataInitialized] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		// Initialize data
		initializeData().then((success) => {
			setDataInitialized(true);
			if (!success) {
				console.warn('Failed to initialize data');
			}
		});

		return unsubscribe;
	}, []);

	if (loading || !dataInitialized) {
		return null; // Or a loading spinner
	}

	return (
		<PaperProvider theme={theme}>
			<NavigationContainer>
				{user ? <HomeStackNavigator /> : <AuthStack />}
			</NavigationContainer>
		</PaperProvider>
	);
}
