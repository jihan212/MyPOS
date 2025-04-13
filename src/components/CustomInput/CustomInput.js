import { View, Text, TextInput, StyleSheet } from 'react-native';
import React from 'react';
import { Controller } from 'react-hook-form';

const CustomInput = ({
	control,
	name,
	rules = {},
	placeholder,
	secureTextEntry,
}) => {
	return (
		<Controller
			control={control}
			name={name}
			rules={rules}
			render={({
				field: { value, onChange, onBlur },
				fieldState: { error },
			}) => (
				<>
					<View
						style={[
							styles.container,
							{ borderColor: error ? 'red' : '#e8e8e8' },
						]}
					>
						<TextInput
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
							placeholder={placeholder}
							styles={[styles.input, {}]}
							secureTextEntry={secureTextEntry}
						/>
					</View>
					{error && (
						<Text
							style={{
								color: 'red',
								alignSelf: 'stretch',
								fontSize: 12,
							}}
						>
							{error.message || 'Error'}
						</Text>
					)}
				</>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'White',
		width: '100%',
		borderColor: '#e8e8e8',
		borderWidth: 1,
		borderRadius: 5,
		marginVertical: 5,
	},
	input: {},
});

export default CustomInput;
