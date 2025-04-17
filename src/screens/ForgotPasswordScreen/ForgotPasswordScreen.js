import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordScreen = () => {
	const { control, handleSubmit } = useForm();
	const navigation = useNavigation();

	const onSendPressed = async (data) => {
		const email = data.email;

		try {
			await sendPasswordResetEmail(auth, email);
			Alert.alert('Success', 'Password reset link sent to your email');
			navigation.navigate('SignIn');
		} catch (error) {
			console.log(error);
			Alert.alert('Error', error.message);
		}
	};

	const onSignInPress = () => {
		navigation.navigate('SignIn');
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.root}>
				<Text style={styles.title}>Reset Your Password</Text>

				<CustomInput
					placeholder='Email'
					name='email'
					control={control}
					rules={{
						required: 'Email is required',
						pattern: {
							value: EMAIL_REGEX,
							message: 'Email is invalid',
						},
					}}
				/>

				<CustomButton
					text='Send Reset Link'
					onPress={handleSubmit(onSendPressed)}
				/>

				<CustomButton
					text='Back to Sign In'
					onPress={onSignInPress}
					type='TERTIARY'
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	root: { alignItems: 'center', padding: 50 },
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

export default ForgotPasswordScreen;
