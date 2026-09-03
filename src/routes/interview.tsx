import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Building2,
  BriefcaseBusiness,
  ChevronRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  History,
  Lightbulb,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { InterviewService } from "@/interview.service";
import type {
  QuestionResponse,
  AnswerEvaluationResponse,
  InterviewResponse,
  InterviewReportResponse,
} from "@/types/interview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [{ title: "Interview · InterviewOS AI" }],
  }),
  component: () => (
    <AppShell>
      <InterviewPage />
    </AppShell>
  ),
});

type InterviewType = "BEHAVIOURAL" | "TECHNICAL" | "MIXED";
type Difficulty = "EASY" | "MEDIUM" | "HARD";

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

function InterviewPage() {
  const [history, setHistory] = useState<InterviewResponse[]>([]);

  const [session, setSession] = useState<InterviewResponse | null>(null);
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [historyAttempts, setHistoryAttempts] =
  useState<AnswerEvaluationResponse[]>([]);

  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] =
    useState<AnswerEvaluationResponse | null>(null);

  const [report, setReport] =
    useState<InterviewReportResponse | null>(null);
    const [historyDetails, setHistoryDetails] =
  useState<InterviewResponse | null>(null);
  const [historyQuestions, setHistoryQuestions] =
  useState<QuestionResponse[]>([]);

const [selectedHistoryQuestion, setSelectedHistoryQuestion] =
  useState<QuestionResponse | null>(null);

