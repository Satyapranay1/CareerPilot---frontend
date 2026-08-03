// Mock data powering the InterviewOS AI UI.

export const currentUser = {
  name: "Alex Chen",
  handle: "@alexchen",
  email: "alex.chen@interviewos.ai",
  role: "Senior Software Engineer",
  avatarInitials: "AC",
  plan: "Pro",
  streak: 34,
  xp: 12480,
};

export const metrics = {
  atsScore: 87,
  interviewReadiness: 74,
  problemsSolved: 342,
  learningHours: 128,
  resumeQuality: 92,
  skillCoverage: 81,
  weeklyProgress: 68,
};

export const weeklyActivity = [
  { day: "Mon", problems: 8, minutes: 42, mock: 0 },
  { day: "Tue", problems: 12, minutes: 65, mock: 1 },
  { day: "Wed", problems: 6, minutes: 38, mock: 0 },
  { day: "Thu", problems: 14, minutes: 82, mock: 1 },
  { day: "Fri", problems: 9, minutes: 55, mock: 0 },
  { day: "Sat", problems: 18, minutes: 120, mock: 2 },
  { day: "Sun", problems: 11, minutes: 74, mock: 1 },
];

export const readinessTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  score: Math.round(40 + i * 1.2 + Math.sin(i / 2) * 6),
  target: 80,
}));

export const skillRadar = [
  { skill: "DSA", value: 82, target: 90 },
  { skill: "System Design", value: 68, target: 85 },
  { skill: "Behavioral", value: 74, target: 80 },
  { skill: "Frontend", value: 91, target: 90 },
  { skill: "Backend", value: 77, target: 85 },
  { skill: "DevOps", value: 55, target: 70 },
];

export const topicDistribution = [
  { name: "Arrays", value: 78, color: "var(--chart-1)" },
  { name: "Graphs", value: 42, color: "var(--chart-2)" },
  { name: "DP", value: 36, color: "var(--chart-3)" },
  { name: "Trees", value: 58, color: "var(--chart-4)" },
  { name: "Design", value: 24, color: "var(--chart-5)" },
];

export const activities = [
  { id: 1, kind: "resume", title: "Uploaded Resume v7 — Senior FE", meta: "ATS 87 · 2m ago", tag: "Resume" },
  { id: 2, kind: "mock", title: "Mock interview with AI Coach", meta: "System Design · 42 min · Score 8.4/10", tag: "Mock" },
  { id: 3, kind: "problem", title: "Solved “Course Schedule II”", meta: "Graphs · Medium · O(V+E)", tag: "Coding" },
  { id: 4, kind: "learning", title: "Completed module: Distributed Caching", meta: "System Design track · 38 min", tag: "Learning" },
  { id: 5, kind: "goal", title: "Reached weekly goal: 60 problems", meta: "Streak +1 · 34 days", tag: "Goal" },
  { id: 6, kind: "resume", title: "AI suggested 6 improvements", meta: "Impact · Metrics · Keywords", tag: "AI" },
];

export const upcomingTasks = [
  { id: 1, title: "Behavioral: Tell me about a conflict", due: "Today", priority: "High" },
  { id: 2, title: "System Design: Design Twitter feed", due: "Tomorrow", priority: "High" },
  { id: 3, title: "Coding: 5 hard DP problems", due: "Wed", priority: "Medium" },
  { id: 4, title: "Mock interview — Google L5", due: "Fri", priority: "High" },
  { id: 5, title: "Refresh resume metrics section", due: "Sat", priority: "Low" },
];

