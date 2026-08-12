import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessagesSquare, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InterviewService } from "@/interview.service";
import type {
  QuestionResponse,
  AnswerEvaluationResponse,
  InterviewResponse,
  InterviewReportResponse,
} from "@/types/interview";
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const Route = createFileRoute("/interview")({
  head: () => ({ meta: [{ title: "Behavioral · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <BehavioralPage />
    </AppShell>
  ),
});

function BehavioralPage() {
  const companies = [
    "Amazon",
    "Microsoft",
    "Google",
    "Apple",
    "Meta",
    "Netflix",
    "Adobe",
    "Salesforce",
    "Oracle",
    "IBM",
    "TCS",
    "Infosys",
    "Wipro",
    "Accenture",
    "Deloitte",
    "Other",
  ];

  const jobRoles = [
    "Java Backend Developer",
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "Spring Boot Developer",
    "Python Developer",
    "Data Scientist",
    "Data Analyst",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Software Development Engineer",
    "AI Engineer",
    "Other",
  ];
  const [session, setSession] = useState<InterviewResponse | null>(null);

  const [question, setQuestion] = useState<QuestionResponse | null>(null);

  const [answer, setAnswer] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [companyOther, setCompanyOther] = useState("");
  const [jobRoleOther, setJobRoleOther] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [evaluation, setEvaluation] = useState<AnswerEvaluationResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [error, setError] = useState("");

  const [report, setReport] = useState<InterviewReportResponse | null>(null);

  const [completed, setCompleted] = useState(false);

  const [interviewType, setInterviewType] = useState<"BEHAVIOURAL" | "TECHNICAL">("BEHAVIOURAL");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const submitAnswer = async () => {
    if (!session || !question) return;

    try {
      setSubmitting(true);

      const result = await InterviewService.submitAnswer(
        session.id,

        question.id,

        answer,
      );

      setEvaluation(result);
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = async () => {
    if (!session) return;

    try {
      setQuestionLoading(true);

      const next = await InterviewService.generateQuestion(session.id);

      setQuestion(next);
      setAnswer("");
      setEvaluation(null);
    } catch {
      setError("Unable to load next question.");
    } finally {
      setQuestionLoading(false);
    }
  };

  const generateFollowUp = async () => {
    if (!session || !question) return;

    try {
      setQuestionLoading(true);

      const followUp = await InterviewService.generateFollowUp(session.id, question.id);

      setQuestion(followUp);
      setAnswer("");
      setEvaluation(null);
    } catch {
      setError("Unable to generate follow-up.");
    } finally {
      setQuestionLoading(false);
    }
  };

  const startInterview = async () => {
    const finalCompanyName = companyName === "Other" ? companyOther.trim() : companyName.trim();

    const finalJobRole = jobRole === "Other" ? jobRoleOther.trim() : jobRole.trim();

    if (!finalCompanyName) {
      setError("Please enter the company name.");
      return;
    }

    if (!finalJobRole) {
      setError("Please enter the job role.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    try {
      setLoading(true);

      setQuestion(null);
      setAnswer("");
      setEvaluation(null);
      setReport(null);
      setCompleted(false);
      setError("");

      const interview = await InterviewService.startInterview({
        companyName: finalCompanyName,
        companyWebsite: "",
        jobRole: finalJobRole,
        jobDescription: jobDescription.trim(),
        interviewType,
        difficulty,
      });

      setSession(interview);

      const firstQuestion = await InterviewService.generateQuestion(interview.id);

      setQuestion(firstQuestion);
    } catch (e) {
      setError("Unable to start interview.");
    } finally {
      setLoading(false);
    }
  };

  const finishInterview = async () => {
    if (!session) return;

    try {
      const response = await InterviewService.completeInterview(session.id);

      setReport(response);
      setCompleted(true);
    } catch {
      setError("Unable to complete interview.");
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex h-[70vh] items-center justify-center">Loading interview...</div>
      </AppShell>
    );
  }
  return (
    <AppShell>
      <div className="space-y-6">
        <SectionCard title="Interview Setup" description="Configure your interview">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Company Name */}
            <div>
              <label className="text-sm font-medium">Company Name</label>

              <Select
                value={companyName}
                onValueChange={(value) => {
                  setCompanyName(value);

                  if (value !== "Other") {
                    setCompanyOther("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>

                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {companyName === "Other" && (
                <Input
                  className="mt-2"
                  value={companyOther}
                  onChange={(e) => setCompanyOther(e.target.value)}
                  placeholder="Enter company name"
                />
              )}
            </div>

            {/* Job Role */}
            <div>
              <label className="text-sm font-medium">Job Role</label>

              <Select
                value={jobRole}
                onValueChange={(value) => {
                  setJobRole(value);

                  if (value !== "Other") {
                    setJobRoleOther("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job role" />
                </SelectTrigger>

                <SelectContent>
                  {jobRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {jobRole === "Other" && (
                <Input
                  className="mt-2"
                  value={jobRoleOther}
                  onChange={(e) => setJobRoleOther(e.target.value)}
                  placeholder="Enter job role"
                />
              )}
            </div>

            {/* Interview Type */}
            <div>
              <label className="text-sm font-medium">Interview Type</label>

              <Select
                value={interviewType}
                onValueChange={(value) => setInterviewType(value as "BEHAVIOURAL" | "TECHNICAL")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="BEHAVIOURAL">Behavioral</SelectItem>

                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-sm font-medium">Difficulty</label>

              <Select
                value={difficulty}
                onValueChange={(value) => setDifficulty(value as "EASY" | "MEDIUM" | "HARD")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>

                  <SelectItem value="MEDIUM">Medium</SelectItem>

                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Description */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Job Description</label>

              <Textarea
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="resize-none"
              />
            </div>

            {/* Start Button */}
            <div className="md:col-span-2">
              <Button
                className="w-full"
                onClick={startInterview}
                disabled={
                  loading ||
                  !(companyName && (companyName !== "Other" || companyOther.trim())) ||
                  !(jobRole && (jobRole !== "Other" || jobRoleOther.trim())) ||
                  !jobDescription.trim()
                }
              >
                {loading ? "Starting..." : "Start Interview"}
              </Button>
            </div>
          </div>
        </SectionCard>
        <PageHeader
          eyebrow={interviewType === "BEHAVIOURAL" ? "Behavioral" : "Technical"}
          title={interviewType === "BEHAVIOURAL" ? "Master your story" : "Technical Interview"}
          description={
            interviewType === "BEHAVIOURAL"
              ? "Practice STAR-formatted answers."
              : "Practice technical interview questions."
          }
          actions={
            <Button size="sm" className="gradient-brand text-white">
              <Sparkles className="mr-1.5 size-3.5" />
              AI feedback
            </Button>
          }
        />

        {error && (
          <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-red-600">{error}</div>
        )}

        {session && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <SectionCard title="Interview Progress" description="Current Interview">
              <div className="space-y-4 p-4">
                <div>
                  <div className="text-xs text-muted-foreground">Company</div>

                  <div className="font-medium">{session?.companyName || "Custom Interview"}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Role</div>

                  <div className="font-medium">{session?.jobRole}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Question</div>

                  <div className="font-medium">{question?.questionNumber}</div>
                </div>

                <Badge>{question?.questionType}</Badge>
              </div>
            </SectionCard>

            <div className="space-y-4">
              <SectionCard title="Prompt" description="Answer using the STAR framework">
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <MessagesSquare className="size-3" /> Question {question?.questionNumber}
                  </div>
                  <p className="text-[15px] leading-relaxed">{question?.question}</p>
                </div>
                <div className="space-y-4">
                  <Textarea
                    rows={8}

                    value={answer}

                    onChange={(e) => setAnswer(e.target.value)}

                    placeholder="Answer using STAR..."

                    className="resize-none bg-background/60"
                  />
                  <Button
                    disabled={submitting || answer.trim() === "" || evaluation !== null}
                    onClick={submitAnswer}
                  >
                    <Sparkles className="mr-2 size-4" />

                    {submitting ? "Evaluating..." : "Get AI Feedback"}
                  </Button>
                </div>
              </SectionCard>
              <SectionCard title="AI Coach Feedback" description="Generated by AI">
                {evaluation ? (
                  <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Overall</div>

                        <div className="text-3xl font-bold">{evaluation.score}</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Clarity</div>

                        <div className="text-3xl font-bold">{evaluation.clarity}</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Relevance</div>

                        <div className="text-3xl font-bold">{evaluation.relevance}</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Situation</div>

                        <div className="text-3xl font-bold">{evaluation.starSituation}</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Task</div>

                        <div className="text-3xl font-bold">{evaluation.starTask}</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Action</div>

                        <div className="text-3xl font-bold">{evaluation.starAction}</div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">Result</div>

                        <div className="text-3xl font-bold">{evaluation.starResult}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold">Strengths</h4>

                      <p>{evaluation.strengths}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold">Feedback</h4>

                      <p>{evaluation.feedback}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold">Missing Concepts</h4>

                      <p>{evaluation.missingConcepts}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold">Suggested Answer</h4>

                      <p>{evaluation.suggestedAnswer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    Submit your answer to receive AI feedback.
                  </div>
                )}
              </SectionCard>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  disabled={!evaluation || completed}
                  onClick={generateFollowUp}
                >
                  Generate Follow-up
                </Button>

                <Button onClick={nextQuestion} disabled={!evaluation || completed}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  {questionLoading ? "Loading..." : "Next Question"}
                </Button>

                <Button
                  variant="destructive"
                  disabled={!evaluation || completed}
                  onClick={finishInterview}
                >
                  Finish Interview
                </Button>
              </div>
              {report && (
                <SectionCard title="Interview Report" description="Final AI Evaluation">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold">Overall Score</h4>

                        <p>{report.overallScore}/10</p>
                      </div>

                      <div>
                        <h4 className="font-semibold">Questions Answered</h4>

                        <p>{report.totalQuestions}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold">Strengths</h4>

                      <p>{report.strengths}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold">Improvements</h4>

                      <p>{report.improvements}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold">Recommendation</h4>

                      <p>{report.recommendation}</p>
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
