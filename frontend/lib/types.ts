export type SubmissionFieldType = "text" | "textarea" | "url";

export type SubmissionFieldSpec = {
  key: string;
  label: string;
  type: SubmissionFieldType;
  required: boolean;
  placeholder?: string;
};

export type Video = {
  youtube_id: string;
  title: string;
  order_index: number;
};

export type ModuleListItem = {
  slug: string;
  title: string;
  description: string;
  order_index: number;
  has_chatbot: boolean;
  is_completed: boolean;
};

export type ModuleDetail = ModuleListItem & {
  videos: Video[];
  submission_fields: SubmissionFieldSpec[];
};

export type DashboardOut = {
  total: number;
  completed: number;
  progress_pct: number;
  modules: ModuleListItem[];
};

export type Submission = {
  module_id: number;
  content: Record<string, string>;
  submitted_at: string;
  updated_at: string;
};

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  created_at: string;
};

export type ChatHistory = {
  messages: ChatMessage[];
};

export type Summary = {
  summary: Record<string, unknown>;
  generated_at: string;
};
