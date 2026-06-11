'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { getWelcomeMessage, getMockAssistantResponse } from '@/backend/mock-data';
import { getGeminiResponse } from '@/backend/gemini';
import { v4 as uuid } from 'uuid';

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setMessages([getWelcomeMessage()]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = {
      id: uuid(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    // Build conversation history for context (last 10 messages, excluding welcome)
    const history = updatedMessages
      .filter((m) => m.id !== messages[0]?.id)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      // Call Gemini directly (works in static export — no server API route needed)
      const responseText = await getGeminiResponse(userMsg.content, history);
      const assistantMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: responseText || getMockAssistantResponse(userMsg.content),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const assistantMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: getMockAssistantResponse(userMsg.content),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }
    setIsTyping(false);
  };

  if (!mounted) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

  const suggestions = [
    'How can I reduce my carbon footprint?',
    'What are the best low-carbon foods?',
    'Tips for green commuting in India',
    'How much CO₂ does AC usage produce?',
  ];

  return (
    <div>
      <div className="page-header">
        <h1>🤖 AI Assistant</h1>
        <p>Powered by Google Gemini — your personal carbon advisor</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="chat-container">
          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble assistant">
                <div className="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions — only show if just the welcome message */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  className="chip"
                  onClick={() => setInput(s)}
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', cursor: 'pointer', border: '1px solid var(--border)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="chat-input-area">
            <input
              type="text"
              className="form-input"
              placeholder="Ask about reducing your carbon footprint..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isTyping}
              id="chat-input"
              aria-label="Type your message"
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              id="send-message"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
