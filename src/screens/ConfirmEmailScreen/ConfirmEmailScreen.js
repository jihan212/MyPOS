import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';

const ConfirmEmailScreen = () => {
	const [username, setUsername] = useState('');
	const [code, setCode] = useState('');

	const navigation = useNavigation();

	const onConfirmPressed = () => {
		navigation.navigate('SignIn');
	};

	const OnResendPressed = () => {
		console.warn('OnResendPressed');
	};

	const OnSignInPress = () => {
		navigation.navigate('SignIn');
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.root}>
				<Text style={styles.title}>Confirm Your Email</Text>
				<CustomInput
					placeholder='Username'
					value={username}
					setValue={setUsername}
				/>
				<CustomInput
					placeholder='Enter Your Confirmation Code'
					value={code}
					setValue={setCode}
				/>

				<CustomButton
					text='Confirm'
					onPress={onConfirmPressed}
				/>
				<CustomButton
					text='Resent code'
					onPress={OnResendPressed}
					type='SECONDARY'
				/>
				<CustomButton
					text='Back to Sign In'
					onPress={OnSignInPress}
					type='TERTIARY'
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	root: { alignItems: 'center', padding: 50 },
	logo: {
		width: '75%',
		maxWidth: 300,
		height: 100,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#051C60',
		margin: 50,
	},
	text: {
		color: 'gray',
		marginVertical: 5,
	},
	link: { color: '#FDB075' },
});

export default ConfirmEmailScreen;
