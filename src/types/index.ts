export type MarkType = 'HOT' | 'WARM' | 'COLD';
export type ActionType = 'transfer_to_operator' | 'end_call' | 'none';

export interface AgentResponse {
  mark: MarkType;
  action: ActionType;
  reply: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mark?: MarkType;
  action?: ActionType;
  timestamp: Date;
}

export interface PromptSettings {
  companyName: string;
  products: string;
  greetingMessage: string;
  hotDefinition: string;
  warmDefinition: string;
  coldDefinition: string;
  model: 'gpt-4o' | 'gpt-4o-mini';
}
