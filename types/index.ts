// types/index.ts
// ==========================================
// Barrel export for all types
// Provides a single import point for shared types

// Auth types
export type {
    User,
    AuthResult,
    AuthResponse,
    SignupPayload,
    LoginPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload,
} from './auth.types';

// Chat types (User is re-exported from auth.types there for backward compatibility)
export type {
    Message,
    Conversation,
} from './chat';

// Task chat types
export type {
    TaskChatMessage,
    TaskContext,
    ChatHistoryResponse,
    SendMessageResponse,
    ClearChatResponse,
    ChatStats,
} from './task-chat.types';

// Assistant types
export type {
    AssistantMessage,
    SendMessagePayload,
    AssistantResponse,
    AssistantHistoryResponse,
    StreamResponse,
} from './assistant.types';
