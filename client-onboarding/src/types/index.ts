/**
 * Type definitions for the AI Client Onboarding System
 */

// Service types offered by the agency
export type ServiceType = 'website' | 'branding' | 'automation';

// Question types for dynamic form rendering
export type QuestionType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'number'
  | 'date';

// Individual question definition
export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditionalOn?: {
    questionId: string;
    value: string | string[];
  };
}

// Question section (groups related questions)
export interface QuestionSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

// Service-specific onboarding flow
export interface ServiceFlow {
  serviceType: ServiceType;
  serviceName: string;
  sections: QuestionSection[];
}

// User's answer to a question
export interface Answer {
  questionId: string;
  value: string | string[] | number | boolean;
  timestamp: Date;
}

// Complete onboarding session
export interface OnboardingSession {
  id: string;
  clientName?: string;
  clientEmail?: string;
  serviceType: ServiceType;
  answers: Answer[];
  currentSectionIndex: number;
  currentQuestionIndex: number;
  startedAt: Date;
  lastUpdatedAt: Date;
  completedAt?: Date;
  status: 'in-progress' | 'completed' | 'abandoned';
}

// Identified risk or concern
export interface IdentifiedRisk {
  category: 'timeline' | 'scope' | 'budget' | 'clarity' | 'technical';
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation?: string;
}

// Final onboarding summary
export interface OnboardingSummary {
  sessionId: string;
  clientInfo: {
    name: string;
    email: string;
    company?: string;
    industry?: string;
  };
  projectInfo: {
    serviceType: ServiceType;
    serviceName: string;
    goals: string[];
    scope: string;
    constraints: {
      timeline?: string;
      budget?: string;
      technical?: string[];
    };
  };
  answers: Answer[];
  identifiedRisks: IdentifiedRisk[];
  nextSteps: string[];
  generatedAt: Date;
}

// ClickUp Integration Types
export interface ClickUpConfig {
  apiKey: string;
  workspaceId: string;
  listId: string;
  teamId?: string;
  folderId?: string;
}

// AI Configuration for Agentic Experience
export interface AIConfig {
  deepSeekKey: string;
  enabled: boolean;
}

export interface ClickUpSyncResult {
  success: boolean;
  taskId?: string;
  taskUrl?: string;
  error?: string;
}

// Application state
export interface AppState {
  currentSession: OnboardingSession | null;
  isLoading: boolean;
  error: string | null;
  clickUpConfig?: ClickUpConfig;
  aiConfig?: AIConfig;
}
