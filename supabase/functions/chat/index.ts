
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Try both possible secret names
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('Open ai')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, currentOrder = {} } = await req.json()

    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not found. Checked: OPENAI_API_KEY and "Open ai"')
      throw new Error('OpenAI API key not configured')
    }

    const systemPrompt = `You are a friendly and intelligent AI assistant for Tony's Pizza delivery service.
Your task is to interact with the customer, collect their order details, ask follow-up questions when necessary, and confirm the final order.
Use a friendly, casual tone, and guide the customer step-by-step.

Menu:
- Pizzas: Margherita, Pepperoni, Veggie, Hawaiian, BBQ Chicken
- Optional toppings: Extra Cheese, Olives, Mushrooms, Onions, Jalapeños
- Extras: Garlic Bread, Soda, Dip, Salad

Current order status: ${JSON.stringify(currentOrder)}

Follow this order:
1. Ask what pizza they want from the menu
2. Ask if they want any optional toppings
3. Ask if they want any extras
4. Ask about allergies or dietary preferences (vegan/halal)
5. Ask for delivery address
6. Ask about customizations (spice level, special instructions)
7. Confirm the complete order

Once you have all information, respond with "ORDER_COMPLETE" at the start of your message and provide a friendly confirmation.

Keep responses concise and conversational. Only ask for one thing at a time unless the customer provides multiple pieces of information.`

    console.log('Making OpenAI API request...')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('OpenAI response:', data)

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data)
      throw new Error('Invalid response from OpenAI')
    }

    const assistantMessage = data.choices[0].message.content

    // Parse the response to extract order information
    const updatedOrder = { ...currentOrder }
    const messageText = assistantMessage.toLowerCase()

    // Extract pizza selection
    const pizzas = ['margherita', 'pepperoni', 'veggie', 'hawaiian', 'bbq chicken']
    const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || ''
    
    if (!updatedOrder.pizza) {
      for (const pizza of pizzas) {
        if (lastUserMessage.includes(pizza)) {
          updatedOrder.pizza = pizza.charAt(0).toUpperCase() + pizza.slice(1)
          break
        }
      }
    }

    // Extract toppings
    const toppings = ['extra cheese', 'olives', 'mushrooms', 'onions', 'jalapeños']
    if (!updatedOrder.toppings) {
      updatedOrder.toppings = []
    }
    
    for (const topping of toppings) {
      if (lastUserMessage.includes(topping) && !updatedOrder.toppings.includes(topping)) {
        updatedOrder.toppings.push(topping.charAt(0).toUpperCase() + topping.slice(1))
      }
    }

    // Extract extras
    const extras = ['garlic bread', 'soda', 'dip', 'salad']
    if (!updatedOrder.extras) {
      updatedOrder.extras = []
    }
    
    for (const extra of extras) {
      if (lastUserMessage.includes(extra) && !updatedOrder.extras.includes(extra)) {
        updatedOrder.extras.push(extra.charAt(0).toUpperCase() + extra.slice(1))
      }
    }

    // Extract address (simple pattern matching)
    if (!updatedOrder.delivery_address && (lastUserMessage.includes('street') || lastUserMessage.includes('address') || /\d+.*\w+.*street|avenue|road|blvd/i.test(lastUserMessage))) {
      updatedOrder.delivery_address = lastUserMessage
    }

    // Extract allergies
    if (!updatedOrder.allergies && (lastUserMessage.includes('allerg') || lastUserMessage.includes('none'))) {
      updatedOrder.allergies = lastUserMessage.includes('none') ? 'none' : lastUserMessage
    }

    // Extract dietary preferences
    if (!updatedOrder.dietary_preferences && (lastUserMessage.includes('vegan') || lastUserMessage.includes('halal'))) {
      if (lastUserMessage.includes('vegan')) updatedOrder.dietary_preferences = 'vegan'
      if (lastUserMessage.includes('halal')) updatedOrder.dietary_preferences = 'halal'
    }

    // Extract customizations
    if (!updatedOrder.customizations && (lastUserMessage.includes('spicy') || lastUserMessage.includes('custom') || lastUserMessage.includes('special'))) {
      updatedOrder.customizations = lastUserMessage
    }

    // Check if order is complete
    const isComplete = assistantMessage.startsWith('ORDER_COMPLETE') || (
      updatedOrder.pizza &&
      updatedOrder.delivery_address &&
      (updatedOrder.allergies !== undefined || lastUserMessage.includes('no allerg'))
    )

    return new Response(
      JSON.stringify({
        message: assistantMessage.replace('ORDER_COMPLETE', '').trim(),
        order: updatedOrder,
        complete: isComplete
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process request', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
