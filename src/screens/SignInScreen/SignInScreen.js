import {
	View,
	Text,
	Image,
	StyleSheet,
	useWindowDimensions,
	ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import Logo from '../../../assets/images/logo.png';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';

const SignInScreen = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const { height } = useWindowDimensions();

	const onSignInPressed = () => {
		console.warn('Sign In');
	};

	const OnForgotPasswordPressed = () => {
		console.warn('Forgot Password');
	};

	const OnSignInFacebook = () => {
		console.warn('Sign In With Facebook');
	};
	const OnSignInGoogle = () => {
		console.warn('Sign In With Google');
	};
	const OnSignInApple = () => {
		console.warn('Sign In With Apple');
	};

	const OnSignUpPress = () => {
		console.warn('Sign Up');
	};

	return (
		<ScrollView>
			<View style={styles.root}>
				<Image
					source={Logo}
					style={[styles.logo, { height: height * 0.3 }]}
					resizeMode='contain'
				/>
				<CustomInput
					placeholder='Username'
					value={username}
					setValue={setUsername}
				/>
				<CustomInput
					placeholder='Password'
					value={password}
					setValue={setPassword}
					secureTextEntry
				/>
				<CustomButton
					text='Sign In'
					onPress={onSignInPressed}
				/>
				<CustomButton
					text='Forget Password ?'
					onPress={OnForgotPasswordPressed}
					type='TERTIARY'
				/>
				<CustomButton
					text='Sign In With Facebook'
					onPress={OnSignInFacebook}
					bgColor='#E7EAF4'
					fgColor='#3B5998'
				/>
				<CustomButton
					text='Sign In With Google'
					onPress={OnSignInGoogle}
					bgColor='#FAE9EA'
					fgColor='#DD4D44'
				/>
				<CustomButton
					text='Sign In With Apple'
					onPress={OnSignInApple}
					bgColor='#e3e3e3'
					fgColor='#363636'
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
	root: { alignItems: 'center', padding: 20 },
	logo: {
		width: '75%',
		maxWidth: 300,
		height: 100,
	},
});

export default SignInScreen;
