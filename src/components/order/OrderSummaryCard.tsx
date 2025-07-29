
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PizzaOrder {
  pizza?: string;
  toppings?: string[];
  extras?: string[];
  customizations?: string;
  dietary_preferences?: string;
  allergies?: string;
  delivery_address?: string;
}

interface OrderSummaryCardProps {
  currentOrder: PizzaOrder;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ currentOrder }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {currentOrder.pizza && (
          <div>
            <strong>Pizza:</strong> 
            <Badge variant="secondary" className="ml-2">{currentOrder.pizza}</Badge>
          </div>
        )}
        {currentOrder.toppings && currentOrder.toppings.length > 0 && (
          <div>
            <strong>Toppings:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentOrder.toppings.map((topping, index) => (
                <Badge key={index} variant="outline">{topping}</Badge>
              ))}
            </div>
          </div>
        )}
        {currentOrder.extras && currentOrder.extras.length > 0 && (
          <div>
            <strong>Extras:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentOrder.extras.map((extra, index) => (
                <Badge key={index} variant="outline">{extra}</Badge>
              ))}
            </div>
          </div>
        )}
        {currentOrder.customizations && (
          <div>
            <strong>Customizations:</strong>
            <p className="text-sm text-gray-600">{currentOrder.customizations}</p>
          </div>
        )}
        {currentOrder.dietary_preferences && (
          <div>
            <strong>Dietary:</strong>
            <Badge variant="secondary">{currentOrder.dietary_preferences}</Badge>
          </div>
        )}
        {currentOrder.allergies && (
          <div>
            <strong>Allergies:</strong>
            <p className="text-sm text-red-600">{currentOrder.allergies}</p>
          </div>
        )}
        {currentOrder.delivery_address && (
          <div>
            <strong>Address:</strong>
            <p className="text-sm">{currentOrder.delivery_address}</p>
          </div>
        )}
        {Object.keys(currentOrder).length === 0 && (
          <p className="text-gray-500 text-sm">No items yet. Start chatting to place your order!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
