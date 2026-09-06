export interface EvidencePayload {
  type: 'mask' | 'statistics' | 'chart' | 'mixed';
  imageUrl?: string;
  stats?: Record<string, string | number>;
  highlightChange?: string; // e.g., "+18.4%"
}

export interface SatQueryMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  evidence?: EvidencePayload;
  trace?: string[];
}