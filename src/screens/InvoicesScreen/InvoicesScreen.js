import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Text, Divider, Portal, Modal, IconButton } from 'react-native-paper';
import { theme } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useRoute } from '@react-navigation/native';

const SALES_STORAGE_KEY = '@mypos_sales';

const InvoicesScreen = () => {
    const [sales, setSales] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const route = useRoute();

    useEffect(() => {
        loadSales();
    }, []);

    // Add effect to handle reload parameter
    useEffect(() => {
        if (route.params?.reload) {
            loadSales();
        }
    }, [route.params?.reload]);

    const loadSales = async () => {
        try {
            setLoading(true);
            const salesData = await AsyncStorage.getItem(SALES_STORAGE_KEY);
            if (salesData) {
                const parsedSales = JSON.parse(salesData);
                // Convert old format sales to new format
                const updatedSales = parsedSales.map(sale => {
                    if (!sale.subtotal) {
                        const subtotal = sale.total || 0;
                        return {
                            ...sale,
                            subtotal: subtotal,
                            discountPercent: 0,
                            discountAmount: 0,
                            total: subtotal
                        };
                    }
                    return sale;
                });
                setSales(updatedSales.sort((a, b) => new Date(b.date) - new Date(a.date)));
            }
        } catch (error) {
            console.error('Error loading sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadSales().then(() => setRefreshing(false));
    }, []);

    const InvoiceDetails = ({ invoice }) => {
        // Ensure we have all required values
        const subtotal = invoice.subtotal || invoice.total || 0;
        const discountPercent = invoice.discountPercent || 0;
        const discountAmount = invoice.discountAmount || 0;
        const total = invoice.total || subtotal;

        return (
            <View style={styles.invoiceDetailContainer}>
                <View style={styles.invoiceHeader}>
                    <Title style={styles.invoiceTitle}>Invoice</Title>
                </View>
                <View style={styles.invoiceSubHeader}>
                    <Text>Date: {format(new Date(invoice.date), 'MM/dd/yy')}</Text>
                    <Text>Invoice: #{invoice.id}</Text>
                </View>

                <View style={styles.addressSection}>
                    <View style={styles.toSection}>
                        <Text style={styles.sectionLabel}>PAY TO</Text>
                        <Text style={styles.customerName}>{invoice.customerName}</Text>
                        <Text>Customer Address</Text>
                        <Text>12345678990</Text>
                    </View>
                </View>

                <View style={styles.itemsTable}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.descriptionHeader]}>DESCRIPTION</Text>
                        <Text style={[styles.tableHeaderText, styles.qtyHeader]}>QTY</Text>
                        <Text style={[styles.tableHeaderText, styles.subtotalHeader]}>SUBTOTAL</Text>
                    </View>

                    {invoice.items.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.descriptionCell]}>{item.name}</Text>
                            <Text style={[styles.tableCell, styles.qtyCell]}>{item.quantity}</Text>
                            <Text style={[styles.tableCell, styles.subtotalCell]}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>

                <Divider style={styles.divider} />

                <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                        <Text>Subtotal</Text>
                        <Text>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text>Discount ({discountPercent}%)</Text>
                        <Text>${discountAmount.toFixed(2)}</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalText}>Total</Text>
                        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>NOTES</Text>
                    <Text style={styles.notesText}>Thank you for your business!</Text>
                </View>
            </View>
        );
    };

  return (
    <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {sales.map((sale) => (
                    <Card
                        key={sale.id}
                        style={styles.invoiceCard}
                        onPress={() => setSelectedInvoice(sale)}
                    >
                        <Card.Content>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Title>Invoice #{sale.id}</Title>
                                    <Text>{format(new Date(sale.date), 'MM/dd/yy')}</Text>
                                </View>
                                <Text style={styles.amount}>
                                    ${(sale.total || 0).toFixed(2)}
                                </Text>
                            </View>
                            <Divider style={styles.cardDivider} />
                            <View style={styles.cardFooter}>
                                <Text>{sale.customerName}</Text>
                                <IconButton
                                    icon="chevron-right"
                                    size={24}
                                    onPress={() => setSelectedInvoice(sale)}
                                />
      </View>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>

            <Portal>
                <Modal
                    visible={selectedInvoice !== null}
                    onDismiss={() => setSelectedInvoice(null)}
                    contentContainerStyle={styles.modalContent}
                >
                    {selectedInvoice && <InvoiceDetails invoice={selectedInvoice} />}
                </Modal>
            </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    },
    invoiceCard: {
        margin: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardDivider: {
        marginVertical: 12,
    },
    cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        margin: 16,
        padding: 16,
        borderRadius: 8,
        maxHeight: '90%',
    },
    invoiceDetailContainer: {
        padding: 16,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    invoiceSubHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    addressSection: {
        marginBottom: 32,
    },
    sectionLabel: {
        color: theme.colors.textLight,
        marginBottom: 8,
    },
    customerName: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemsTable: {
        marginBottom: 24,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tableHeaderText: {
        color: theme.colors.textLight,
        fontSize: 12,
    },
    descriptionHeader: {
        flex: 2,
    },
    qtyHeader: {
        flex: 1,
        textAlign: 'center',
    },
    subtotalHeader: {
        flex: 1,
        textAlign: 'right',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tableCell: {
        fontSize: 14,
    },
    descriptionCell: {
        flex: 2,
    },
    qtyCell: {
        flex: 1,
        textAlign: 'center',
    },
    subtotalCell: {
    flex: 1,
        textAlign: 'right',
    },
    divider: {
        marginVertical: 16,
    },
    totalSection: {
        marginBottom: 24,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    totalText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    totalAmount: {
        fontWeight: 'bold',
        fontSize: 16,
        color: theme.colors.primary,
    },
    notesSection: {
        marginTop: 16,
    },
    notesLabel: {
        color: theme.colors.textLight,
        marginBottom: 8,
    },
    notesText: {
        color: theme.colors.textLight,
  },
});

export default InvoicesScreen;