import { supabase } from '../lib/supabase';
import { CartItem } from '../contexts/CartContext';

export interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupTime?: string;
  specialInstructions?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: 'card' | 'cash' | 'pending';
  paymentStatus?: 'pending' | 'completed' | 'failed';
}

export interface Order extends OrderData {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
}

/**
 * Create a new order in Supabase
 */
export async function createOrder(orderData: OrderData): Promise<Order> {
  try {
    // Generate order number (e.g., ORD-20250122-0001)
    const orderNumber = await generateOrderNumber();

    // Prepare order data for Supabase
    const order = {
      order_number: orderNumber,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_email: orderData.customerEmail || null,
      pickup_time: orderData.pickupTime || null,
      special_instructions: orderData.specialInstructions || null,
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      total: orderData.total,
      payment_method: orderData.paymentMethod || 'pending',
      payment_status: orderData.paymentStatus || 'pending',
      status: 'pending',
    };

    // Insert order into database
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }

    // Transform database response to Order format
    return {
      id: data.id,
      orderNumber: data.order_number,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email,
      pickupTime: data.pickup_time,
      specialInstructions: data.special_instructions,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      status: data.status,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
}

/**
 * Generate a unique order number
 */
async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  // Get count of orders today
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${today.toISOString().split('T')[0]}T00:00:00`)
    .lte('created_at', `${today.toISOString().split('T')[0]}T23:59:59`);

  if (error) {
    console.error('Error counting orders:', error);
    // Fallback to random number if count fails
    return `ORD-${dateStr}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }

  const orderCount = (count || 0) + 1;
  return `ORD-${dateStr}-${orderCount.toString().padStart(4, '0')}`;
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return {
      id: data.id,
      orderNumber: data.order_number,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email,
      pickupTime: data.pickup_time,
      specialInstructions: data.special_instructions,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      status: data.status,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error in getOrder:', error);
    return null;
  }
}

/**
 * Update order payment status
 */
export async function updateOrderPayment(
  orderId: string,
  paymentStatus: 'pending' | 'completed' | 'failed',
  paymentMethod?: 'card' | 'cash'
): Promise<boolean> {
  try {
    const updates: any = {
      payment_status: paymentStatus,
    };

    if (paymentMethod) {
      updates.payment_method = paymentMethod;
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order payment:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateOrderPayment:', error);
    return false;
  }
}
