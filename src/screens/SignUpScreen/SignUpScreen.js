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
import SocialSignInButton from '../../components/SocialSignInButton/SocialSignInButton';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');

	const navigation = useNavigation();

	const onRegisterPressed = () => {
		navigation.navigate('ConfirmEmail');
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
					value={username}
					setValue={setUsername}
				/>
				<CustomInput
					placeholder='Email'
					value={email}
					setValue={setEmail}
				/>
				<CustomInput
					placeholder='Password'
					value={password}
					setValue={setPassword}
					secureTextEntry
				/>
				<CustomInput
					placeholder='Repeat Password'
					value={passwordRepeat}
					setValue={setPasswordRepeat}
					secureTextEntry
				/>
				<CustomButton
					text='Register'
					onPress={onRegisterPressed}
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
