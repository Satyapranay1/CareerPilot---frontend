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

/* =========================
   ROLE FIT
========================= */

export interface RoleFit {
  score?: number;
  level?: string;
  explanation?: string;
}

/* =========================
   TECHNOLOGIES
========================= */

export interface Technologies {
  programmingLanguages?: string[];
  frameworks?: string[];
  databases?: string[];
  cloud?: string[];
  devOps?: string[];
  testing?: string[];
  tools?: string[];
  other?: string[];
}

/* =========================
   SKILL MATCH
========================= */

export interface SkillMatch {
  skill?: string;
  score?: number;
  evidence?: string;
}

/* =========================
   SKILL GAPS
========================= */

export interface SkillGap {
  skill?: string;
  importance?: string;
  reason?: string;
  recommendation?: string;
}

/* =========================
   SKILL CATEGORIES
========================= */

export interface SkillCategory {
  category?: string;
  score?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
}

/* =========================
   PROJECT ANALYSIS
========================= */

export interface ProjectAnalysis {
  project?: string;
  relevance?: number;
  strengths?: string[];
  weaknesses?: string[];
  missingDetails?: string[];
  recommendations?: string[];
}

/* =========================
   EXPERIENCE ANALYSIS
========================= */

export interface ExperienceAnalysis {
  company?: string;
  role?: string;
  relevance?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

/* =========================
   ACHIEVEMENT ANALYSIS
========================= */

export interface AchievementAnalysis {
  achievement?: string;
  impact?: number;
  strengths?: string[];
  recommendations?: string[];
}

/* =========================
   ATS ANALYSIS
========================= */

export interface AtsAnalysis {
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  keywordCoverage?: number;
}

/* =========================
   SECTION ANALYSIS
========================= */

export interface SectionAnalysis {
  section?: string;
  score?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

/* =========================
   BULLET ANALYSIS
========================= */

export interface BulletAnalysis {
  original?: string;
  improved?: string;
  issue?: string;
  impact?: string;
}

/* =========================
   CAREER LEVEL
========================= */

export interface CareerLevel {
  level?: string;
  confidence?: number;
  explanation?: string;
}

/* =========================
   RECRUITER IMPRESSION
========================= */

export interface RecruiterImpression {
  firstImpression?: string;
  positives?: string[];
  concerns?: string[];
  hiringLikelihood?: number;
}

/* =========================
   INTERVIEW READINESS
========================= */

export interface InterviewReadiness {
  score?: number;
  strengths?: string[];
  technicalTopics?: string[];
  projectTopics?: string[];
  behavioralTopics?: string[];
  preparationSuggestions?: string[];
}

/* =========================
   ACTION PLAN
========================= */

export interface ActionPlan {
  immediate?: string[];
  shortTerm?: string[];
  mediumTerm?: string[];
}

/* =========================
   PRIORITY MATRIX
========================= */

export interface PriorityItem {
  item?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW" | string;
  impact?: string;
  effort?: string;
  recommendation?: string;
}

/* =========================
   AI ANALYSIS
========================= */

export interface ResumeAIAnalysis {
  knowledgeSource?: string;

  summary?: string;

  atsScore?: number;

  scores?: ResumeScores;

  /* Role-specific analysis */
  roleFit?: RoleFit;

  roleRelevantSkills?: string[];

  missingRoleSkills?: string[];

  roleSpecificInsights?: string[];

  /* Skills */
  technologies?: Technologies;

  skillMatch?: SkillMatch[];

  skillGaps?: SkillGap[];

  skillCategories?: SkillCategory[];

  /* Resume quality */
  strongAreas?: string[];

  weakAreas?: string[];

  /* ATS */
  missingKeywords?: string[];

  missingSkills?: string[];

  atsAnalysis?: AtsAnalysis;

  /* Experience / Projects */
  projectAnalysis?: ProjectAnalysis[];

  experienceAnalysis?: ExperienceAnalysis[];

  achievementAnalysis?: AchievementAnalysis[];

  /* Resume sections */
  sectionAnalysis?: SectionAnalysis[];

  bulletAnalysis?: BulletAnalysis[];

  /* Candidate assessment */
  careerLevel?: CareerLevel;

  recruiterImpression?: RecruiterImpression;

  interviewReadiness?: InterviewReadiness;

  /* Recommendations */
  improvementSuggestions?: string[];

  redFlags?: string[];

  priorityMatrix?: PriorityItem[];

  actionPlan?: ActionPlan;
}

/* =========================
   RESUME ANALYSIS DTO
   GET /resumes/{id}
========================= */

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

/* =========================
   RESUME UPLOAD RESPONSE
========================= */

export interface ResumeResponse {
  knowledgeSource?: string;

  summary?: string;

  atsScore?: number;

  scores?: ResumeScores;

  strongAreas?: string[];

  weakAreas?: string[];

  missingKeywords?: string[];

  missingSkills?: string[];

  improvementSuggestions?: string[];

  roleRelevantSkills?: string[];

  missingRoleSkills?: string[];

  roleSpecificInsights?: string[];

  roleFit?: RoleFit;

  technologies?: Technologies;

  skillMatch?: SkillMatch[];

  skillGaps?: SkillGap[];

  skillCategories?: SkillCategory[];

  projectAnalysis?: ProjectAnalysis[];

  experienceAnalysis?: ExperienceAnalysis[];

  achievementAnalysis?: AchievementAnalysis[];

  atsAnalysis?: AtsAnalysis;

  sectionAnalysis?: SectionAnalysis[];

  bulletAnalysis?: BulletAnalysis[];

  careerLevel?: CareerLevel;

  recruiterImpression?: RecruiterImpression;

  interviewReadiness?: InterviewReadiness;

  redFlags?: string[];

  priorityMatrix?: PriorityItem[];

  actionPlan?: ActionPlan;
}