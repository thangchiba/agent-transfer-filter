'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType, PromptSettings, AgentResponse } from '@/types';
import ChatMessage from './ChatMessage';

interface ChatAreaProps {
  settings: PromptSettings;
  apiKey: string;
}

export default function ChatArea({ settings, apiKey }: ChatAreaProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize greeting message when component mounts or after clear
  const initializeGreeting = useCallback(() => {
    if (settings.greetingMessage) {
      const greetingMessage: ChatMessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        content: settings.greetingMessage,
        timestamp: new Date(),
      };
      setMessages([greetingMessage]);
    } else {
      setMessages([]);
    }
    setConversationEnded(false);
  }, [settings.greetingMessage]);

  // Initialize on first render
  useEffect(() => {
    if (messages.length === 0 && settings.greetingMessage) {
      initializeGreeting();
    }
  }, []);

  const generateSystemPrompt = (): string => {
    return `You are ${settings.companyName}'s sales agent for Japanese customers.
Always output ONLY a single JSON object with this exact structure:
{
  "mark": "HOT" | "WARM" | "COLD",
  "action": "transfer_to_operator" | "end_call" | "none",
  "reply": "日本語の返答"
}
No markdown, no explanations, no extra keys, no text before or after the JSON.

Rules:
- Reply in natural, friendly, professional Japanese.
- Keep reply short (about 40 tokens or less).
- Services you can sell:
${settings.products}
- Provide price and key benefit briefly.
- If the user asks which plan suits them, ask about usage purpose, data amount and budget before recommending.
- When suggesting 2 or more services, you may mention 同時契約10%OFF.
- HOT: ${settings.hotDefinition}
- WARM: ${settings.warmDefinition}
- COLD: ${settings.coldDefinition}
- action = "transfer_to_operator" when the user clearly wants to buy or talk to a human, e.g. 「申し込みたい」「導入したい」「それで進めて」「担当者と話したい」「オペレーターにつないで」.
- action = "end_call" when the user clearly refuses or wants to end, e.g. 「今はいりません」「結構です」「興味ないです」「やめておきます」; reply should politely close the call.
- action = "none" for normal Q&A or when still considering.
- If the request is outside these services, decline politely in Japanese. If the user clearly ends the talk, set mark = "COLD" and action = "end_call".
- Never mention that you are an AI.`;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || conversationEnded) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt: generateSystemPrompt(),
          model: settings.model,
          apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: AgentResponse = await response.json();

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        mark: data.mark,
        action: data.action,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Check if conversation should end
      if (data.action === 'transfer_to_operator' || data.action === 'end_call') {
        setConversationEnded(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'エラーが発生しました。もう一度お試しください。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Keep focus on input after sending
      inputRef.current?.focus();
    }
  };

  // Handle IME composition for Japanese input
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only send on Enter when not composing (IME is not active)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationEnded(false);
  };

  const startNewConversation = () => {
    initializeGreeting();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">💬 Agent Chat Tester</h2>
          <p className="text-sm text-blue-100">Model: {settings.model}</p>
        </div>
        <button
          onClick={clearChat}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-4xl mb-4">🤖</p>
              <p>メッセージを入力して会話を始めてください</p>
              {settings.greetingMessage && (
                <button
                  onClick={startNewConversation}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🚀 Start Conversation
                </button>
              )}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* New Conversation Button when conversation ended */}
        {conversationEnded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startNewConversation}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                🔄
              </motion.span>
              新しい会話を開始
            </motion.button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={conversationEnded ? "会話が終了しました" : "メッセージを入力... (Enterで送信)"}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isLoading || conversationEnded}
            autoFocus
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim() || conversationEnded}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            送信
          </motion.button>
        </div>
      </div>
    </div>
  );
}
