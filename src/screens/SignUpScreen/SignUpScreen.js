import {
	View,
	Text,
	Image,
	StyleSheet,
	useWindowDimensions,
	ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const SignUpScreen = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();

	const pwd = watch('password'); // Watch password field
	// console.log(errors);

	const navigation = useNavigation();

	const onRegisterPressed = (data) => {
		console.log(data);

		// Validate user

		navigation.navigate('SignIn');
	};

	const OnSignInPress = () => {
		navigation.navigate('SignIn');
	};

	const OnTermOfUsePressed = () => {
		console.warn('Terms of Use');
	};

	const OnPrivacyPolicyPressed = () => {
		console.warn('Privacy Policy');
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.root}>
				<Text style={styles.title}>Create an account</Text>
				<CustomInput
					placeholder='Username'
					name='username'
					control={control}
					rules={{
						required: 'Username is required',
						minLength: {
							value: 3,
							message:
								'Username should be minimum 3 characters long',
						},
						maxLength: {
							value: 24,
							message:
								'Username should be maximum 24 characters long',
						},
					}}
				/>
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
				<CustomInput
					placeholder='Password'
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
				<CustomInput
					placeholder='Repeat Password'
					name='password-repeat'
					control={control}
					rules={{
						validate: (value) =>
							value === pwd || 'Passwords do not match',
						required: 'Repeat Password is required',
					}}
					secureTextEntry
				/>
				<CustomButton
					text='Register'
					onPress={handleSubmit(onRegisterPressed)}
				/>
				<Text style={styles.text}>
					By Registration, you confirm that you accept our{' '}
					<Text
						style={styles.link}
						onPress={OnTermOfUsePressed}
					>
						Terms of Use
					</Text>{' '}
					and{' '}
					<Text
						style={styles.link}
						onPress={OnPrivacyPolicyPressed}
					>
						Privacy Policy
					</Text>
				</Text>

				{/* <SocialSignInButton /> */}

				<CustomButton
					text='Have an account? Sign In'
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
		marginTop: 70,
		marginBottom: 50,
		marginHorizontal: 20,
	},
	text: {
		color: 'gray',
		marginVertical: 15,
	},
	link: { color: '#FDB075' },
});

export default SignUpScreen;
