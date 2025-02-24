import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';

const NewPasswordScreen = () => {
	const [code, setCode] = useState('');
	const [newPassword, setNewPassword] = useState('');

	const navigation = useNavigation();

	const onSubmitPressed = () => {
		console.warn('ConfirmEmail');
	};

	const OnSignInPress = () => {
		navigation.navigate('SignIn');
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.root}>
				<Text style={styles.title}>Reset Your Password </Text>
				<CustomInput
					placeholder='Code'
					value={code}
					setValue={setCode}
				/>
				<CustomInput
					placeholder='Enter Your New Password'
					value={newPassword}
					setValue={setNewPassword}
				/>

				<CustomButton
					text='Submit'
					onPress={onSubmitPressed}
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
	root: { alignItems: 'center', padding: 20 },
	logo: {
		width: '75%',
		maxWidth: 300,
		height: 100,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#051C60',
		marginVertical: 50,
	},
	text: {
		color: 'gray',
		marginVertical: 5,
	},
	link: { color: '#FDB075' },
});

export default NewPasswordScreen;
