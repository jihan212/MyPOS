import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  PRODUCTS: '@mypos_products',
  CUSTOMERS: '@mypos_customers',
  SALES: '@mypos_sales',
  INVOICES: '@mypos_invoices',
  CATEGORIES: '@mypos_categories'
};

// Sample initial data
const initialProducts = [
  {
    id: '1',
    name: 'Laptop',
    price: 999.99,
    stock: 50,
    category: '1'  // Electronics category ID
  },
  {
    id: '2',
    name: 'Smartphone',
    price: 599.99,
    stock: 100,
    category: '1'  // Electronics category ID
  },
  {
    id: '3',
    name: 'Headphones',
    price: 99.99,
    stock: 200,
    category: '2'  // Accessories category ID
  },
  {
    id: '4',
    name: 'Mouse',
    price: 29.99,
    stock: 150,
    category: '2'  // Accessories category ID
  },
  {
    id: '5',
    name: 'Keyboard',
    price: 49.99,
    stock: 100,
    category: '2'  // Accessories category ID
  }
];

const initialCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    totalOrders: 5,
    totalPaidAmount: 2999.95
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    totalOrders: 3,
    totalPaidAmount: 1799.97
  }
];

const initialSales = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Doe',
    items: [
      { id: '1', name: 'Laptop', price: 999.99, quantity: 2 },
      { id: '3', name: 'Headphones', price: 99.99, quantity: 1 }
    ],
    subtotal: 2099.97,
    discountPercent: 5,
    discountAmount: 105.00,
    total: 1994.97,
    date: new Date(Date.now() - 86400000).toISOString() // Yesterday
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Jane Smith',
    items: [
      { id: '2', name: 'Smartphone', price: 599.99, quantity: 1 },
      { id: '4', name: 'Mouse', price: 29.99, quantity: 1 }
    ],
    subtotal: 629.98,
    discountPercent: 0,
    discountAmount: 0,
    total: 629.98,
    date: new Date().toISOString() // Today
  }
];

const initialCategories = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    color: '#5b68ff'
  },
  {
    id: '2',
    name: 'Accessories',
    description: 'Complementary items and accessories',
    color: '#ff9f43'
  },
  {
    id: '3',
    name: 'Office Supplies',
    description: 'Items for office and business use',
    color: '#10ac84'
  },
  {
    id: '4',
    name: 'Furniture',
    description: 'Furniture and home items',
    color: '#8854d0'
  },
  {
    id: '5',
    name: 'Food & Beverages',
    description: 'Edible items and drinks',
    color: '#ee5253'
  },
  {
    id: '6',
    name: 'Clothing',
    description: 'Apparel and wearable items',
    color: '#00d2d3'
  }
];

// Function to initialize data if not exists
export const initializeData = async () => {
  try {
    // Check if data exists
    const [products, customers, sales, categories] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS),
      AsyncStorage.getItem(STORAGE_KEYS.CUSTOMERS),
      AsyncStorage.getItem(STORAGE_KEYS.SALES),
      AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES)
    ]);

    // Initialize products if not exists
    if (!products) {
      await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    }

    // Initialize customers if not exists
    if (!customers) {
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
    }

    // Initialize sales if not exists
    if (!sales) {
      await AsyncStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(initialSales));
    }

    // Initialize categories if not exists
    if (!categories) {
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
    }

    return true;
  } catch (error) {
    console.error('Error initializing data:', error);
    return false;
  }
};

// Function to get data
export const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

// Function to save data
export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
};

// Function to reset data to initial values (for debugging)
export const resetData = async () => {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts)),
      AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories)),
      AsyncStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(initialCustomers)),
      AsyncStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(initialSales))
    ]);
    console.log("Data reset to initial values");
    return true;
  } catch (error) {
    console.error('Error resetting data:', error);
    return false;
  }
}; 