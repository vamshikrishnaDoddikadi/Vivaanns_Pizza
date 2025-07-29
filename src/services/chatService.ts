
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface PizzaOrder {
  pizza?: string;
  toppings?: string[];
  extras?: string[];
  customizations?: string;
  dietary_preferences?: string;
  allergies?: string;
  delivery_address?: string;
}

export const sendChatMessage = async (messages: Message[], currentOrder: PizzaOrder) => {
  const { data, error } = await supabase.functions.invoke('chat', {
    body: {
      messages,
      currentOrder
    },
  });

  if (error) {
    console.error('Supabase Edge Function error:', error);
    throw new Error(`Edge function error: ${error.message}`);
  }

  if (!data) {
    throw new Error('No response data from chat function');
  }

  return {
    assistantMessage: data.message,
    updatedOrder: data.order || currentOrder,
    isComplete: data.complete || false,
  };
};
