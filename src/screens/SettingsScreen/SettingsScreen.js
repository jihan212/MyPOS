import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { List, Switch, Divider, Button, TextInput, Card, Title, Text } from 'react-native-paper';
import { theme } from '../../constants/theme';
import { resetData } from '../../utils/dataStorage';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [lowStockAlert, setLowStockAlert] = useState(5);
  const [taxRate, setTaxRate] = useState('10');
  const [currency, setCurrency] = useState('USD');
  const [printerEnabled, setPrinterEnabled] = useState(true);

  const handleSave = () => {
    // Implement settings save functionality
  };

  const handleResetData = async () => {
    Alert.alert(
      'Reset Data', 
      'Are you sure you want to reset all data to initial values? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            const success = await resetData();
            if (success) {
              Alert.alert('Success', 'Data has been reset to initial values. Please restart the app.');
            } else {
              Alert.alert('Error', 'Failed to reset data.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.section}>
        <Card.Content>
          <Title>General Settings</Title>
          <List.Item
            title="Push Notifications"
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Title>Business Settings</Title>
          <TextInput
            label="Low Stock Alert Threshold"
            value={lowStockAlert.toString()}
            onChangeText={(value) => setLowStockAlert(parseInt(value) || 0)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Tax Rate (%)"
            value={taxRate}
            onChangeText={setTaxRate}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Currency"
            value={currency}
            onChangeText={setCurrency}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Title>Hardware Settings</Title>
          <List.Item
            title="Receipt Printer"
            right={() => (
              <Switch
                value={printerEnabled}
                onValueChange={setPrinterEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.button}
          >
            Test Printer
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Title>Account Settings</Title>
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.button}
          >
            Change Password
          </Button>
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.button}
          >
            Export Data
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Title>Data Management</Title>
          <Divider style={styles.divider} />
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={handleResetData}
            color={theme.colors.error}
          >
            Reset All Data
          </Button>
          <Text style={styles.warningText}>
            Warning: This will reset all products, categories, customers, and sales data to their initial values.
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
      >
        Save Changes
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  saveButton: {
    marginVertical: 16,
    backgroundColor: theme.colors.primary,
  },
  divider: {
    marginVertical: 12,
  },
  warningText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  }
});

export default SettingsScreen;