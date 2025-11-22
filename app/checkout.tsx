import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'expo-router';
import { createOrder } from '../utils/orderService';

export default function CheckoutScreen() {
  const { cart, cartTotal, subtotal, tax, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    pickupTime: '',
    specialInstructions: '',
  });

  const handlePlaceOrder = async () => {
    // Validate form
    if (!customerInfo.name || !customerInfo.phone) {
      Alert.alert('Missing Information', 'Please fill in your name and phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in Supabase
      const order = await createOrder({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email || undefined,
        pickupTime: customerInfo.pickupTime || undefined,
        specialInstructions: customerInfo.specialInstructions || undefined,
        items: cart,
        subtotal,
        tax,
        total: cartTotal,
        paymentMethod: 'cash', // For now, default to cash
        paymentStatus: 'pending',
      });

      console.log('Order created:', order);

      // TODO: Integrate Stripe payment here if needed
      // If payment successful, update order payment status

      // Clear cart and navigate to confirmation
      clearCart();
      Alert.alert(
        'Order Placed!',
        `Your order #${order.orderNumber} has been received. We'll have it ready soon!`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/confirmation'),
          },
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert(
        'Error',
        'There was a problem placing your order. Please try again or call us directly.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Checkout</Text>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            {cart.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>
                    {item.quantity}x {item.itemName}
                  </Text>
                  {item.meat && (
                    <Text style={styles.orderItemDetail}>• {item.meat}</Text>
                  )}
                  {item.size && (
                    <Text style={styles.orderItemDetail}>• {item.size}</Text>
                  )}
                </View>
                <Text style={styles.orderItemPrice}>${item.total.toFixed(2)}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>${cartTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={customerInfo.name}
            onChangeText={text => setCustomerInfo({ ...customerInfo, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            value={customerInfo.phone}
            onChangeText={text => setCustomerInfo({ ...customerInfo, phone: text })}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Email (optional)"
            value={customerInfo.email}
            onChangeText={text => setCustomerInfo({ ...customerInfo, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Preferred Pickup Time (optional)"
            value={customerInfo.pickupTime}
            onChangeText={text => setCustomerInfo({ ...customerInfo, pickupTime: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Special Instructions (optional)"
            value={customerInfo.specialInstructions}
            onChangeText={text => setCustomerInfo({ ...customerInfo, specialInstructions: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentNote}>
            <Text style={styles.paymentNoteText}>
              💳 Payment processing coming soon! For now, you can pay when you pick up your order.
            </Text>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity 
          style={[styles.placeOrderButton, isSubmitting && styles.placeOrderButtonDisabled]} 
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By placing this order, you agree to our terms and conditions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 4,
  },
  orderItemDetail: {
    fontSize: 13,
    color: '#6b7280',
  },
  orderItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  paymentNote: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  paymentNoteText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  placeOrderButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
});
