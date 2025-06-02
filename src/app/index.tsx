import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

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
          <h1 className="text-3xl font-semibold mb-2">quirky heading?</h1>
        </div>
        <div className="w-full flex flex-col gap-4 mb-8">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.role === 'user'
                  ? 'self-end bg-yellow-200 rounded-xl px-6 py-4 text-lg font-medium shadow max-w-[80%]'
                  : 'self-start bg-white rounded-xl px-6 py-4 text-base shadow max-w-[80%] flex items-center gap-3'
              }
            >
              {msg.role === 'assistant' && (
                <img src="/mascot.png" alt="Mascot" className="w-8 h-8 mr-2" />
              )}
              <span>
                {msg.content.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </span>
            </div>
          ))}
          {loading && (
            <div className="self-start bg-white rounded-xl px-6 py-4 text-base shadow max-w-[80%] flex items-center gap-3 opacity-60">
              <img src="/mascot.png" alt="Mascot" className="w-8 h-8 mr-2" />
              <span>Thinking...</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="How can I help?"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-medium shadow"
            disabled={loading}
          >
            <span className="inline-block align-middle">➤</span>
          </button>
        </form>
        <div className="flex flex-wrap gap-2 mt-8 justify-center">
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm">Find people based on project or skill</button>
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm">Explore company policies</button>
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm">Get help with internal tools</button>
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm">Discover recently launched initiatives</button>
          <button className="bg-gray-200 rounded-full px-4 py-2 text-sm">Browse projects using specific frameworks</button>
        </div>
        <div className="mt-12 text-gray-400 text-center text-sm">
          First time? Your previous prompts will live here eventually!
        </div>
      </div>
    </div>
  );
}
