import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Linking, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Avatar, Card, Divider, useTheme, TextInput, Button, Modal, Portal } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

const AboutScreen = () => {
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Developer data from FirstHomeScreen
  const developers = [
    { id: '20235203035', name: 'Jihan Jashim' },
    { id: '20235203041', name: 'Monisa Biswas' },
    { id: '20235203044', name: 'MD. Sabbiruzzaman Noman' },
  ];

  const checkPassword = () => {
    if (password === 'doremon') {
      setVisible(true);
    }
  };

  const hideModal = () => setVisible(false);
  
  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 10) {
      setShowPasswordField(true);
    }
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Reset the state and hide the password field
    setClickCount(0);
    setShowPasswordField(false);
    setPassword('');
    
    // Simulate network delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView 
      style={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
          title="Pull to refresh"
          titleColor={theme.colors.primary}
        />
      }
    >
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <Card style={styles.modalCard}>
            <Card.Content>
              <Text style={styles.modalTitle}>"Jab tak bhai hain tension le ne ka nehi !"</Text>
              <Text style={styles.modalSubtitle}>- Shishir</Text>
            </Card.Content>
            <Card.Actions style={styles.modalActions}>
              <Button mode="contained" onPress={hideModal}>Close</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: theme.colors.primary}]}>About MyPOS</Text>
          <Text style={styles.description}>
            Your Complete Point of Sale Solution for modern businesses
          </Text>
          <Divider style={styles.divider} />
        </View>
        
        <Card style={styles.appInfoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Application Info</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform:</Text>
              <Text style={styles.infoValue}>React Native & Expo</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data Storage:</Text>
              <Text style={styles.infoValue}>AsyncStorage</Text>
            </View>
          </Card.Content>
        </Card>

        <TouchableOpacity onPress={handleTitleClick} activeOpacity={0.7}>
          <Text style={[styles.sectionTitle, {marginTop: 24, marginBottom: 16, paddingVertical: 8}]}>
            Meet My Team 
          </Text>
        </TouchableOpacity>

        {showPasswordField && (
          <Card style={styles.passwordCard}>
            <Card.Content>
              <Text style={styles.passwordTitle}>Enter Secret Password</Text>
              <TextInput
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                style={styles.passwordInput}
                mode="outlined"
                right={<TextInput.Icon icon="key" />}
              />
              <Button 
                mode="contained" 
                onPress={checkPassword}
                style={styles.passwordButton}
              >
                Verify
              </Button>
            </Card.Content>
          </Card>
        )}
        
        {developers.map((developer, index) => (
          <Card key={index} style={styles.developerCard}>
            <Card.Content style={styles.cardContent}>
              <Avatar.Text 
                size={60} 
                label={developer.name.split(' ').map(n => n[0]).join('')} 
                backgroundColor={theme.colors.primary}
                color={theme.colors.surface}
              />
              <View style={styles.developerInfo}>
                <Text style={styles.developerName}>{developer.name}</Text>
                <Text style={styles.developerId}>ID: {developer.id}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
        
        <Card style={[styles.appInfoCard, {marginTop: 24}]}>
          <Card.Content>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} MyPOS Team. All rights reserved.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
    color: '#666',
  },
  divider: {
    width: '80%',
    height: 1,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  appInfoCard: {
    width: '100%',
    elevation: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  infoLabel: {
    flex: 1,
    fontWeight: 'bold',
    color: '#555',
  },
  infoValue: {
    flex: 2,
    color: '#333',
  },
  developerCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  developerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  developerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  developerId: {
    fontSize: 14,
    color: '#666',
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
  },
  passwordCard: {
    marginTop: 0,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#f8f8ff',
  },
  passwordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  passwordInput: {
    marginBottom: 16,
  },
  passwordButton: {
    alignSelf: 'flex-end',
  },
  modalContainer: {
    padding: 20,
  },
  modalCard: {
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
  },
  modalActions: {
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default AboutScreen;