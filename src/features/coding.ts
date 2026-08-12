export interface CodingResponse {
  solved: number;
  total: number;
  percentage: number;
  topics: Topic[];
}

export interface Topic {
  id: number;
  name: string;
  solved: number;
  total: number;
}

export interface TopicDetails {
  id: number;
  name: string;
  solved: number;
  total: number;
  components: Component[];
}

export interface Component {
  id: number;
  name: string;
  solved: number;
  total: number;
  questions: Question[];
}

export interface Question {
  id: number;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  platform: "LEETCODE" | "GFG";
  problemUrl: string;
  companies: string[];
  solved: boolean;
}

export interface DifficultyProgress {
  easySolved: number;
  easyTotal: number;

  mediumSolved: number;
  mediumTotal: number;

  hardSolved: number;
  hardTotal: number;
}

export interface Progress {
  solved: number;
  total: number;
  percentage: number;
  difficulty: DifficultyProgress;
  topics: Topic[];
}

export interface QuestionPage {
  questions: Question[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CodingCatalog {
  solved: number;
  total: number;
  percentage: number;
  topics: Topic[];
}
