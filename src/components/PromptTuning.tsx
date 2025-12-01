'use client';

import { PromptSettings } from '@/types';
import { motion } from 'framer-motion';

interface PromptTuningProps {
  settings: PromptSettings;
  onSettingsChange: (settings: PromptSettings) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function PromptTuning({
  settings,
  onSettingsChange,
  apiKey,
  onApiKeyChange,
}: PromptTuningProps) {
  const updateSetting = <K extends keyof PromptSettings>(
    key: K,
    value: PromptSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
        <h2 className="text-lg font-bold">⚙️ Prompt Tuning</h2>
        <p className="text-sm text-purple-100">システムプロンプトの設定</p>
      </div>

      {/* Settings Form */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔑 OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-... or 'doptest'"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
          />
          <p className="text-xs text-gray-500 mt-1">Enter &quot;doptest&quot; to use server API key</p>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🤖 Model
          </label>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateSetting('model', 'gpt-4o')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                settings.model === 'gpt-4o'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              GPT-4o
              <span className="block text-xs mt-1 opacity-75">High quality</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateSetting('model', 'gpt-4o-mini')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                settings.model === 'gpt-4o-mini'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              GPT-4o-mini
              <span className="block text-xs mt-1 opacity-75">Fast & cheap</span>
            </motion.button>
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏢 Company Name
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => updateSetting('companyName', e.target.value)}
            placeholder="Day One Partner"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
          />
        </div>

        {/* Greeting Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👋 Greeting Message (Agent First Talk)
          </label>
          <textarea
            value={settings.greetingMessage}
            onChange={(e) => updateSetting('greetingMessage', e.target.value)}
            placeholder="本日は、現在のスマホ料金が..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800"
          />
        </div>

        {/* Products */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📦 Products / Services
          </label>
          <textarea
            value={settings.products}
            onChange={(e) => updateSetting('products', e.target.value)}
            placeholder="1) スマホ保険: Basic 4,000円/年..."
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800"
          />
        </div>

        {/* HOT Definition */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              HOT
            </span>
            Definition
          </label>
          <textarea
            value={settings.hotDefinition}
            onChange={(e) => updateSetting('hotDefinition', e.target.value)}
            placeholder="strong buying intent or very positive phrases..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-800"
          />
        </div>

        {/* WARM Definition */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              WARM
            </span>
            Definition
          </label>
          <textarea
            value={settings.warmDefinition}
            onChange={(e) => updateSetting('warmDefinition', e.target.value)}
            placeholder="considering, asking details, comparing plans..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-gray-800"
          />
        </div>

        {/* COLD Definition */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              COLD
            </span>
            Definition
          </label>
          <textarea
            value={settings.coldDefinition}
            onChange={(e) => updateSetting('coldDefinition', e.target.value)}
            placeholder="low/no interest or wants to stop..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="border-t bg-gray-50 p-4">
        <p className="text-xs text-gray-500 text-center">
          Actions: 📞 transfer_to_operator | 👋 end_call | ➡️ none
        </p>
      </div>
    </div>
  );
}