const [historyEvaluation, setHistoryEvaluation] =
  useState<AnswerEvaluationResponse | null>(null);

  const [selectedHistoryId, setSelectedHistoryId] =
  useState<number | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [companyOther, setCompanyOther] = useState("");

  const [companyWebsite, setCompanyWebsite] = useState("");

  const [jobRole, setJobRole] = useState("");
  const [jobRoleOther, setJobRoleOther] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const [interviewType, setInterviewType] =
    useState<InterviewType>("BEHAVIOURAL");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("MEDIUM");

  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  const [completed, setCompleted] = useState(false);

  const finalCompany =
    companyName === "Other"
      ? companyOther.trim()
      : companyName.trim();

  const finalJobRole =
    jobRole === "Other"
      ? jobRoleOther.trim()
      : jobRole.trim();

  const answeredQuestions = evaluation
    ? questions.length
    : Math.max(questions.length - 1, 0);

  const progress = useMemo(() => {
    if (!question) return 0;

    return Math.min(
      100,
      Math.max(
        8,
        (question.questionNumber / Math.max(10, question.questionNumber + 2)) *
          100
      )
    );
  }, [question]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);

      const result = await InterviewService.getHistory();

      setHistory(result);
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadInterview = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const interview = await InterviewService.getInterview(id);

      setSession(interview);

      if (interview.status === "COMPLETED") {
        setCompleted(true);
        return;
      }

      const previousQuestions =
        await InterviewService.getQuestions(id);

      setQuestions(previousQuestions);

      const lastQuestion =
        previousQuestions[previousQuestions.length - 1];

      if (lastQuestion) {
        setQuestion(lastQuestion);
      } else {
        const firstQuestion =
          await InterviewService.generateQuestion(id);

        setQuestion(firstQuestion);
        setQuestions([firstQuestion]);
      }
    } catch (e) {
      console.error(e);
      setError("Unable to load this interview.");
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    setError("");

    if (!finalCompany) {
      setError("Please select or enter a company.");
      return;
    }

    if (!finalJobRole) {
      setError("Please select or enter a job role.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please provide the job description.");
      return;
    }

    try {
      setLoading(true);

      const interview =
        await InterviewService.startInterview({
          companyName: finalCompany,
          companyWebsite: companyWebsite.trim(),
          jobRole: finalJobRole,
          jobDescription: jobDescription.trim(),
          interviewType,
          difficulty,
        });

      setSession(interview);
      setQuestions([]);
      setQuestion(null);
      setAnswer("");
      setEvaluation(null);
      setReport(null);
      setCompleted(false);

      const firstQuestion =
        await InterviewService.generateQuestion(interview.id);

      setQuestion(firstQuestion);
      setQuestions([firstQuestion]);

      await loadHistory();
    } catch (e) {
      console.error(e);
      setError("Unable to start interview.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!session || !question) return;

    if (!answer.trim()) {
      setError("Please write your answer before submitting.");
      return;
    }

    try {
      setError("");
      setSubmitting(true);

      const result =
        await InterviewService.submitAnswer(
          session.id,
          question.id,
          answer.trim()
        );

      setEvaluation(result);
    } catch (e) {
      console.error(e);
      setError("Unable to evaluate your answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = async () => {
    if (!session) return;

    try {
      setError("");
      setQuestionLoading(true);

      const next =
        await InterviewService.generateQuestion(
          session.id
        );

      setQuestion(next);
      setQuestions((previous) => [...previous, next]);
      setAnswer("");
      setEvaluation(null);
    } catch (e) {
      console.error(e);
      setError(
        "Unable to generate the next question. Make sure the current answer has been submitted."
      );
    } finally {
      setQuestionLoading(false);
    }
  };

  const generateFollowUp = async () => {
    if (!session || !question) return;

    if (!evaluation) {
      setError("Submit your answer before requesting a follow-up.");
      return;
    }

    try {
      setError("");
      setQuestionLoading(true);

      const followUp =
        await InterviewService.generateFollowUp(
          session.id,
          question.id
        );

      setQuestion(followUp);
      setQuestions((previous) => [...previous, followUp]);

      setAnswer("");
      setEvaluation(null);
    } catch (e) {
      console.error(e);
      setError("Unable to generate follow-up.");
    } finally {
      setQuestionLoading(false);
    }
  };

  const finishInterview = async () => {
    if (!session) return;

    if (!evaluation) {
      setError("Submit the current answer before completing the interview.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result =
        await InterviewService.completeInterview(
          session.id
        );

      setReport(result);
      setCompleted(true);

      setSession({
        ...session,
        status: "COMPLETED",
        overallScore: result.overallScore,
      });

      await loadHistory();
    } catch (e) {
      console.error(e);
      setError("Unable to complete interview.");
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setSession(null);
    setQuestion(null);
    setQuestions([]);
    setEvaluation(null);
    setReport(null);
    setAnswer("");
    setCompleted(false);
    setError("");
  };

  const openInterviewHistory = async (id: number) => {
  try {
    setHistoryLoading(true);
    setError("");

    const [interview, previousQuestions, attempts] =
      await Promise.all([
        InterviewService.getInterview(id),
        InterviewService.getQuestions(id),
        InterviewService.getAttempts(id),
      ]);

    setHistoryDetails(interview);
    setSelectedHistoryId(id);
    setHistoryQuestions(previousQuestions);

    setHistoryAttempts(attempts);

    setSelectedHistoryQuestion(null);
    setHistoryEvaluation(null);
  } catch (error) {
    console.error(error);
    setError("Unable to load interview details.");
  } finally {
    setHistoryLoading(false);
  }
};

const closeInterviewHistory = () => {
  setSelectedHistoryId(null);
  setHistoryDetails(null);
  setHistoryQuestions([]);
  setSelectedHistoryQuestion(null);
  setHistoryEvaluation(null);
  setError("");
};

const openHistoryQuestion = (
  selectedQuestion: QuestionResponse
) => {
  setSelectedHistoryQuestion(selectedQuestion);

  const attempt = historyAttempts.find(
    (item) =>
      item.questionId === selectedQuestion.id
  );

  setHistoryEvaluation(attempt ?? null);
};

  const score = evaluation?.score ?? 0;

  const scoreTone =
    score >= 8
      ? "text-success"
      : score >= 6
        ? "text-warning"
        : "text-destructive";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interview"
        title="AI mock interview"
        description="Practice realistic interviews with adaptive questions, instant AI feedback and a final performance report."
        actions={
          session && !completed ? (
            <Button
              variant="outline"
              onClick={resetInterview}
            >
              <RotateCcw className="mr-2 size-4" />
              New interview
            </Button>
          ) : null
        }
      />

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!session && !report && (
        <>
          {/* HERO */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.10] via-transparent to-transparent" />

            <div className="relative grid gap-6 p-6 lg:grid-cols-[1.3fr_.7fr] lg:p-8">
              <div>
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-primary"
                >
                  <Sparkles className="mr-1.5 size-3.5" />
                  AI-powered interview
                </Badge>

                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight">
                  Practice like the real interview.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Questions adapt to your role, interview type, difficulty,
                  company context and previous answers.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Feature
                    icon={Brain}
                    title="Adaptive"
                    text="Questions evolve with you"
                  />

                  <Feature
                    icon={Target}
                    title="Role focused"
                    text="Based on your target role"
                  />

                  <Feature
                    icon={Sparkles}
                    title="AI feedback"
                    text="Detailed answer analysis"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 self-center">
                <MiniStat
                  icon={MessageSquare}
                  value="AI"
                  label="Live evaluation"
                />

                <MiniStat
                  icon={Zap}
                  value="Adaptive"
                  label="Question flow"
                />

                <MiniStat
                  icon={Trophy}
                  value="10+"
                  label="Evaluation signals"
                />

                <MiniStat
                  icon={History}
                  value="Saved"
                  label="Interview history"
                />
              </div>
            </div>
          </div>

          {/* SETUP */}
          <SectionCard
            title="Interview setup"
            description="Configure your interview before you begin"
          >
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Company name" required>
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
                        <SelectItem
                          key={company}
                          value={company}
                        >
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {companyName === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="Enter company name"
                      value={companyOther}
                      onChange={(e) =>
                        setCompanyOther(e.target.value)
                      }
                    />
                  )}
                </Field>

                <Field label="Job role" required>
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
                        <SelectItem
                          key={role}
                          value={role}
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {jobRole === "Other" && (
                    <Input
                      className="mt-2"
                      placeholder="Enter job role"
                      value={jobRoleOther}
                      onChange={(e) =>
                        setJobRoleOther(e.target.value)
                      }
                    />
                  )}
                </Field>

                <Field label="Company website">
                  <Input
                    placeholder="https://company.com"
                    value={companyWebsite}
                    onChange={(e) =>
                      setCompanyWebsite(e.target.value)
                    }
                  />
                </Field>

                <Field label="Interview type">
                  <Select
                    value={interviewType}
                    onValueChange={(value) =>
                      setInterviewType(
                        value as InterviewType
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="BEHAVIOURAL">
                        Behavioural
                      </SelectItem>
                      <SelectItem value="TECHNICAL">
                        Technical
                      </SelectItem>
                      <SelectItem value="MIXED">
                        Mixed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Difficulty">
                  <Select
                    value={difficulty}
                    onValueChange={(value) =>
                      setDifficulty(
                        value as Difficulty
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="EASY">
                        Easy
                      </SelectItem>
                      <SelectItem value="MEDIUM">
                        Medium
                      </SelectItem>
                      <SelectItem value="HARD">
                        Hard
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field
                label="Job description"
                required
                hint="The AI uses this to make the interview more relevant to the role."
              >
                <Textarea
                  className="min-h-[150px] resize-none"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) =>
                    setJobDescription(e.target.value)
                  }
                />
              </Field>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  className="min-w-[190px]"
                  onClick={startInterview}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Starting...
                    </>
                  ) : (
                    <>
                      Start interview
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* HISTORY */}
          <SectionCard
            title="Interview history"
            description="Your previous interview sessions"
          >
            {historyLoading ? (
              <LoadingBlock />
            ) : history.length === 0 ? (
              <EmptyHistory />
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadInterview(item.id)}
                    className="group flex w-full items-center gap-4 rounded-xl border border-border/70 bg-muted/10 p-4 text-left transition hover:border-primary/40 hover:bg-primary/[0.03]"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <MessageSquare className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">
                          {item.jobRole}
                        </span>

                        <Badge
                          variant="outline"
                          className="text-[10px]"
                        >
                          {item.interviewType}
                        </Badge>

                        <Badge
                          variant="outline"
                          className="text-[10px]"
                        >
                          {item.difficulty}
                        </Badge>
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{item.companyName}</span>
                        <span>
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold tabular-nums">
                        {item.overallScore != null
                          ? item.overallScore.toFixed(1)
                          : "—"}
                      </div>

                      <div className="text-[10px] text-muted-foreground">
                        Score
                      </div>
                    </div>

                    <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            )}
          </SectionCard>
        </>
      )}

      {session && !completed && (
        <>
          {/* INTERVIEW HEADER */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BriefcaseBusiness className="size-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">
                      {session.jobRole}
                    </h2>

                    <Badge variant="outline">
                      {session.companyName}
                    </Badge>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>
                      {session.interviewType}
                    </span>
                    <span>•</span>
                    <span>
                      {session.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock3 className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Question
                </span>
                <span className="font-semibold">
                  {question?.questionNumber ?? 1}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Interview progress
                </span>
                <span className="font-medium">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* MAIN INTERVIEW */}
            <div className="space-y-4">
              <SectionCard
                title={`Question ${question?.questionNumber ?? 1}`}
                description={
                  question?.topic
                    ? `Topic · ${question.topic}`
                    : "AI-generated interview question"
                }
              >
                {questionLoading ? (
                  <div className="flex min-h-[280px] items-center justify-center">
                    <LoadingBlock />
                  </div>
                ) : question ? (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                          {question.type}
                        </Badge>

                        {question.topic && (
                          <Badge variant="outline">
                            {question.topic}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold leading-8">
                        {question.question}
                      </h3>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium">
                          Your answer
                        </label>

                        <span className="text-xs text-muted-foreground">
                          {answer.length} characters
                        </span>
                      </div>

                      <Textarea
                        value={answer}
                        onChange={(e) =>
                          setAnswer(e.target.value)
                        }
                        disabled={!!evaluation}
                        placeholder={
                          question.type === "BEHAVIOURAL"
                            ? "Structure your response using Situation → Task → Action → Result..."
                            : "Explain your approach, reasoning, implementation details and trade-offs..."
                        }
                        className="min-h-[220px] resize-none"
                      />
                    </div>

                    {!evaluation ? (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={submitAnswer}
                        disabled={
                          submitting ||
                          !answer.trim()
                        }
                      >
                        {submitting ? (
                          <>
                            <Spinner />
                            AI is evaluating...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 size-4" />
                            Submit answer
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          className="flex-1"
                          onClick={nextQuestion}
                          disabled={questionLoading}
                        >
                          Next question
                          <ChevronRight className="ml-2 size-4" />
                        </Button>

                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={generateFollowUp}
                          disabled={questionLoading}
                        >
                          <Sparkles className="mr-2 size-4" />
                          Follow-up
                        </Button>

                        <Button
                          variant="outline"
                          onClick={finishInterview}
                          disabled={loading}
                        >
                          Finish
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-16 text-center text-sm text-muted-foreground">
                    No question available.
                  </div>
                )}
              </SectionCard>

              {/* EVALUATION */}
              {evaluation && (
                <EvaluationPanel evaluation={evaluation} />
              )}
            </div>

            {/* QUESTION SIDEBAR */}
            <div className="space-y-4">
              <SectionCard
                title="Interview flow"
                description="Questions generated in this session"
              >
                {questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No questions yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {questions.map((item) => {
                      const questionKey = String(
                        (item as any).questionId ?? item.id
                      );
                      const active =
                        questionKey ===
                        String((question as any)?.questionId ?? question?.id ?? "");

                      return (
                        <div
                          key={questionKey}
                          className={`rounded-lg border p-3 transition ${
                            active
                              ? "border-primary/40 bg-primary/[0.05]"
                              : "border-border/60"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {item.questionNumber}
                            </span>

                            <div className="min-w-0">
                              <div className="line-clamp-2 text-sm font-medium">
                                {item.question}
                              </div>

                              <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                                {item.type}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>

              <SectionCard
                title="Interview tips"
                description="Use these while answering"
              >
                <div className="space-y-3">
                  <Tip
                    icon={Target}
                    title="Stay relevant"
                    text="Answer the exact question before adding extra context."
                  />

                  <Tip
                    icon={Sparkles}
                    title="Be specific"
                    text="Use real examples, technologies and measurable outcomes."
                  />

                  <Tip
                    icon={MessageSquare}
                    title="Explain clearly"
                    text="Keep your reasoning structured and easy to follow."
                  />
                </div>
              </SectionCard>
            </div>
          </div>
        </>
      )}

      {completed && (
        <ReportPanel
          report={report}
          session={session}
          onNewInterview={resetInterview}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function EvaluationPanel({
  evaluation,
}: {
  evaluation: AnswerEvaluationResponse;
}) {
  const metrics: Array<[string, number | null | undefined]> = [
    ["Correctness", evaluation.correctness],
    ["Completeness", evaluation.completeness],
    ["Clarity", evaluation.clarity],
    ["Depth", evaluation.depth],
    ["Relevance", evaluation.relevance],
  ];

  const starMetrics: Array<[string, number | null | undefined]> = [
    ["Situation", evaluation.starSituation],
    ["Task", evaluation.starTask],
    ["Action", evaluation.starAction],
    ["Result", evaluation.starResult],
  ];

  return (
    <SectionCard
      title="AI answer evaluation"
      description="Detailed feedback on your response"
    >
      <div className="space-y-6">
        {/* SCORE */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/10 p-5 sm:flex-row sm:items-center">
          <div className="grid size-20 shrink-0 place-items-center rounded-full border-4 border-primary/20 bg-primary/5">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatScore(evaluation.score)}
              </div>
              <div className="text-[9px] text-muted-foreground">
                / 10
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              Your answer score
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              The score considers correctness, completeness,
              clarity, depth and relevance.
            </p>
          </div>
        </div>

        {/* METRICS */}
        <div>
          <div className="mb-3 text-sm font-semibold">
            Performance breakdown
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {metrics.map(([label, value]) => (
              <ScoreMetric
                key={label}
                label={label}
                value={value}
              />
            ))}
          </div>
        </div>

        {/* STAR */}
        {(evaluation.starSituation != null ||
          evaluation.starTask != null ||
          evaluation.starAction != null ||
          evaluation.starResult != null) && (
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Target className="size-4 text-primary" />
              STAR analysis
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {starMetrics.map(([label, value]) => (
                <ScoreMetric
                  key={label}
                  label={label}
                  value={value}
                />
              ))}
            </div>
          </div>
        )}

        {/* FEEDBACK GRID */}
        <div className="grid gap-4 md:grid-cols-2">
          <InsightBox
            icon={CheckCircle2}
            title="Strengths"
            text={evaluation.strengths}
            tone="success"
          />

          <InsightBox
            icon={CircleAlert}
            title="Missing concepts"
            text={evaluation.missingConcepts}
            tone="warning"
          />
        </div>

        {/* FEEDBACK */}
        <div className="rounded-xl border border-border bg-muted/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" />
            AI feedback
          </div>

          <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {evaluation.feedback ||
              "No detailed feedback available."}
          </p>
        </div>

        {/* SUGGESTED ANSWER */}
        {evaluation.suggestedAnswer && (
          <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="size-4 text-primary" />
              Suggested stronger answer
            </div>

            <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {evaluation.suggestedAnswer}
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

function ReportPanel({
  report,
  session,
  onNewInterview,
}: {
  report: InterviewReportResponse | null;
  session: InterviewResponse | null;
  onNewInterview: () => void;
}) {
  if (!report) {
    return (
      <SectionCard title="Interview completed">
        <div className="py-12 text-center">
          <CheckCircle2 className="mx-auto size-10 text-success" />

          <h2 className="mt-4 text-xl font-semibold">
            Interview completed
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Your report is not available yet.
          </p>

          <Button
            className="mt-5"
            onClick={onNewInterview}
          >
            Start another interview
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.10] via-transparent to-transparent" />

        <div className="relative p-6 text-center sm:p-8">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
            <Trophy className="size-8" />
          </div>

          <Badge
            variant="outline"
            className="mt-4 border-primary/30 bg-primary/10 text-primary"
          >
            Interview completed
          </Badge>

          <h2 className="mt-3 text-2xl font-semibold">
            {session?.jobRole || "Interview"} report
          </h2>

          <div className="mt-5 text-5xl font-bold tabular-nums text-primary">
            {formatScore(report.overallScore)}
          </div>

          <div className="mt-1 text-sm text-muted-foreground">
            Overall interview score
          </div>

          <div className="mx-auto mt-6 max-w-md">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Questions answered
              </span>
              <span className="font-semibold">
                {report.questionsAnswered}
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min(
                    100,
                    report.overallScore * 10
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ReportCard
          icon={CheckCircle2}
          title="Strengths"
          text={report.strengths}
        />

        <ReportCard
          icon={CircleAlert}
          title="Improvements"
          text={report.improvements}
        />

        <ReportCard
          icon={Lightbulb}
          title="Recommendation"
          text={report.recommendation}
        />
      </div>

      <div className="flex justify-center pt-2">
        <Button size="lg" onClick={onNewInterview}>
          <RotateCcw className="mr-2 size-4" />
          Start new interview
        </Button>
      </div>
    </div>
  );
}

function ReportCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Check;
  title: string;
  text?: string | null;
}) {
  return (
    <SectionCard title={title}>
      <div className="flex gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>

        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
          {text || "No information available."}
        </p>
      </div>
    </SectionCard>
  );
}

function ScoreMetric({
  label,
  value,
}: {
  label: string;
  value?: number | null;
}) {
  const score = value ?? 0;

  return (
    <div className="rounded-xl border border-border/70 bg-muted/10 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {label}
        </span>

        <span className="text-sm font-semibold tabular-nums">
          {formatScore(score)}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: `${Math.min(100, score * 10)}%`,
          }}
        />
      </div>
    </div>
  );
}

function InsightBox({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: typeof Check;
  title: string;
  text?: string | null;
  tone: "success" | "warning";
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/10 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon
          className={`size-4 ${
            tone === "success"
              ? "text-success"
              : "text-warning"
          }`}
        />

        {title}
      </div>

      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
        {text || "No information available."}
      </p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Brain;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/50 p-3">
      <Icon className="size-4 text-primary" />

      <div className="mt-2 text-sm font-medium">
        {title}
      </div>

      <div className="mt-1 text-xs text-muted-foreground">
        {text}
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Brain;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/50 p-4">
      <Icon className="size-4 text-primary" />

      <div className="mt-3 text-lg font-semibold">
        {value}
      </div>

      <div className="text-xs text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Tip({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Brain;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>

      <div>
        <div className="text-sm font-medium">
          {title}
        </div>

        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {text}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
        {required && (
          <span className="ml-1 text-destructive">*</span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        Loading...
      </div>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
      <div className="grid size-11 place-items-center rounded-xl bg-muted">
        <History className="size-5 text-muted-foreground" />
      </div>

      <h3 className="mt-3 text-sm font-semibold">
        No interviews yet
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        Start your first AI interview and your completed sessions
        will appear here.
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );
}

function formatScore(value?: number | null) {
  return value == null ? "0.0" : Number(value).toFixed(1);
}

function formatDate(value?: string | null) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}