import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import type { MenuItem, Order, OrderItem } from '@repo/types';
import { calculateOrderTotal } from '@repo/utils';

// In-memory storage
let menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs and lemon',
    price: 24.99,
    category: 'Mains',
    available: true,
  },
  {
    id: '2',
    name: 'Beef Burger',
    description: 'Angus beef patty with cheese, lettuce, and tomato',
    price: 16.99,
    category: 'Mains',
    available: true,
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Romaine lettuce with parmesan and croutons',
    price: 12.99,
    category: 'Mains',
    available: true,
  },
  {
    id: '4',
    name: 'Margherita Pizza',
    description: 'Classic tomato, mozzarella, and basil',
    price: 14.99,
    category: 'Mains',
    available: true,
  },
  {
    id: '5',
    name: 'Coca Cola',
    description: 'Chilled soft drink',
    price: 3.99,
    category: 'Drinks',
    available: true,
  },
  {
    id: '6',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 5.99,
    category: 'Drinks',
    available: true,
  },
];

let orders: Order[] = [];
let orderIdCounter = 1;

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Menu endpoints
app.get('/api/menu', (req: Request, res: Response) => {
  res.json(menuItems);
});

app.patch('/api/menu/:id/availability', (req: Request, res: Response) => {
  const { id } = req.params;
  const menuItem = menuItems.find(item => item.id === id);

  if (!menuItem) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  menuItem.available = !menuItem.available;
  res.json(menuItem);
});

// Order endpoints
app.post('/api/orders', (req: Request, res: Response) => {
  const { tableNumber, items } = req.body;

  // Validation
  if (!tableNumber || typeof tableNumber !== 'number') {
    return res.status(400).json({ error: 'Valid table number is required' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  // Validate and build order items
  const orderItems: OrderItem[] = [];
  
  for (const item of items) {
    const { menuItemId, quantity } = item;

    if (!menuItemId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ 
        error: 'Each item must have a valid menuItemId and positive quantity' 
      });
    }

    const menuItem = menuItems.find(m => m.id === menuItemId);

    if (!menuItem) {
      return res.status(404).json({ 
        error: `Menu item with id ${menuItemId} not found` 
      });
    }

    if (!menuItem.available) {
      return res.status(400).json({ 
        error: `Menu item "${menuItem.name}" is not available` 
      });
    }

    orderItems.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      quantity,
      unitPrice: menuItem.price,
    });
  }

  // Create order
  const newOrder: Order = {
    id: String(orderIdCounter++),
    tableNumber,
    items: orderItems,
    status: 'pending',
    createdAt: new Date(),
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.get('/api/orders', (req: Request, res: Response) => {
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(sortedOrders);
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Status must be one of: ${validStatuses.join(', ')}` 
    });
  }

  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  res.json(order);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export app for testing
export default app;

// Start server only if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}
