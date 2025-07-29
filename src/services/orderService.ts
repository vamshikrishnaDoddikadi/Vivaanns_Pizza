
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PizzaOrder {
  pizza?: string;
  toppings?: string[];
  extras?: string[];
  customizations?: string;
  dietary_preferences?: string;
  allergies?: string;
  delivery_address?: string;
}

export const saveOrderToDatabase = async (order: PizzaOrder, toast: ReturnType<typeof useToast>['toast']) => {
  try {
    // Get current user (might be null for guest users)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.warn('Auth error (guest mode):', userError);
    }

    // Insert order with proper user_id handling
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null, // Allow null for guest orders
        order_data: order as any,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error details:', error);
      throw error;
    }

    console.log('Order saved successfully:', data);

    toast({
      title: "Order saved!",
      description: "Your pizza order has been confirmed and saved.",
    });
  } catch (error) {
    console.error('Error saving order:', error);
    
    let errorMessage = "Your order details are complete but couldn't be saved. Please contact us directly.";
    
    // Provide more specific error messages
    if (error && typeof error === 'object' && 'code' in error) {
      switch (error.code) {
        case 'PGRST301':
          errorMessage = "Database connection issue. Your order is complete - please save the details and contact us.";
          break;
        case '42501':
          errorMessage = "Permission error. Your order is complete - please save the details and contact us.";
          break;
        default:
          console.error('Unhandled database error code:', error.code);
      }
    }
    
    toast({
      title: "Error saving order",
      description: errorMessage,
      variant: "destructive"
    });
  }
};
