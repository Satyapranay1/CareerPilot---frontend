export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type Platform = "LEETCODE" | "GFG";

/* =========================
   BASIC TOPIC
========================= */

export interface Topic {
  id: number;
  name: string;
  solved: number;
  total: number;
}

/* =========================
   QUESTION
========================= */

export interface Question {
  id: number;
  title: string;
  difficulty: Difficulty;
  platform: Platform;
  problemUrl: string;
  companies: string[];
  solved: boolean;
}

/* =========================
   COMPONENT / SUBTOPIC
========================= */

export interface Component {
  id: number;
  name: string;
  solved: number;
  total: number;
  questions: Question[];
}

/* =========================
   TOPIC DETAILS
========================= */

export interface TopicDetails {
  id: number;
  name: string;
  solved: number;
  total: number;
  components: Component[];
}

/* =========================
   DIFFICULTY PROGRESS
========================= */

export interface DifficultyProgress {
  easySolved: number;
  easyTotal: number;

  mediumSolved: number;
  mediumTotal: number;

  hardSolved: number;
  hardTotal: number;
}

/* =========================
   OVERALL PROGRESS
========================= */

export interface Progress {
  solved: number;
  total: number;
  percentage: number;

  difficulty: DifficultyProgress;

  topics: Topic[];
}

/* =========================
   PAGINATED QUESTIONS
========================= */

export interface QuestionPage {
  questions: Question[];

  page: number;
  size: number;

  totalElements: number;
  totalPages: number;
}

/* =========================
   CODING CATALOG
========================= */

export interface CodingCatalog {
  solved: number;
  total: number;
  percentage: number;

  topics: Topic[];
}

/* =========================
   CODING RESPONSE
========================= */

export interface CodingResponse {
  solved: number;
  total: number;
  percentage: number;

  topics: Topic[];
}