
# Pizza Order Chat Application

A React-based pizza ordering application with AI-powered chat interface, speech recognition, and database integration.

## Features

### 🍕 Core Functionality
- **AI-Powered Chat Interface**: Natural language pizza ordering with OpenAI integration
- **Speech Recognition & Synthesis**: Voice input and text-to-speech responses
- **Order Management**: Complete order processing with database storage
- **Real-time Chat**: Interactive conversation flow with loading indicators

### 🎯 Components Architecture

#### Chat Components
- **`ChatMessage`**: Individual message display with user/assistant styling
- **`ChatInput`**: Input field with send button and form handling
- **LoadingIndicator`**: Animated typing indicator for AI responses

#### Order Components
- **`OrderSummaryCard`**: Displays current order details and pricing
- **`OrderCompleteCard`**: Final order confirmation with save functionality
- **`PizzaOrderChat`**: Main chat interface orchestrating the entire flow

#### UI Components
- **`AuthWrapper`**: Authentication wrapper for user management
- **`OrderHistory`**: View previously placed orders

### 🔧 Custom Hooks
- **`useSpeechRecognition`**: Browser speech-to-text functionality
- **`useSpeechSynthesis`**: Text-to-speech output for responses

### 🛠 Services
- **`chatService`**: Handles communication with Supabase Edge Functions
- **`orderService`**: Manages order storage and database operations

### 💾 Database Schema
- **Orders Table**: Stores pizza orders with user association
  - `id`: UUID primary key
  - `user_id`: Foreign key to auth.users (nullable for guest orders)
  - `order_data`: JSONB containing pizza details
  - `status`: Order status (pending, completed, etc.)
  - `created_at`/`updated_at`: Timestamps

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account for backend services

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd <your-project-name>
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Supabase Setup
1. Create a new Supabase project
2. Run the provided migration to create the orders table
3. Set up the chat Edge Function with OpenAI integration
4. Configure authentication (optional - supports guest orders)

### Step 5: Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Technologies Used

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality UI component library

### Backend & Database
- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Database with JSONB support
- **Edge Functions**: Serverless functions for AI chat integration
- **Row Level Security**: Secure data access policies

### AI & Speech
- **OpenAI API**: Natural language processing for chat
- **Web Speech API**: Browser-native speech recognition and synthesis

### State Management & Routing
- **React Query**: Server state management and caching
- **React Router**: Client-side routing
- **React Hook Form**: Form handling and validation

## Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   └── LoadingIndicator.tsx
│   ├── order/
│   │   ├── OrderSummaryCard.tsx
│   │   └── OrderCompleteCard.tsx
│   ├── ui/
│   │   └── [shadcn components]
│   ├── AuthWrapper.tsx
│   ├── OrderHistory.tsx
│   └── PizzaOrderChat.tsx
├── hooks/
│   ├── useSpeechRecognition.ts
│   └── useSpeechSynthesis.ts
├── services/
│   ├── chatService.ts
│   └── orderService.ts
├── integrations/
│   └── supabase/
└── pages/
    ├── Index.tsx
    └── NotFound.tsx
```

## Usage

### Basic Pizza Ordering
1. Navigate to the application
2. Start typing or speaking your pizza order
3. The AI will guide you through customization options
4. Review your order in the summary card
5. Confirm and save your order

### Voice Commands
- Click the microphone button to start voice input
- Speak naturally: "I want a large pepperoni pizza"
- The system will convert speech to text automatically

### Order Management
- View order summaries during the chat process
- Access order history (for authenticated users)
- Guest orders are supported without authentication

## Development

### Adding New Components
Components are organized by feature:
- Chat-related components in `src/components/chat/`
- Order-related components in `src/components/order/`
- Reusable UI components in `src/components/ui/`

### Extending Functionality
- Custom hooks in `src/hooks/`
- Service functions in `src/services/`
- Type definitions following existing patterns

### Building for Production
```bash
npm run build
```

### Deployment
The application can be deployed on any static hosting platform:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Or any other static site host

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please respect any usage guidelines from your institution.
