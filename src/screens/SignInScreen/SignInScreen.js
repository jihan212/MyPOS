import {
	View,
	Image,
	StyleSheet,
	useWindowDimensions,
	ScrollView,
	Alert,
	Text,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
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

	const { control, handleSubmit, setValue } = useForm();

	const demoCredentials = {
		email: 'user1@mail.com',
		password: 'user123'
	};

	const onDemoLoginPress = () => {
		setValue('email', demoCredentials.email);
		setValue('password', demoCredentials.password);
		handleSubmit(onSignInPressed)();
	};

	const [isLoading, setIsLoading] = useState(false);

	const onSignInPressed = async (data) => {
		const { email, password } = data;
		setIsLoading(true);

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			console.log('Signed in as:', user.email);

			setTimeout(() => {
				navigation.navigate('Home');
			}, 100);
		} catch (error) {
			console.error('Login error:', error);
			Alert.alert('Login Error', error.message);
		} finally {
			setIsLoading(false);
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
					text={isLoading ? 'Loading' : 'Sign In'}
					onPress={handleSubmit(onSignInPressed)}
					disabled={isLoading}

				>
					{isLoading && (
						<ActivityIndicator 
							color="white" 
							size="small"
							style={{ marginLeft: 10 }}
						/>
					)}
				</CustomButton>

				{/* Demo Login Section */}
				<View style={styles.demoContainer}>
					<Text style={styles.demoTitle}>Demo Login</Text>
					<TouchableOpacity 
						style={styles.demoCredentials}
						onPress={onDemoLoginPress}
					>
						<Text style={styles.demoText}>Email: {demoCredentials.email}</Text>
						<Text style={styles.demoText}>Password: {demoCredentials.password}</Text>
					</TouchableOpacity>
				</View>

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
	demoContainer: {
		marginVertical: 20,
		padding: 15,
		backgroundColor: '#f5f5f5',
		borderRadius: 10,
		width: '100%',
		alignItems: 'center',
	},
	demoTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333',
	},
	demoCredentials: {
		padding: 10,
		backgroundColor: '#fff',
		borderRadius: 5,
		width: '100%',
		alignItems: 'center',
	},
	demoText: {
		fontSize: 14,
		color: '#666',
		marginVertical: 2,
	},
	loader: {
		position: 'absolute',
	},
});

export default SignInScreen;
