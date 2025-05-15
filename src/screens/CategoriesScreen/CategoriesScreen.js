import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  TextInput, 
  FAB, 
  Dialog, 
  Portal, 
  IconButton,
  Searchbar,
  Text,
  Divider,
  ActivityIndicator
} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getData, saveData, STORAGE_KEYS } from '../../utils/dataStorage';
import { theme } from '../../constants/theme';

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#5b68ff'
  });
  const isFocused = useIsFocused();

  // Available colors for categories
  const colorOptions = [
    '#5b68ff', // Blue
    '#ff9f43', // Orange
    '#10ac84', // Green
    '#8854d0', // Purple
    '#ee5253', // Red
    '#00d2d3', // Teal
    '#5f27cd', // Indigo
    '#ff6b6b'  // Pink
  ];

  useEffect(() => {
    if (isFocused) {
      loadCategories();
    }
  }, [isFocused]);

  useEffect(() => {
    filterCategories();
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getData(STORAGE_KEYS.CATEGORIES);
      if (Array.isArray(data)) {
        setCategories(data);
        setFilteredCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }

    try {
      const newId = Date.now().toString();
      const updatedCategories = [
        ...categories,
        {
          ...newCategory,
          id: newId
        }
      ];

      await saveData(STORAGE_KEYS.CATEGORIES, updatedCategories);
      setCategories(updatedCategories);
      setDialogVisible(false);
      setNewCategory({
        name: '',
        description: '',
        color: '#5b68ff'
      });
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Error', 'Failed to add category.');
    }
  };

  const handleEditCategory = async () => {
    if (!currentCategory.name.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }

    try {
      const updatedCategories = categories.map(cat => 
        cat.id === currentCategory.id ? currentCategory : cat
      );

      await saveData(STORAGE_KEYS.CATEGORIES, updatedCategories);
      setCategories(updatedCategories);
      setEditDialogVisible(false);
    } catch (error) {
      console.error('Error updating category:', error);
      Alert.alert('Error', 'Failed to update category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Load products to check if category is in use
              const products = await getData(STORAGE_KEYS.PRODUCTS);
              if (Array.isArray(products) && products.some(product => product.category === id)) {
                Alert.alert(
                  'Cannot Delete',
                  'This category is in use by products. Please reassign those products first.'
                );
                return;
              }

              const updatedCategories = categories.filter(cat => cat.id !== id);
              await saveData(STORAGE_KEYS.CATEGORIES, updatedCategories);
              setCategories(updatedCategories);
            } catch (error) {
              console.error('Error deleting category:', error);
              Alert.alert('Error', 'Failed to delete category.');
            }
          }
        }
      ]
    );
  };

  const openEditDialog = (category) => {
    setCurrentCategory(category);
    setEditDialogVisible(true);
  };

  const renderCategoryItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
          <View style={styles.cardTitleContainer}>
            <Title style={styles.cardTitle}>{item.name}</Title>
          </View>
          <View style={styles.actionButtons}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => openEditDialog(item)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteCategory(item.id)}
            />
          </View>
        </View>
        <Divider style={styles.divider} />
        <Paragraph style={styles.description}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  const renderColorOption = (color, selectedColor, onSelect) => (
    <TouchableOpacity
      key={color}
      style={[
        styles.colorOption,
        { backgroundColor: color },
        selectedColor === color && styles.colorOptionSelected
      ]}
      onPress={() => onSelect(color)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search categories..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                {searchQuery.trim() ? 'No matching categories found' : 'No categories added yet'}
              </Text>
            </Card.Content>
          </Card>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setDialogVisible(true)}
        color="white"
      />

      {/* Add Category Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Add New Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name *"
              value={newCategory.name}
              onChangeText={text => setNewCategory({...newCategory, name: text})}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={newCategory.description}
              onChangeText={text => setNewCategory({...newCategory, description: text})}
              style={styles.input}
            />
            
            <Text style={styles.colorLabel}>Select Color:</Text>
            <View style={styles.colorContainer}>
              {colorOptions.map(color => 
                renderColorOption(color, newCategory.color, (selectedColor) => 
                  setNewCategory({...newCategory, color: selectedColor})
                )
              )}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddCategory}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Edit Category Dialog */}
      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Edit Category</Dialog.Title>
          <Dialog.Content>
            {currentCategory && (
              <>
                <TextInput
                  label="Category Name *"
                  value={currentCategory.name}
                  onChangeText={text => setCurrentCategory({...currentCategory, name: text})}
                  style={styles.input}
                />
                <TextInput
                  label="Description"
                  value={currentCategory.description}
                  onChangeText={text => setCurrentCategory({...currentCategory, description: text})}
                  style={styles.input}
                />
                
                <Text style={styles.colorLabel}>Select Color:</Text>
                <View style={styles.colorContainer}>
                  {colorOptions.map(color => 
                    renderColorOption(color, currentCategory.color, (selectedColor) => 
                      setCurrentCategory({...currentCategory, color: selectedColor})
                    )
                  )}
                </View>
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleEditCategory}>Update</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 8,
    color: theme.colors.placeholder,
  },
  divider: {
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  input: {
    marginBottom: 16,
  },
  colorLabel: {
    marginTop: 8,
    marginBottom: 8,
    color: theme.colors.placeholder,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 6,
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: 'black',
  },
  emptyCard: {
    padding: 16,
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.placeholder,
    fontStyle: 'italic',
  },
});

export default CategoriesScreen; 