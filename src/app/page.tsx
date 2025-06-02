'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTopicClick = (topic: string) => {
    const question = `Tell me more about: ${topic}`;
    setInput(question);
    // Automatically submit the question
    handleTopicSubmit(question);
  };

  // Expose the function to the global window for onclick handlers
  if (typeof window !== 'undefined') {
    (window as any).handleTopicClick = handleTopicClick;
  }

  const handleTopicSubmit = async (question: string) => {
    const userMessage: Message = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text: string): string => {
    return text
      // Bold text: **text** -> <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text: *text* -> <em>text</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Topic boxes: TOPIC: text -> gray clickable boxes with onclick
      .replace(/TOPIC: (.+)/, (match, topic) => 
        `<div class="bg-gray-300 text-gray-800 px-4 py-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-400 transition-colors" onclick="window.handleTopicClick('${topic}')">${topic}</div>`
      )
      // Skills tags: Skills: word word -> Skills: <span class="tag">word</span> <span class="tag">word</span>
      .replace(/Skills: (.+)/, (match, skills) => {
        const skillTags = skills.split(' ').map((skill: string) => 
          `<span class="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs mr-1">${skill}</span>`
        ).join('');
        return `Skills: ${skillTags}`;
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-xl mt-12">
        <div className="flex flex-col items-center mb-8">
          <img src="/mascot.png" alt="Mascot" className="w-24 h-24 mb-4" />
          <h1 className="text-3xl font-semibold mb-2 text-gray-800">quirky heading?</h1>
        </div>
        <div className="w-full flex flex-col gap-4 mb-8">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.role === 'user'
                  ? 'self-end bg-yellow-200 rounded-xl px-6 py-4 text-lg font-medium shadow max-w-[80%] text-gray-800'
                  : 'self-start bg-white rounded-xl px-6 py-4 text-base shadow max-w-[80%] flex items-center gap-3 text-gray-800'
              }
            >
              {msg.role === 'assistant' && (
                <img src="/mascot.png" alt="Mascot" className="w-8 h-8 mr-2" />
              )}
              <div>
                {msg.content.split('\n').map((line, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: formatMessage(line) }} />
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="self-start bg-white rounded-xl px-6 py-4 text-base shadow max-w-[80%] flex items-center gap-3 opacity-60 text-gray-600">
              <img src="/mascot.png" alt="Mascot" className="w-8 h-8 mr-2" />
              <span>Thinking...</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-4 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
              placeholder="How can I help?"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              disabled={loading}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </button>
          </div>
        </form>
        <div className="flex flex-wrap gap-2 mt-8 justify-center">
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Find people based on project or skill</button>
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Explore company policies</button>
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Get help with internal tools</button>
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Discover recently launched initiatives</button>
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Browse projects using specific frameworks</button>
        </div>
        <div className="mt-12 text-gray-400 text-center text-sm">
          First time? Your previous prompts will live here eventually!
        </div>
      </div>
    </div>
  );
}
