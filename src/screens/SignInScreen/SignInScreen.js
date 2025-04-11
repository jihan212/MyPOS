import {
	View,
	Text,
	Image,
	StyleSheet,
	useWindowDimensions,
	ScrollView,
	TextInput,
} from 'react-native';
import React, { useState } from 'react';
import Logo from '../../../assets/images/logo.png';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import SocialSignInButton from '../../components/SocialSignInButton/SocialSignInButton';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

const SignInScreen = () => {
	// const [username, setUsername] = useState('');
	// const [password, setPassword] = useState('');

	const { height } = useWindowDimensions();
	const navigation = useNavigation();

	const { control, handleSubmit } = useForm();

	const onSignInPressed = (data) => {
		console.log(data);
		// Validate user

		navigation.navigate('Home');
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
					placeholder='Username'
					name='username'
					control={control}
				/>
				<CustomInput
					placeholder='Password'
					name='password'
					control={control}
					secureTextEntry
				/>

				<CustomButton
					text='Sign In'
					onPress={handleSubmit(onSignInPressed)}
				/>
				<CustomButton
					text='Forget Password ?'
					onPress={OnForgotPasswordPressed}
					type='TERTIARY'
				/>
				{/* <SocialSignInButton /> */}
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
