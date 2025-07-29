
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Pizza } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface Order {
  id: string;
  order_data: any;
  status: string;
  created_at: string;
  user_id: string | null;
}

interface OrderHistoryProps {
  user?: User | null;
}

const OrderHistory = ({ user }: OrderHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in (guest mode), don't fetch orders
    if (!user) {
      setLoading(false);
      return;
    }
    
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id) // Filter by current user's ID
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show message for guest users
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Pizza className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Please sign in to view your order history.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Your Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Pizza className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders yet. Place your first order above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()} at{' '}
                          {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {order.order_data.pizza && (
                        <div>
                          <strong>Pizza:</strong> {order.order_data.pizza}
                        </div>
                      )}
                      {order.order_data.toppings?.length > 0 && (
                        <div>
                          <strong>Toppings:</strong> {order.order_data.toppings.join(', ')}
                        </div>
                      )}
                      {order.order_data.extras?.length > 0 && (
                        <div>
                          <strong>Extras:</strong> {order.order_data.extras.join(', ')}
                        </div>
                      )}
                      {order.order_data.delivery_address && (
                        <div>
                          <strong>Address:</strong> {order.order_data.delivery_address}
                        </div>
                      )}
                      {order.order_data.customizations && (
                        <div className="md:col-span-2">
                          <strong>Special Instructions:</strong> {order.order_data.customizations}
                        </div>
                      )}
                    </div>
                    
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                        View JSON
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(order.order_data, null, 2)}
                      </pre>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;
