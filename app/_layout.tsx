import { Stack } from 'expo-router';
import { CartProvider } from '../contexts/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="checkout" 
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Checkout'
          }}
        />
        <Stack.Screen 
          name="confirmation" 
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Order Confirmed'
          }}
        />
      </Stack>
    </CartProvider>
  );
}
