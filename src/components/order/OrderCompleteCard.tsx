
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface PizzaOrder {
  pizza?: string;
  toppings?: string[];
  extras?: string[];
  customizations?: string;
  dietary_preferences?: string;
  allergies?: string;
  delivery_address?: string;
}

interface OrderCompleteCardProps {
  currentOrder: PizzaOrder;
}

const OrderCompleteCard: React.FC<OrderCompleteCardProps> = ({ currentOrder }) => {
  return (
    <Card className="border-green-500 bg-green-50">
      <CardContent className="pt-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg" 
            alt="Delicious pizza" 
            className="w-32 h-24 object-cover rounded-lg"
          />
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-green-700">Order Complete! 🎉</h3>
          </div>
          <div className="text-sm text-green-600">
            <p>Your delicious {currentOrder.pizza} pizza is being prepared!</p>
            <p className="mt-1">Estimated delivery: 25-35 minutes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCompleteCard;
