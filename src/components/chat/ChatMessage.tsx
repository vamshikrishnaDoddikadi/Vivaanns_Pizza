
import React from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block p-3 rounded-lg max-w-xs ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-white border'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
