import {
	View,
	Text,
	Image,
	StyleSheet,
	useWindowDimensions,
} from 'react-native';
import React, { useState } from 'react';
import Logo from '../../../assets/images/logo.png';
import CustomInput from '../../components/CustomInput';

const SignInScreen = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const { height } = useWindowDimensions();

	return (
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
		</View>
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
