import {
	View,
	Text,
	StyleSheet,
	Image,
	useWindowDimensions,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../../assets/images/logo.png';
import CustomButton from '../../components/CustomButton/CustomButton';

const FirstHomeScreen = () => {
	const navigation = useNavigation();
	const { height } = useWindowDimensions();

	const OnSignInPress = () => {
		navigation.navigate('SignIn');
	};

	return (
		<View style={styles.root}>
			<Image
				source={Logo}
				style={[styles.logo, { height: height * 0.3 }]}
				resizeMode='contain'
			/>
			<Text style={styles.title}>Group Members</Text>
			<Text style={styles.text}>Jihan Jashim</Text>
			<CustomButton
				text='Go to Sign In'
				onPress={OnSignInPress}
			/>
		</View>
	);
};
const styles = StyleSheet.create({
	root: {
		alignItems: 'center',
		padding: 50,
		paddingTop: 20,
		marginTop: 50,
		justifyContent: 'center',
	},
	title: {
		maxWidth: 300,
		height: 50,
		fontSize: 24,
		fontWeight: 'bold',
	},
	text: {
		maxWidth: 300,
		height: 100,
		fontSize: 20,
	},
});

export default FirstHomeScreen;
