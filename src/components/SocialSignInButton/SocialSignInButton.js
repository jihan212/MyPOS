import { View, Text } from 'react-native';
import React from 'react';
import CustomButton from '../CustomButton/CustomButton';

const SocialSignInButton = () => {
	const OnSignInFacebook = () => {
		console.warn('Sign In With Facebook');
	};
	const OnSignInGoogle = () => {
		console.warn('Sign In With Google');
	};
	const OnSignInApple = () => {
		console.warn('Sign In With Apple');
	};

	return (
		<>
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
		</>
	);
};

export default SocialSignInButton;
