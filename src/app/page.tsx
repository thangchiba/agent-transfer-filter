'use client';

import { useState } from 'react';
import ChatArea from '@/components/ChatArea';
import PromptTuning from '@/components/PromptTuning';
import { PromptSettings } from '@/types';

const defaultSettings: PromptSettings = {
  companyName: 'Test Company',
  greetingMessage: '本日は、現在のスマホ料金が最大30%安くなる特別キャンペーンについてご案内しております。\n\n今よりお得になるプランにご興味はございますか？',
  products: `1) スマホ保険: Basic 4,000円/年(画面割れ1回), Standard 7,000円/年(画面割れ+バッテリー), Premium 12,000円/年(重度故障は本体交換1回).
2) SIM: Lite 5GB+30分 1,480円/月, Standard 20GB+60分 2,480円/月, Unlimited 無制限 3,980円/月.
3) 即時修理: 画面12,000〜25,000円, バッテリー6,000円, カメラ9,000円, クリーニング2,000円.
4) 技術サービス: ロック解除8,000〜20,000円, データ移行3,000円, アプリ最適化1,500円.`,
  hotDefinition:
    'strong buying intent or very positive phrases, e.g. 「いいね」「それいい」「導入しようかな」「申し込みたい」「それでお願い」「契約したい」.',
  warmDefinition:
    'considering, asking details, comparing plans, e.g. 「もう少し考えたい」「検討中」「他のプランも知りたい」.',
  coldDefinition:
    'low/no interest or wants to stop, e.g. 「今はいいかな」「今は時間ないな」「ちょっと興味ないな」「また今度で」「やっぱりやめておきます」.',
  model: 'gpt-4o',
};

export default function Home() {
  const [settings, setSettings] = useState<PromptSettings>(defaultSettings);
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            🎯 Agent Transfer Filter
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Chat Area - Left Side (2 columns on large screens) */}
          <div className="lg:col-span-2 h-full min-h-[500px]">
            <ChatArea settings={settings} apiKey={apiKey} />
          </div>

          {/* Prompt Tuning - Right Side (1 column on large screens) */}
          <div className="h-full min-h-[500px]">
            <PromptTuning
              settings={settings}
              onSettingsChange={setSettings}
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-6 text-center text-sm text-gray-500">
        <p>
          Built for testing agent classification |
          <span className="inline-flex items-center gap-1 ml-2">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              HOT
            </span>
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
              WARM
            </span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">
              COLD
            </span>
          </span>
        </p>
      </footer>
    </div>
  );
}
