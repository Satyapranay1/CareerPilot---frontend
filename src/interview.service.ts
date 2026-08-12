import { apiFetch } from "@/lib/api";
import type {
  StartInterviewRequest,
  AnswerEvaluationResponse,
  InterviewResponse,
  InterviewReportResponse,
  QuestionResponse,
} from "@/types/interview";

export const InterviewService = {
  async startInterview(data: StartInterviewRequest): Promise<InterviewResponse> {
    const response = await apiFetch("/interviews", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to start interview");
    }

    return response.json();
  },

  async generateQuestion(sessionId: number): Promise<QuestionResponse> {
    const response = await apiFetch(`/interviews/${sessionId}/questions`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to generate question");
    }

    return response.json();
  },

  async submitAnswer(
    sessionId: number,
    questionId: number,
    answer: string,
  ): Promise<AnswerEvaluationResponse> {
    const response = await apiFetch(`/interviews/${sessionId}/questions/${questionId}/answer`, {
      method: "POST",
      body: JSON.stringify({
        answer,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to evaluate answer");
    }

    return response.json();
  },

  async generateFollowUp(sessionId: number, questionId: number): Promise<QuestionResponse> {
    const response = await apiFetch(`/interviews/${sessionId}/questions/${questionId}/follow-up`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to generate follow-up");
    }

    return response.json();
  },

  async completeInterview(sessionId: number): Promise<InterviewReportResponse> {
    const response = await apiFetch(`/interviews/${sessionId}/complete`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to complete interview");
    }

    return response.json();
  },

  async getHistory(): Promise<InterviewResponse[]> {
    const response = await apiFetch("/interviews");

    if (!response.ok) {
      throw new Error("Failed to load interview history");
    }

    return response.json();
  },

  async getInterview(sessionId: number): Promise<InterviewResponse> {
    const response = await apiFetch(`/interviews/${sessionId}`);

    if (!response.ok) {
      throw new Error("Failed to load interview");
    }

    return response.json();
  },

  async getQuestions(sessionId: number): Promise<QuestionResponse[]> {
    const response = await apiFetch(`/interviews/${sessionId}/questions`);

    if (!response.ok) {
      throw new Error("Failed to load questions");
    }

    return response.json();
  },
};
