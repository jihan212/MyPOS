import React, { useEffect } from 'react';
import { View } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigation.reset({
          index: 0,
          routes: [{ name: 'FirstHome' }],
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    handleLogout();
  }, [navigation]);

  return <View />;
};

export default LogoutScreen;