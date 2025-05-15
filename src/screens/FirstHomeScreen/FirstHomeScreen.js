import {
	View,
	StyleSheet,
	Image,
	useWindowDimensions,
	StatusBar,
	SafeAreaView,
	ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, Card, Title, Paragraph, Avatar, useTheme, Divider } from 'react-native-paper';
import Logo from '../../../assets/images/logo.png';

const FirstHomeScreen = () => {
	const navigation = useNavigation();
	const { height } = useWindowDimensions();
	const theme = useTheme();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		// Simple timeout instead of complex animations
		const timer = setTimeout(() => {
			setLoaded(true);
		}, 300);
		return () => clearTimeout(timer);
	}, []);

	const handleSignIn = () => {
		navigation.navigate('SignIn');
	};

	// Team members data - removed role field
	const members = [
		{ 
			id: '20235203035', 
			name: 'Jihan Jashim', 
			avatar: 'JJ',
			color: '#4CAF50'
		},
		{ 
			id: '20235203041', 
			name: 'Monisa Biswas', 
			avatar: 'MB',
			color: '#9C27B0'
		},
		{ 
			id: '20235203044', 
			name: 'MD. Sabbiruzzaman Noman', 
			avatar: 'SN',
			color: '#2196F3'
		},
	];

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
			<ScrollView 
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.logoContainer}>
					<Image
						source={Logo}
						style={[styles.logo, { height: height * 0.25 }]}
						resizeMode='contain'
					/>
					
				</View>
				
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Meet Our Team</Text>
					<Divider style={styles.divider} />
					
					<View style={styles.teamContainer}>
						{members.map((member, index) => (
							<Card key={index} style={styles.memberCard}>
								<Card.Content style={styles.memberCardContent}>
									<Avatar.Text 
										size={60} 
										label={member.avatar} 
										style={[styles.avatar, { backgroundColor: member.color }]}
									/>
									<View style={styles.memberInfo}>
										<Title style={styles.memberName}>{member.name}</Title>
										<Paragraph style={styles.memberId}>ID: {member.id}</Paragraph>
									</View>
								</Card.Content>
							</Card>
						))}
					</View>
				</View>
				
				<View style={styles.buttonContainer}>
					<Button
						mode="contained"
						onPress={handleSignIn}
						style={styles.signInButton}
						contentStyle={styles.buttonContent}
						labelStyle={styles.buttonLabel}
					>
						Get Started
					</Button>
				</View>
				
				<View style={styles.footer}>
					<Text style={styles.footerText}>
						© {new Date().getFullYear()} MyPOS Team
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	scrollContent: {
		flexGrow: 1,
		padding: 20,
		paddingTop: 40,
		alignItems: 'center',
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: 5,
		width: '100%',
	},
	logo: {
		width: '80%',
		marginBottom: 5,
	},
	appName: {
		fontSize: 32,
		fontWeight: 'bold',
		letterSpacing: 2,
		marginBottom: 8,
	},
	appTagline: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
	},
	sectionContainer: {
		width: '100%',
	
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 8,
		alignSelf: 'center',
	},
	divider: {
		height: 2,
		width: 100,
		alignSelf: 'center',
		marginBottom: 10,
	},
	teamContainer: {
		width: '100%',
	},
	memberCard: {
		marginBottom: 16,
		elevation: 3,
		borderRadius: 12,
	},
	memberCardContent: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
	},
	avatar: {
		marginRight: 16,
	},
	memberInfo: {
		flex: 1,
	},
	memberName: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 2,
	},
	memberId: {
		fontSize: 14,
		color: '#666',
	},
	buttonContainer: {
		width: '100%',
		marginTop: 24,
		alignItems: 'center',
	},
	signInButton: {
		borderRadius: 30,
		width: '100%',
		backgroundColor: '#1976D2',
	},
	buttonContent: {
		height: 52,
	},
	buttonLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
	footer: {
		marginTop: 30,
		marginBottom: 10,
	},
	footerText: {
		fontSize: 12,
		color: '#999',
		textAlign: 'center',
	},
});

export default FirstHomeScreen;
