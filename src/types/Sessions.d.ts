export interface Session {
    session_id: string;
    avatar_url: string | null;
}

export interface UserPrompt {
    session_id: string;
    text: string;
    created_at: string;
}

export interface OptimizedSuggestion {
    session_id: string;
    text: string;
    tone_used: string;
    tokens_used: number;
    created_at: string;
}

export interface SessionHistoryAPIResponse {
    error?: string;
    exists?: boolean;
    userPrompts: UserPrompt[];
    optimizedSuggestions: OptimizedSuggestion[];
}

export interface SessionAvatarAPIResponse {
    error?: string;
    exists?: boolean;
    avatarUrl?: string | null;
}
