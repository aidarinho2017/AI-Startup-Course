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
  due_at: string | null;
  deadline_state: "no_group" | "not_set" | "set";
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

export type TelegramStatus = {
  is_configured: boolean;
  is_linked: boolean;
  linked_at: string | null;
  bot_username: string | null;
};

export type TelegramLinkCode = {
  code: string;
  expires_at: string;
  bot_username: string | null;
  start_url: string | null;
};

export type StudyGroup = {
  id: number;
  name: string;
  description: string | null;
};

export type Profile = {
  id: string;
  email: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  dream: string | null;
  study_group: StudyGroup | null;
  created_at: string;
};

export type InstructorModule = {
  slug: string;
  title: string;
  order_index: number;
  submission_count: number;
};

export type InstructorStudent = {
  id: string;
  name: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  dream: string | null;
  study_group: StudyGroup | null;
};

export type InstructorStudentSummary = InstructorStudent & {
  completed_count: number;
  reviewed_count: number;
  unreviewed_count: number;
  submission_count: number;
  total_modules: number;
};

export type InstructorSubmissionModule = {
  slug: string;
  title: string;
  order_index: number;
};

export type InstructorSubmission = {
  id: number;
  student: InstructorStudent;
  module: InstructorSubmissionModule | null;
  content: Record<string, string>;
  instructor_feedback: string | null;
  is_reviewed: boolean;
  submitted_at: string;
  updated_at: string;
};

export type InstructorStudentSubmissions = {
  student: InstructorStudentSummary;
  submissions: InstructorSubmission[];
};

export type InstructorGroupDeadline = {
  module_slug: string;
  module_title: string;
  module_order_index: number;
  due_at: string | null;
};

export type InstructorStudyGroup = StudyGroup & {
  deadlines: InstructorGroupDeadline[];
};
