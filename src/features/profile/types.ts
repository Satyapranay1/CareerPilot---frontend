export interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  grade: string;
}

export interface Experience {
  id: number;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface Skill {
  id: number;
  skillName: string;
}

export interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  shortBio: string;
  role: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}

export interface ExperienceRequest {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  description: string;
};

export interface SkillRequest {
  skillName: string;
}

export interface EducationRequest {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  grade: string;
}