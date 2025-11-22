-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  pickup_time VARCHAR(100),
  special_instructions TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'pending',
  payment_status VARCHAR(20) DEFAULT 'pending',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on order_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Create index on created_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for customers placing orders)
CREATE POLICY "Allow public to insert orders" ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow select (for customers to view their orders)
CREATE POLICY "Allow public to select orders" ON orders
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to update (for admin dashboard)
CREATE POLICY "Allow authenticated users to update orders" ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT ON orders TO anon;
GRANT ALL ON orders TO authenticated;

-- Add comments
COMMENT ON TABLE orders IS 'Customer orders from the mobile app';
COMMENT ON COLUMN orders.order_number IS 'Unique order number displayed to customer (e.g., ORD-20250122-0001)';
COMMENT ON COLUMN orders.items IS 'JSON array of cart items with details';
COMMENT ON COLUMN orders.status IS 'Order status: pending, confirmed, preparing, ready, completed, cancelled';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: card, cash, pending';
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, completed, failed';