export const companies = [
  { id: "google", name: "Google", tier: "FAANG", rating: 4.6, difficulty: 4.5, openRoles: 128, focus: ["System Design", "DSA", "Behavioral"], color: "oklch(0.7 0.18 60)" },
  { id: "meta", name: "Meta", tier: "FAANG", rating: 4.4, difficulty: 4.4, openRoles: 96, focus: ["Product Sense", "DSA", "System Design"], color: "oklch(0.65 0.2 250)" },
  { id: "apple", name: "Apple", tier: "FAANG", rating: 4.5, difficulty: 4.2, openRoles: 74, focus: ["Domain Depth", "DSA"], color: "oklch(0.85 0.02 260)" },
  { id: "netflix", name: "Netflix", tier: "FAANG", rating: 4.3, difficulty: 4.6, openRoles: 32, focus: ["Culture", "System Design"], color: "oklch(0.6 0.22 20)" },
  { id: "amazon", name: "Amazon", tier: "FAANG", rating: 4.1, difficulty: 4.0, openRoles: 214, focus: ["Leadership Principles", "DSA"], color: "oklch(0.78 0.16 65)" },
  { id: "stripe", name: "Stripe", tier: "Top Startup", rating: 4.7, difficulty: 4.3, openRoles: 58, focus: ["Practical Coding", "System Design"], color: "oklch(0.62 0.18 285)" },
  { id: "linear", name: "Linear", tier: "Top Startup", rating: 4.8, difficulty: 4.1, openRoles: 12, focus: ["Craft", "Frontend"], color: "oklch(0.68 0.15 285)" },
  { id: "vercel", name: "Vercel", tier: "Top Startup", rating: 4.7, difficulty: 4.0, openRoles: 24, focus: ["Frontend", "DX"], color: "oklch(0.9 0.005 260)" },
  { id: "openai", name: "OpenAI", tier: "AI", rating: 4.6, difficulty: 4.7, openRoles: 41, focus: ["ML", "Research", "System Design"], color: "oklch(0.72 0.12 155)" },
  { id: "anthropic", name: "Anthropic", tier: "AI", rating: 4.7, difficulty: 4.6, openRoles: 28, focus: ["ML", "Safety"], color: "oklch(0.74 0.14 55)" },
];

export const roles = [
  { id: "swe-l5", name: "Senior Software Engineer", level: "L5 / IC4", salary: "$220k – $340k", demand: "High", skills: ["System Design", "DSA", "Leadership"] },
  { id: "swe-l4", name: "Software Engineer", level: "L4 / IC3", salary: "$180k – $260k", demand: "High", skills: ["DSA", "Design", "Testing"] },
  { id: "fe-l5", name: "Senior Frontend Engineer", level: "L5", salary: "$210k – $320k", demand: "High", skills: ["React", "Perf", "Design Systems"] },
  { id: "be-l5", name: "Senior Backend Engineer", level: "L5", salary: "$215k – $330k", demand: "High", skills: ["Distributed", "DB", "APIs"] },
  { id: "mle-l5", name: "Senior ML Engineer", level: "L5", salary: "$240k – $400k", demand: "Very High", skills: ["PyTorch", "MLOps", "Math"] },
  { id: "sre-l5", name: "Senior SRE", level: "L5", salary: "$220k – $340k", demand: "Medium", skills: ["K8s", "Observability", "Incident"] },
  { id: "em", name: "Engineering Manager", level: "M1 / M2", salary: "$260k – $420k", demand: "High", skills: ["People", "Delivery", "Strategy"] },
  { id: "staff", name: "Staff Engineer", level: "L6 / IC5", salary: "$320k – $520k", demand: "Medium", skills: ["Cross-team", "Architecture"] },
];

