'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Order } from '@repo/types';
import { formatPrice, calculateOrderTotal } from '@repo/utils';

const API_URL = 'http://localhost:3001';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-800', next: 'preparing' },
  preparing: { label: 'Preparing', color: 'bg-amber-100 text-amber-800', next: 'ready' },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-800', next: 'delivered' },
  delivered: { label: 'Delivered', color: 'bg-blue-100 text-blue-800', next: null },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', next: null },
} as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/orders`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (orderId: string, currentStatus: Order['status']) => {
    const nextStatus = STATUS_CONFIG[currentStatus].next;
    
    if (!nextStatus) return;

    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const getShortId = (id: string) => {
    return id.length > 6 ? id.slice(-6) : id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mr-4"
          >
            ← Back to Menu
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map(order => {
              const total = calculateOrderTotal(order.items);
              const statusConfig = STATUS_CONFIG[order.status];
              const hasNextStatus = statusConfig.next !== null;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{getShortId(order.id)}
                      </h3>
                      <p className="text-gray-600">Table {order.tableNumber}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between text-gray-700"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.unitPrice)} each
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Order Footer */}
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(total)}
                      </p>
                    </div>
                    {hasNextStatus && (
                      <button
                        onClick={() => advanceStatus(order.id, order.status)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Next Status →
                      </button>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="mt-4 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
