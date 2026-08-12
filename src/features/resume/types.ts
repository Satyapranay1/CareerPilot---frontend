export interface ResumeHistory {
  id: number;
  fileName: string;
  company: string;
  jobRole: string;
  atsScore: number;
  uploadedAt: string;
}

export interface ResumeScores {
  keywordMatch: number;
  impact: number;
  readability: number;
  grammar: number;
  structure: number;
}

export interface ResumeAIAnalysis {
  knowledgeSource?: string;
  summary?: string;
  atsScore?: number;

  scores?: ResumeScores;

  strongAreas?: string[];
  weakAreas?: string[];

  missingKeywords?: string[];
  missingSkills?: string[];

  improvementSuggestions?: string[];
}

export interface ResumeAnalysis {
  id: number;
  fileName: string;
  company: string;
  jobRole: string;

  knowledgeSource?: string;
  atsScore: number;
  uploadedAt: string;

  analysis?: ResumeAIAnalysis;
}

export interface ResumeResponse {
  id: number;
  fileName: string;
  company: string;
  jobRole: string;
  atsScore: number;
}