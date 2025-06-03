"use client";

import { SuggestionButtons } from '@/components/SuggestionButtons';
import { ChatInput } from '@/components/ChatInput';
import { MessageBubble } from '@/components/MessageBubble';
import { useRandomGreeting } from '@/hooks/useRandomGreeting';
import { useChat } from '@/hooks/useChat';
import { Message } from '@/types/chat';
import { formatMessage } from '@/utils/messageFormatter';
import { useCallback } from 'react';

export default function Home() {
  const greeting = useRandomGreeting();
  const { messages, loading, addMessage } = useChat();

  // For clickable topic suggestions in LLM output
  const handleTopicClick = useCallback((topic: string) => {
    addMessage(`Tell me more about: ${topic}`);
  }, [addMessage]);

  // Expose the function to the global window for onclick handlers in LLM output
  if (typeof window !== 'undefined') {
    (window as any).handleTopicClick = handleTopicClick;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-xl mt-12">
        <div className="flex flex-col items-center mb-8">
          <img src="/mascot.png" alt="Mascot" className="w-24 h-24 mb-4" />
          <h1 className="text-3xl font-semibold mb-2 text-gray-800 text-center">{greeting}</h1>
        </div>
        <div className="w-full flex flex-col gap-4 mb-8">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          {loading && (
            <div className="self-start px-6 py-4 text-base max-w-[80%] flex items-start gap-3 opacity-60 text-gray-600">
              <img src="/mascot.png" alt="Mascot" className="w-8 h-8 mr-2" />
              <span>Thinking...</span>
            </div>
          )}
        </div>
        <ChatInput onSubmit={addMessage} disabled={loading} />
        <SuggestionButtons onSuggestionClick={addMessage} />
        <div className="mt-12 text-gray-400 text-center text-sm">
          First time? Your previous prompts will live here eventually!
        </div>
      </div>
      {/* Tailwind safelist for dynamic classes used in injected HTML */}
      <div className="hidden">
        w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm flex-shrink-0
        inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs mr-1
        inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-1
      </div>
    </div>
  );
}
