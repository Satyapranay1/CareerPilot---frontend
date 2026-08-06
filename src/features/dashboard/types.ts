export interface HeroSection {
  fullName: string;
  targetCompany: string;
  targetRole: string;
  dailyRecommendation: string;
  interviewReadiness: number;
  currentStreak: number;
  xp: number;
}

export interface DashboardMetrics {
  atsScore: number;
  resumeQuality: number;
  interviewReadiness: number;
  solvedQuestions: number;
  learningHours: number;
  weeklyProgress: number;
  skillCoverage: number;
  currentStreak: number;
  xp: number;
}

export interface ReadinessTrend {
  date: string;
  readinessScore: number;
  targetScore: number;
}

export interface SkillRadar {
  skill: string;
  score: number;
}

export interface WeeklyActivity {
  day: string;
  solvedProblems: number;
  mockInterviews: number;
  hoursStudied: number;
}

export interface TopicDistribution {
  topic: string;
  value: number;
}

export interface Activity {
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface UpcomingTask {
  task: string;
  priority: string;
  dueDate: string;
  progress: number;
}

export interface Leaderboard {
  userId: number;
  name: string;
  xp: number;
  streak: number;
  rank: number;
  currentUser: boolean;
}

export interface DashboardResponse {
  hero: HeroSection;
  metrics: DashboardMetrics;
  readinessTrend: ReadinessTrend[];
  skillRadar: SkillRadar[];
  weeklyActivity: WeeklyActivity[];
  topicDistribution: TopicDistribution[];
  activities: Activity[];
  upcomingTasks: UpcomingTask[];
}