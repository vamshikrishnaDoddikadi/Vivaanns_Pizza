
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send } from 'lucide-react';

interface ChatInputProps {
  currentInput: string;
  setCurrentInput: (value: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onSendMessage: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  currentInput,
  setCurrentInput,
  isLoading,
  isListening,
  onSendMessage,
  onStartListening,
  onStopListening,
  onKeyPress,
}) => {
  return (
    <div className="flex gap-2">
      <Input
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Type your message or use voice..."
        disabled={isLoading}
        className="flex-1"
      />
      <Button
        onClick={isListening ? onStopListening : onStartListening}
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        disabled={isLoading}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      <Button
        onClick={onSendMessage}
        disabled={isLoading || !currentInput.trim()}
        size="icon"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
