
import React, { useState, useEffect } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import PizzaOrderChat from '@/components/PizzaOrderChat';
import OrderHistory from '@/components/OrderHistory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4">
        <Tabs defaultValue="order" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="order">New Order</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="order">
            <PizzaOrderChat />
          </TabsContent>
          
          <TabsContent value="history">
            <OrderHistory user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </AuthWrapper>
  );
};

export default Index;