export const problems = [
  { id: 1, title: "Two Sum", topic: "Arrays", difficulty: "Easy", status: "Solved", time: "6m", acceptance: "51%" },
  { id: 2, title: "Course Schedule II", topic: "Graphs", difficulty: "Medium", status: "Solved", time: "22m", acceptance: "48%" },
  { id: 3, title: "LRU Cache", topic: "Design", difficulty: "Medium", status: "Solved", time: "31m", acceptance: "42%" },
  { id: 4, title: "Word Ladder", topic: "BFS", difficulty: "Hard", status: "Attempted", time: "48m", acceptance: "37%" },
  { id: 5, title: "Merge k Sorted Lists", topic: "Heap", difficulty: "Hard", status: "Solved", time: "27m", acceptance: "50%" },
  { id: 6, title: "Serialize Binary Tree", topic: "Trees", difficulty: "Hard", status: "Bookmarked", time: "—", acceptance: "56%" },
  { id: 7, title: "Longest Increasing Subseq.", topic: "DP", difficulty: "Medium", status: "Solved", time: "19m", acceptance: "55%" },
  { id: 8, title: "Median of Two Sorted Arrays", topic: "Binary Search", difficulty: "Hard", status: "Attempted", time: "52m", acceptance: "38%" },
  { id: 9, title: "Number of Islands", topic: "Graphs", difficulty: "Medium", status: "Solved", time: "14m", acceptance: "58%" },
  { id: 10, title: "Rotate Image", topic: "Matrix", difficulty: "Medium", status: "Solved", time: "11m", acceptance: "72%" },
  { id: 11, title: "Design Twitter", topic: "Design", difficulty: "Medium", status: "Bookmarked", time: "—", acceptance: "39%" },
  { id: 12, title: "Trapping Rain Water", topic: "Two Pointers", difficulty: "Hard", status: "Solved", time: "34m", acceptance: "60%" },
];

export const behavioralQuestions = [
  { id: 1, q: "Tell me about a time you handled a conflict on your team.", tag: "Conflict", level: "Senior" },
  { id: 2, q: "Describe a project you're most proud of.", tag: "Pride", level: "All" },
  { id: 3, q: "How do you prioritize competing deadlines?", tag: "Prioritization", level: "All" },
  { id: 4, q: "Tell me about a time you failed and what you learned.", tag: "Failure", level: "Senior" },
  { id: 5, q: "How did you influence a decision without authority?", tag: "Leadership", level: "Staff" },
  { id: 6, q: "Describe your most impactful technical decision.", tag: "Impact", level: "Staff" },
];

export const resumeHistory = [
  { id: 1, name: "Resume v7 — Senior FE.pdf", uploaded: "Today, 09:41", ats: 87, size: "182 KB", role: "Senior Frontend" },
  { id: 2, name: "Resume v6 — Fullstack.pdf", uploaded: "Aug 12", ats: 81, size: "168 KB", role: "Fullstack" },
  { id: 3, name: "Resume v5 — Google L5.pdf", uploaded: "Aug 02", ats: 74, size: "175 KB", role: "SWE L5" },
  { id: 4, name: "Resume v4 — General.pdf", uploaded: "Jul 24", ats: 68, size: "160 KB", role: "General" },
];

export const heatmap = Array.from({ length: 7 * 24 }, (_, i) => ({
  x: i % 24,
  y: Math.floor(i / 24),
  v: Math.max(0, Math.round(Math.sin(i / 5) * 8 + Math.random() * 10)),
}));

export const leaderboard = [
  { rank: 1, name: "Priya S.", xp: 24810, streak: 92 },
  { rank: 2, name: "Marcus L.", xp: 21200, streak: 71 },
  { rank: 3, name: "Alex Chen", xp: 18540, streak: 34, me: true },
  { rank: 4, name: "Dana K.", xp: 17110, streak: 26 },
  { rank: 5, name: "Wen H.", xp: 15980, streak: 48 },
];

export const notifications = [
  { id: 1, title: "AI Coach is ready", body: "Your personalized roadmap for Google L5 is updated.", time: "2m", unread: true },
  { id: 2, title: "Resume analyzed", body: "Your latest resume scored 87 ATS — 4 quick wins available.", time: "1h", unread: true },
  { id: 3, title: "Streak milestone", body: "You hit a 34 day streak. Keep it going!", time: "1d", unread: false },
  { id: 4, title: "New mock interview", body: "Weekly Google L5 mock is scheduled for Friday 5pm.", time: "2d", unread: false },
];