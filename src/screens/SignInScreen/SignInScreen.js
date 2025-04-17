import {
	View,
	Image,
	StyleSheet,
	useWindowDimensions,
	ScrollView,
	Alert,
} from 'react-native';
import React from 'react';
import Logo from '../../../assets/images/logo.png';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';

const SignInScreen = () => {
	const { height } = useWindowDimensions();
	const navigation = useNavigation();

	const { control, handleSubmit } = useForm();

	const onSignInPressed = async (data) => {
		const { email, password } = data;

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			console.log('Signed in as:', user.email);

			// Navigate to Home screen after successful login
			setTimeout(() => {
				navigation.navigate('Home');
			}, 100); // 100ms delay
		} catch (error) {
			console.error('Login error:', error);
			Alert.alert('Login Error', error.message);
		}
	};

	const OnForgotPasswordPressed = () => {
		navigation.navigate('ForgotPassword');
	};

	const OnSignUpPress = () => {
		navigation.navigate('SignUp');
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.root}>
				<Image
					source={Logo}
					style={[styles.logo, { height: height * 0.3 }]}
					resizeMode='contain'
				/>
				<CustomInput
					placeholder='Email'
					name='email'
					control={control}
					rules={{
						required: 'Email is required',
					}}
				/>
				<CustomInput
					placeholder='Password'
					name='password'
					control={control}
					rules={{
						required: 'Password is required',
						minLength: {
							value: 3,
							message:
								'Password should be minimum 3 characters long',
						},
					}}
					secureTextEntry
				/>

				<CustomButton
					text='Sign In'
					onPress={handleSubmit(onSignInPressed)}
				/>
				<CustomButton
					text='Forgot Password?'
					onPress={OnForgotPasswordPressed}
					type='TERTIARY'
				/>

				<CustomButton
					text='Don’t have an account? Sign Up'
					onPress={OnSignUpPress}
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
});

export default SignInScreen;
