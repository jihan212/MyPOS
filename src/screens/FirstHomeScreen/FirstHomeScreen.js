import {
	View,
	Text,
	StyleSheet,
	Image,
	useWindowDimensions,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../../assets/images/logo.png';
import CustomButton from '../../components/CustomButton/CustomButton';

const FirstHomeScreen = () => {
	const navigation = useNavigation();
	const { height } = useWindowDimensions();

	const OnSignInPress = () => {
		navigation.navigate('SignIn');
	};

	// Table data: Array of objects containing member details
	const members = [
		{ id: '20235203035', name: 'Jihan Jashim' },
		{ id: '20235203041', name: 'Monisa Biswas' },
		{ id: '20235203050', name: 'Sabbiruzzaman Noman' },
	];

	return (
		<View style={styles.root}>
			<Image
				source={Logo}
				style={[styles.logo, { height: height * 0.3 }]}
				resizeMode='contain'
			/>
			<Text style={styles.title}>Group Members</Text>

			<View style={styles.table}>
				<View style={styles.tableRow}>
					<Text style={[styles.tableCell, styles.headerCell]}>
						ID
					</Text>
					<Text style={[styles.tableCell, styles.headerCell]}>
						Name
					</Text>
				</View>

				{members.map((member, index) => (
					<View
						key={index}
						style={styles.tableRow}
					>
						<Text style={styles.tableCell}>{member.id}</Text>
						<Text style={styles.tableCell}>{member.name}</Text>
					</View>
				))}
			</View>

			<CustomButton
				text='Go to Sign In'
				onPress={OnSignInPress}
			/>
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
	title: {
		maxWidth: 300,
		height: 50,
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	table: {
		width: '100%',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		overflow: 'hidden',
		marginBottom: 20,
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		borderColor: '#ccc',
	},
	headerCell: {
		fontWeight: 'bold',

		backgroundColor: '#f5f5f5',
	},
	tableCell: {
		flex: 1,
		padding: 4,
		textAlign: 'center',
		fontSize: 12,
	},
});

export default FirstHomeScreen;
