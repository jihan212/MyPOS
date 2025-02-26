import {
	View,
	Text,
	StyleSheet,
	Image,
	useWindowDimensions,
} from 'react-native';
import React from 'react';
import Logo from '../../../assets/images/logo.png';

const HomeScreen = () => {
	const { height } = useWindowDimensions();
	return (
		<View style={styles.root}>
			<Image
				source={Logo}
				style={[styles.logo, { height: height * 0.3 }]}
				resizeMode='contain'
			/>
			<Text style={styles.text}>Welcome to Homepage !</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	root: {
		alignItems: 'center',
		padding: 50,
		paddingTop: 20,
		marginTop: 50,
		justifyContent: 'center',
	},
	text: {
		maxWidth: 300,
		height: 100,
		fontSize: 24,
	},
});
export default HomeScreen;
