import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

const NewPasswordScreen = () => {
	const { control, handleSubmit } = useForm();

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
					name='code'
					control={control}
					rules={{
						required: 'Code is required',
					}}
				/>
				<CustomInput
					placeholder='Enter Your New Password'
					name='password'
					control={control}
					rules={{
						required: 'Password is required',
						minLength: {
							value: 5,
							message:
								'Password should be minimum 5 characters long',
						},
					}}
					secureTextEntry
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
		marginVertical: 50,
	},
	text: {
		color: 'gray',
		marginVertical: 5,
	},
	link: { color: '#FDB075' },
});

export default NewPasswordScreen;
