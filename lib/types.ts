export interface CognitiveState {
  résumé: string;
  idées_clés: string[];
  décisions: string[];
  actions_à_faire: string[];
  questions_ouvertes: string[];
}

export interface UpdateRequest {
  sessionId: string;
  segment: string;
}

export interface UpdateResponse {
  success: boolean;
  state: CognitiveState;
  processingTime: number;
}

export const EMPTY_STATE: CognitiveState = {
  résumé: "",
  idées_clés: [],
  décisions: [],
  actions_à_faire: [],
  questions_ouvertes: []
};