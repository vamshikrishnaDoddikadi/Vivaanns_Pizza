
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pizza } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { sendChatMessage } from '@/services/chatService';
import { saveOrderToDatabase } from '@/services/orderService';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import LoadingIndicator from '@/components/chat/LoadingIndicator';
import OrderSummaryCard from '@/components/order/OrderSummaryCard';
import OrderCompleteCard from '@/components/order/OrderCompleteCard';

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

const PizzaOrderChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "🍕 Welcome to Vivaan's Pizza! I'm here to take your order. What pizza would you like today? We have: Margherita, Pepperoni, Veggie, Hawaiian, and BBQ Chicken!"
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PizzaOrder>({});
  const [orderComplete, setOrderComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { isListening, startListening, stopListening } = useSpeechRecognition();
  const { speakMessage } = useSpeechSynthesis();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeechResult = (transcript: string) => {
    setCurrentInput(transcript);
  };

  const sendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const { assistantMessage, updatedOrder, isComplete } = await sendChatMessage(newMessages, currentOrder);

      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
      setCurrentOrder(updatedOrder);
      setOrderComplete(isComplete);

      // Speak the assistant's response
      speakMessage(assistantMessage);

      // If order is complete, save to database
      if (isComplete) {
        await saveOrderToDatabase(updatedOrder, toast);
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      // More specific error handling
      let errorMessage = "Failed to process your message. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('Edge function error')) {
          errorMessage = "Chat service is temporarily unavailable. Please try again in a moment.";
        } else if (error.message.includes('No response data')) {
          errorMessage = "Received incomplete response. Please try rephrasing your message.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      // Add error message to chat
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again or type your message differently." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleStartListening = () => {
    startListening(handleSpeechResult);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pizza className="h-6 w-6 text-orange-500" />
            Vivaan's Pizza
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              <ChatInput
                currentInput={currentInput}
                setCurrentInput={setCurrentInput}
                isLoading={isLoading}
                isListening={isListening}
                onSendMessage={sendMessage}
                onStartListening={handleStartListening}
                onStopListening={stopListening}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <OrderSummaryCard currentOrder={currentOrder} />

              {orderComplete && (
                <OrderCompleteCard currentOrder={currentOrder} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PizzaOrderChat;
