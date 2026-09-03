export interface StartInterviewRequest {
  companyName: string;
  companyWebsite?: string;
  jobRole: string;
  jobDescription: string;
  interviewType: "BEHAVIOURAL" | "TECHNICAL" | "MIXED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface InterviewResponse {
  id: number;
  companyName: string;
  companyWebsite?: string;
  jobRole: string;
  jobDescription?: string;
  interviewType: "BEHAVIOURAL" | "TECHNICAL" | "MIXED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: string;
  overallScore?: number;
  createdAt?: string;
}

export interface QuestionResponse {
  type: string;
  id: number;
  question: string;
  questionType: string;
  topic: string;
  questionNumber: number;
}

export interface AnswerEvaluationResponse {
  questionId: number;
  userAnswer: string;

  score: number;

  correctness?: number;
  completeness?: number;
  clarity?: number;
  depth?: number;
  relevance?: number;

  starSituation?: number;
  starTask?: number;
  starAction?: number;
  starResult?: number;

  strengths: string;
  missingConcepts: string;
  feedback: string;
  suggestedAnswer: string;
}

export interface InterviewReportResponse {
  sessionId: number;

  overallScore: number;

  totalQuestions: number;

  questionsAnswered?: number;

  strengths: string;

  improvements: string;

  recommendation: string;
}