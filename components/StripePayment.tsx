import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { useStripe } from '@stripe/stripe-react-native';

interface StripePaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StripePayment({ amount, onSuccess, onCancel }: StripePaymentProps) {
  const [processing, setProcessing] = useState(false);
  // const stripe = useStripe();

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // TODO: Implement Stripe payment flow
      // 1. Create payment intent on your backend
      // 2. Confirm payment with Stripe
      // 3. Handle success/failure

      Alert.alert(
        'Payment Not Configured',
        'Stripe payment integration is not set up yet. For now, you can pay when you pick up your order.',
        [
          { text: 'OK', onPress: onCancel }
        ]
      );

      /*
      // Example Stripe integration:
      
      // Step 1: Get payment intent from your backend
      const response = await fetch('YOUR_BACKEND_URL/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(amount * 100) }), // Convert to cents
      });
      const { clientSecret } = await response.json();

      // Step 2: Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent) {
        onSuccess();
      }
      */

    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          💳 Stripe payment coming soon! For now, please pay when you pick up your order.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={processing}
      >
        <Text style={styles.payButtonText}>
          {processing ? 'Processing...' : 'Continue with Cash Payment'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 24,
  },
  notice: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  noticeText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
});

/*
SETUP INSTRUCTIONS FOR STRIPE:

1. Install Stripe SDK:
   npm install @stripe/stripe-react-native

2. Wrap your app with StripeProvider in app/_layout.tsx:
   import { StripeProvider } from '@stripe/stripe-react-native';
   
   <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}>
     <Stack>...</Stack>
   </StripeProvider>

3. Create backend endpoint to create payment intents
   (You'll need a Node.js server with Stripe SDK)

4. Uncomment the Stripe code in handlePayment above

5. Test with Stripe test cards:
   4242 4242 4242 4242 (Success)
   4000 0000 0000 9995 (Declined)
*/
