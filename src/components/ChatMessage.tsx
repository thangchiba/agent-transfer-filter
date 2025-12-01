'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const markColors = {
  HOT: 'bg-gradient-to-r from-red-500 to-orange-500',
  WARM: 'bg-gradient-to-r from-yellow-400 to-amber-500',
  COLD: 'bg-gradient-to-r from-blue-400 to-cyan-500',
};

const markBgColors = {
  HOT: 'bg-red-50 border-red-200',
  WARM: 'bg-yellow-50 border-yellow-200',
  COLD: 'bg-blue-50 border-blue-200',
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const showAction = message.action && message.action !== 'none';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : message.mark
            ? `${markBgColors[message.mark]} border-2`
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {/* Mark Badge */}
        {message.mark && !isUser && (
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`${markColors[message.mark]} text-white text-xs font-bold px-2 py-1 rounded-full`}
            >
              {message.mark}
            </span>
          </div>
        )}

        {/* Message Content */}
        <p className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
          {message.content}
        </p>

        {/* Action Animation */}
        <AnimatePresence>
          {showAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="mt-3"
            >
              {message.action === 'transfer_to_operator' && (
                <motion.div
                  className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(34, 197, 94, 0.4)',
                      '0 0 0 10px rgba(34, 197, 94, 0)',
                      '0 0 0 0 rgba(34, 197, 94, 0)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    className="text-xl"
                  >
                    📞
                  </motion.span>
                  <span className="text-sm font-medium">オペレーターに転送中...</span>
                </motion.div>
              )}

              {message.action === 'end_call' && (
                <motion.div
                  className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span
                    animate={{
                      y: [0, -5, 0],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-xl"
                  >
                    👋
                  </motion.span>
                  <span className="text-sm font-medium">通話終了</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timestamp */}
        <p className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}
