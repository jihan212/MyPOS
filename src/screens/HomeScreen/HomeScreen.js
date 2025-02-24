import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const HomeScreen = () => {
	return (
		<View style={styles.root}>
			<Text>Home Sweet Home !</Text>
		</View>
	);
};
const styles = StyleSheet.create({
	root: {
		alignItems: 'center',
		paddingTop: 20,
		marginTop: 50,
		justifyContent: 'center',
	},
	logo: {
		width: '75%',
		maxWidth: 300,
		height: 100,
	},
});
export default HomeScreen;
