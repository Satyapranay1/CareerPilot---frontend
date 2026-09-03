import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  PageHeader,
  SectionCard,
  StatusPill,
} from "@/components/ui-kit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import type {
  Question,
  Progress,
  CodingCatalog,
  TopicDetails,
} from "@/features/coding";
import {
  Search,
  Play,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  RotateCcw,
} from "lucide-react";
import { LoadingSpinner } from "@/routes/LoadingSpinner";

export const Route = createFileRoute("/coding")({
  head: () => ({
    meta: [{ title: "Coding Practice · InterviewOS AI" }],
  }),

  component: () => (
    <AppShell>
      <CodingPage />
    </AppShell>
  ),
});

/* ============================================================
   PLATFORM
============================================================ */

function PlatformBadge({
  platform,
}: {
  platform: string;
}) {
  const value = platform?.toUpperCase();

  if (value === "LEETCODE") {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border bg-background px-2 py-1">
        <img
          src="/icons/leetcode.png"
          alt="LeetCode"
          className="size-5 object-contain"
        />

        <span className="text-xs font-medium">
          LeetCode
        </span>
      </div>
    );
  }

  if (
    value === "GFG" ||
    value === "GEEKSFORGEEKS"
  ) {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border bg-background px-2 py-1">
        <img
          src="/icons/gfg.png"
          alt="GeeksforGeeks"
          className="size-5 object-contain"
        />

        <span className="text-xs font-medium">
          GFG
        </span>
      </div>
    );
  }

  return (
    <Badge variant="outline">
      {platform}
    </Badge>
  );
}

/* ============================================================
   DIFFICULTY
============================================================ */

function DifficultyBadge({
  difficulty,
}: {
  difficulty: string;
}) {
  const value =
    difficulty?.toUpperCase();

  if (value === "EASY") {
    return (
      <Badge
        variant="outline"
        className="border-green-500/30 bg-green-500/5 text-green-600"
      >
        Easy
      </Badge>
    );
  }

  if (value === "MEDIUM") {
    return (
      <Badge
        variant="outline"
        className="border-yellow-500/30 bg-yellow-500/5 text-yellow-600"
      >
        Medium
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-red-500/30 bg-red-500/5 text-red-600"
    >
      Hard
    </Badge>
  );
}

/* ============================================================
   PROGRESS BAR
============================================================ */

function MiniProgress({
  solved,
  total,
}: {
  solved: number;
  total: number;
}) {
  const percentage =
    total > 0
      ? Math.round((solved / total) * 100)
      : 0;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {solved}/{total}
        </span>

        <span>
          {percentage}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   CODING PAGE
============================================================ */

function CodingPage() {
  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [progress, setProgress] =
    useState<Progress | null>(null);

  const [catalog, setCatalog] =
    useState<CodingCatalog | null>(null);

  const [topicDetails, setTopicDetails] =
    useState<TopicDetails | null>(null);

  const [selectedTopic, setSelectedTopic] =
    useState<number | null>(null);

  const [expandedComponents, setExpandedComponents] =
    useState<Set<number>>(new Set());

  const [search, setSearch] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("");

  const [platform, setPlatform] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [solvedFilter, setSolvedFilter] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingTopic, setLoadingTopic] =
    useState(false);

  const [page, setPage] =
    useState(0);

  const [pageSize] =
    useState(20);

  const [totalElements, setTotalElements] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  /* ==========================================================
     LOAD CATALOG
  ========================================================== */

  const loadCatalog = async () => {
    try {
      const response =
        await apiFetch("/coding");

      if (!response.ok) {
        throw new Error();
      }

      const data =
        await response.json();

      setCatalog(data);
    } catch {
      toast.error(
        "Unable to load coding topics.",
      );
    }
  };

  /* ==========================================================
     LOAD PROGRESS
  ========================================================== */

  const loadProgress = async () => {
    try {
      const response =
        await apiFetch(
          "/coding/progress",
        );

      if (!response.ok) {
        throw new Error();
      }

      const data =
        await response.json();

      setProgress(data);
    } catch {
      toast.error(
        "Unable to load coding progress.",
      );
    }
  };

  /* ==========================================================
     LOAD TOPIC DETAILS
  ========================================================== */

  const loadTopic = async (
    topicId: number,
  ) => {
    try {
      setLoadingTopic(true);

      const response =
        await apiFetch(
          `/coding/topics/${topicId}`,
        );

      if (!response.ok) {
        throw new Error();
      }

      const data: TopicDetails =
        await response.json();

      setTopicDetails(data);
      setSelectedTopic(topicId);

      /*
       * Expand all components initially.
       */
      setExpandedComponents(
        new Set(
          (data.components ?? []).map(
            (component) =>
              component.id,
          ),
        ),
      );

      /*
       * Reset question filters/page.
       */
      setPage(0);
    } catch {
      toast.error(
        "Unable to load topic details.",
      );
    } finally {
      setLoadingTopic(false);
    }
  };

  /* ==========================================================
     CLEAR TOPIC
  ========================================================== */

  const clearTopic = () => {
    setSelectedTopic(null);
    setTopicDetails(null);
    setExpandedComponents(
      new Set(),
    );
    setPage(0);
  };

  /* ==========================================================
     LOAD PAGINATED QUESTIONS
  ========================================================== */

  const loadQuestions = async () => {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      if (searchQuery.trim()) {
        params.append(
          "search",
          searchQuery.trim(),
        );
      }

      if (difficulty) {
        params.append(
          "difficulty",
          difficulty,
        );
      }

      if (platform) {
        params.append(
          "platform",
          platform,
        );
      }

      if (company.trim()) {
        params.append(
          "company",
          company.trim(),
        );
      }

      if (selectedTopic !== null) {
        params.append(
          "topicId",
          selectedTopic.toString(),
        );
      }

      if (solvedFilter) {
        params.append(
          "solved",
          solvedFilter,
        );
      }

      params.append(
        "page",
        page.toString(),
      );

      params.append(
        "size",
        pageSize.toString(),
      );

      const response =
        await apiFetch(
          `/coding/questions?${params.toString()}`,
        );

      if (!response.ok) {
        throw new Error();
      }

      const data =
        await response.json();

      setQuestions(
        data.questions ?? [],
      );

      setTotalElements(
        data.totalElements ?? 0,
      );

      setTotalPages(
        data.totalPages ?? 0,
      );
    } catch {
      toast.error(
        "Unable to load questions.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     TOGGLE COMPONENT
  ========================================================== */

  const toggleComponent = (
    componentId: number,
  ) => {
    setExpandedComponents(
      (previous) => {
        const next =
          new Set(previous);

        if (next.has(componentId)) {
          next.delete(componentId);
        } else {
          next.add(componentId);
        }

        return next;
      },
    );
  };

  /* ==========================================================
     UPDATE SOLVED
  ========================================================== */

  const toggleSolved = async (
    question: Question,
  ) => {
    try {
      const newSolved =
        !question.solved;

      const response =
        await apiFetch(
          `/coding/questions/${question.id}/solved?solved=${newSolved}`,
          {
            method: "PUT",
          },
        );

      if (!response.ok) {
        throw new Error();
      }

      /*
       * Refresh all user-specific
       * progress data.
       */
      await Promise.all([
        loadQuestions(),
        loadProgress(),
        loadCatalog(),

        selectedTopic !== null
          ? loadTopic(selectedTopic)
          : Promise.resolve(),
      ]);

      toast.success(
        newSolved
          ? "Question marked as solved."
          : "Question marked as unsolved.",
      );
    } catch {
      toast.error(
        "Unable to update question.",
      );
    }
  };

  /* ==========================================================
     SELECT ALL CURRENT PAGE
  ========================================================== */

  const toggleSelectAll = async () => {
    if (!questions.length) {
      return;
    }

    const allSolved =
      questions.every(
        (question) =>
          question.solved,
      );

    const newSolved =
      !allSolved;

    try {
      await Promise.all(
        questions.map(
          (question) =>
            apiFetch(
              `/coding/questions/${question.id}/solved?solved=${newSolved}`,
              {
                method: "PUT",
              },
            ),
        ),
      );

      await Promise.all([
        loadQuestions(),
        loadProgress(),
        loadCatalog(),

        selectedTopic !== null
          ? loadTopic(selectedTopic)
          : Promise.resolve(),
      ]);

      toast.success(
        newSolved
          ? "All questions on this page marked as solved."
          : "All questions on this page marked as unsolved.",
      );
    } catch {
      toast.error(
        "Unable to update questions.",
      );
    }
  };

  /* ==========================================================
     SEARCH DEBOUNCE
  ========================================================== */

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setSearchQuery(search);
        setPage(0);
      }, 400);

    return () =>
      clearTimeout(timer);
  }, [search]);

  /* ==========================================================
     QUESTIONS RELOAD
  ========================================================== */

  useEffect(() => {
    loadQuestions();
  }, [
    searchQuery,
    difficulty,
    platform,
    company,
    solvedFilter,
    selectedTopic,
    page,
    pageSize,
  ]);

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    Promise.all([
      loadCatalog(),
      loadProgress(),
    ]);
  }, []);

  /* ==========================================================
     DERIVED VALUES
  ========================================================== */

  const allQuestionsSolved =
    questions.length > 0 &&
    questions.every(
      (question) =>
        question.solved,
    );

  const firstQuestion =
    totalElements === 0
      ? 0
      : page * pageSize + 1;

  const lastQuestion =
    Math.min(
      (page + 1) * pageSize,
      totalElements,
    );

  const selectedTopicInfo =
    catalog?.topics?.find(
      (topic) =>
        topic.id === selectedTopic,
    );

  const difficultyProgress =
    progress?.difficulty;

  const completionPercentage =
    progress?.percentage ?? 0;

  const filteredTopicComponents =
    topicDetails?.components ?? [];

  /*
   * If topic-details API is available,
   * use it to calculate component
   * information in the UI.
   */
  const topicComponentCount =
    filteredTopicComponents.length;

  const topicSolved =
    topicDetails?.solved ?? 0;

  const topicTotal =
    topicDetails?.total ?? 0;

  const topicPercentage =
    topicTotal > 0
      ? Math.round(
          (topicSolved /
            topicTotal) *
            100,
        )
      : 0;

  const visibleQuestionCount =
    questions.length;

  const currentPageSolved =
    questions.filter(
      (question) =>
        question.solved,
    ).length;

  /*
   * Show loading screen only on the
   * first page load.
   */
  if (
    loading &&
    questions.length === 0 &&
    !catalog
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        eyebrow="Practice"
        title="Coding problems"
        description="Practice DSA questions, track solved problems and follow your topic-wise progress."
        actions={null}
      />

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SectionCard>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Overall progress
          </div>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-semibold">
              {progress?.solved ?? 0}
            </span>

            <span className="pb-1 text-sm text-muted-foreground">
              / {progress?.total ?? 0}
            </span>
          </div>

          <MiniProgress
            solved={
              progress?.solved ?? 0
            }
            total={
              progress?.total ?? 0
            }
          />
        </SectionCard>

        <SectionCard>
          <div className="text-xs font-medium uppercase tracking-wide text-green-600">
            Easy
          </div>

          <div className="mt-2 text-2xl font-semibold">
            {difficultyProgress?.easySolved ??
              0}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              /
              {difficultyProgress?.easyTotal ??
                0}
            </span>
          </div>

          <MiniProgress
            solved={
              difficultyProgress?.easySolved ??
              0
            }
            total={
              difficultyProgress?.easyTotal ??
              0
            }
          />
        </SectionCard>

        <SectionCard>
          <div className="text-xs font-medium uppercase tracking-wide text-yellow-600">
            Medium
          </div>

          <div className="mt-2 text-2xl font-semibold">
            {difficultyProgress?.mediumSolved ??
              0}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              /
              {difficultyProgress?.mediumTotal ??
                0}
            </span>
          </div>

          <MiniProgress
            solved={
              difficultyProgress?.mediumSolved ??
              0
            }
            total={
              difficultyProgress?.mediumTotal ??
              0
            }
          />
        </SectionCard>

        <SectionCard>
          <div className="text-xs font-medium uppercase tracking-wide text-red-600">
            Hard
          </div>

          <div className="mt-2 text-2xl font-semibold">
            {difficultyProgress?.hardSolved ??
              0}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              /
              {difficultyProgress?.hardTotal ??
                0}
            </span>
          </div>

          <MiniProgress
            solved={
              difficultyProgress?.hardSolved ??
              0
            }
            total={
              difficultyProgress?.hardTotal ??
              0
            }
          />
        </SectionCard>

      </div>

      {/* =====================================================
          TOPIC DETAILS SUMMARY
      ===================================================== */}

      {selectedTopic !== null &&
        topicDetails && (
          <SectionCard>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-primary">
                  Selected topic
                </div>

                <h2 className="mt-1 text-xl font-semibold">
                  {topicDetails.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {topicSolved} of{" "}
                  {topicTotal} questions
                  solved
                </p>
              </div>

              <div className="flex items-center gap-3">

                <div className="text-right">
                  <div className="text-2xl font-semibold">
                    {topicPercentage}%
                  </div>

                  <div className="text-xs text-muted-foreground">
                    completion
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={
                    clearTopic
                  }
                >
                  <RotateCcw className="mr-2 size-3.5" />
                  All topics
                </Button>

              </div>

            </div>

            <MiniProgress
              solved={topicSolved}
              total={topicTotal}
            />

            <div className="mt-4 text-xs text-muted-foreground">
              {topicComponentCount} subtopics
              available
            </div>

          </SectionCard>
        )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">

        {/* ===================================================
            TOPICS
        =================================================== */}

        <SectionCard>

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h3 className="font-semibold">
                DSA Topics
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Choose a topic to practice
              </p>
            </div>

            {selectedTopic !== null && (
              <Button
                size="sm"
                variant="ghost"
                onClick={
                  clearTopic
                }
              >
                All
              </Button>
            )}

          </div>

          <div className="space-y-1.5">

            {catalog?.topics?.map(
              (topic) => {
                const active =
                  selectedTopic ===
                  topic.id;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() =>
                      loadTopic(
                        topic.id,
                      )
                    }
                    className={[
                      "w-full rounded-lg border p-3 text-left transition",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-border hover:bg-muted/40",
                    ].join(" ")}
                  >

                    <div className="flex items-center justify-between gap-2">

                      <span
                        className={
                          active
                            ? "font-semibold text-primary"
                            : "font-medium"
                        }
                      >
                        {topic.name}
                      </span>

                      <Badge
                        variant={
                          active
                            ? "default"
                            : "outline"
                        }
                        className="tabular-nums"
                      >
                        {topic.solved}/
                        {topic.total}
                      </Badge>

                    </div>

                    <MiniProgress
                      solved={
                        topic.solved
                      }
                      total={
                        topic.total
                      }
                    />

                  </button>
                );
              },
            )}

          </div>

        </SectionCard>

        {/* ===================================================
            QUESTIONS
        =================================================== */}

        <SectionCard padded={false}>

          {/* FILTERS */}

          <div className="space-y-3 border-b border-border/60 p-4">

            <div className="flex flex-wrap items-center gap-2">

              <div className="relative min-w-[220px] flex-1">

                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search questions..."
                  className="h-9 pl-9"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value,
                    )
                  }
                />

              </div>

              <select
                className="h-9 rounded-md border bg-background px-3 text-sm"
                value={platform}
                onChange={(e) => {
                  setPlatform(
                    e.target.value,
                  );
                  setPage(0);
                }}
              >
                <option value="">
                  Platform
                </option>

                <option value="LEETCODE">
                  LeetCode
                </option>

                <option value="GFG">
                  GFG
                </option>
              </select>

              <select
                className="h-9 rounded-md border bg-background px-3 text-sm"
                value={solvedFilter}
                onChange={(e) => {
                  setSolvedFilter(
                    e.target.value,
                  );
                  setPage(0);
                }}
              >
                <option value="">
                  All status
                </option>

                <option value="true">
                  Solved
                </option>

                <option value="false">
                  Unsolved
                </option>
              </select>

              <Input
                placeholder="Company"
                className="h-9 w-36"
                value={company}
                onChange={(e) => {
                  setCompany(
                    e.target.value,
                  );
                  setPage(0);
                }}
              />

            </div>

            {/* DIFFICULTY */}

            <div className="flex flex-wrap items-center gap-1.5">

              <span className="mr-1 text-xs text-muted-foreground">
                Difficulty:
              </span>

              {[
                {
                  value: "",
                  label: "All",
                },
                {
                  value: "EASY",
                  label: "Easy",
                },
                {
                  value: "MEDIUM",
                  label: "Medium",
                },
                {
                  value: "HARD",
                  label: "Hard",
                },
              ].map(
                (item) => (
                  <Button
                    key={item.value || "all"}
                    size="sm"
                    variant={
                      difficulty ===
                      item.value
                        ? "default"
                        : "outline"
                    }
                    className="h-7"
                    onClick={() => {
                      setDifficulty(
                        item.value,
                      );
                      setPage(0);
                    }}
                  >
                    {item.label}
                  </Button>
                ),
              )}

            </div>

            {/* SELECT ALL */}

            {questions.length >
              0 && (
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">

                <div className="text-xs text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {visibleQuestionCount}
                  </span>{" "}
                  questions ·{" "}
                  <span className="font-medium text-foreground">
                    {currentPageSolved}
                  </span>{" "}
                  solved on this
                  page
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={
                    toggleSelectAll
                  }
                >
                  {allQuestionsSolved
                    ? "Mark page unsolved"
                    : "Mark page solved"}
                </Button>

              </div>
            )}

          </div>

          {/* =================================================
              TOPIC COMPONENTS
          ================================================= */}

          {selectedTopic !== null &&
            topicDetails &&
            !searchQuery &&
            !difficulty &&
            !platform &&
            !company &&
            !solvedFilter ? (

            <div className="border-b border-border/60">

              {loadingTopic ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Loading subtopics...
                </div>
              ) : topicDetails.components
                  ?.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No subtopics available.
                </div>
              ) : (
                topicDetails.components.map(
                  (component) => {
                    const expanded =
                      expandedComponents.has(
                        component.id,
                      );

                    return (
                      <div
                        key={
                          component.id
                        }
                        className="border-b last:border-b-0"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            toggleComponent(
                              component.id,
                            )
                          }
                          className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/30"
                        >

                          <div className="flex items-center gap-2">

                            {expanded ? (
                              <ChevronDown className="size-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground" />
                            )}

                            <div>
                              <div className="text-sm font-semibold">
                                {
                                  component.name
                                }
                              </div>

                              <div className="text-xs text-muted-foreground">
                                {
                                  component.solved
                                }{" "}
                                /{" "}
                                {
                                  component.total
                                }{" "}
                                solved
                              </div>
                            </div>

                          </div>

                          <Badge
                            variant="outline"
                          >
                            {
                              component.solved
                            }
                            /
                            {
                              component.total
                            }
                          </Badge>

                        </button>

                        {expanded &&
                          component.questions
                            ?.length >
                            0 && (
                            <div className="bg-muted/10 px-4 pb-3">

                              {component.questions.map(
                                (
                                  question,
                                ) => (
                                  <div
                                    key={
                                      question.id
                                    }
                                    className="flex items-center gap-3 rounded-lg border bg-background p-3 mb-2"
                                  >

                                    <input
                                      type="checkbox"
                                      checked={
                                        question.solved
                                      }
                                      onChange={() =>
                                        toggleSolved(
                                          question,
                                        )
                                      }
                                      className="size-4 rounded border-border"
                                    />

                                    <div className="min-w-0 flex-1">

                                      <div className="flex flex-wrap items-center gap-2">

                                        <span
                                          className={
                                            question.solved
                                              ? "text-sm font-medium text-muted-foreground line-through"
                                              : "text-sm font-medium"
                                          }
                                        >
                                          {
                                            question.title
                                          }
                                        </span>

                                        <DifficultyBadge
                                          difficulty={
                                            question.difficulty
                                          }
                                        />

                                      </div>

                                      {question.companies
                                        ?.length >
                                        0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                          {question.companies.map(
                                            (
                                              item,
                                              index,
                                            ) => (
                                              <Badge
                                                key={`${item}-${index}`}
                                                variant="secondary"
                                                className="text-[10px]"
                                              >
                                                {
                                                  item
                                                }
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      )}

                                    </div>

                                    <PlatformBadge
                                      platform={
                                        question.platform
                                      }
                                    />

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        window.open(
                                          question.problemUrl,
                                          "_blank",
                                          "noopener,noreferrer",
                                        )
                                      }
                                    >
                                      <Play className="mr-1.5 size-3.5" />
                                      Solve
                                    </Button>

                                  </div>
                                ),
                              )}

                            </div>
                          )}

                      </div>
                    );
                  },
                )
              )}

            </div>

          ) : null}

          {/* =================================================
              PAGINATED QUESTION TABLE
          ================================================= */}

          <div className="overflow-x-auto">

            <Table>

              <TableHeader className="bg-muted/40">

                <TableRow>

                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        allQuestionsSolved
                      }
                      onChange={
                        toggleSelectAll
                      }
                      disabled={
                        questions.length ===
                        0
                      }
                      className="size-4 rounded border-border"
                      title={
                        allQuestionsSolved
                          ? "Mark page unsolved"
                          : "Mark page solved"
                      }
                    />
                  </TableHead>

                  <TableHead>
                    Problem
                  </TableHead>

                  <TableHead>
                    Companies
                  </TableHead>

                  <TableHead>
                    Platform
                  </TableHead>

                  <TableHead>
                    Difficulty
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead className="text-right">
                    Action
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {questions.length ===
                0 ? (
                  <TableRow>

                    <TableCell
                      colSpan={7}
                      className="py-10 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">

                        <Circle className="size-8 text-muted-foreground/40" />

                        <span className="text-sm text-muted-foreground">
                          No questions found.
                        </span>

                      </div>
                    </TableCell>

                  </TableRow>
                ) : (
                  questions.map(
                    (question) => (
                      <TableRow
                        key={
                          question.id
                        }
                        className="hover:bg-muted/20"
                      >

                        {/* CHECKBOX */}

                        <TableCell>

                          <input
                            type="checkbox"
                            checked={
                              question.solved
                            }
                            onChange={() =>
                              toggleSolved(
                                question,
                              )
                            }
                            className="size-4 rounded border-border"
                          />

                        </TableCell>

                        {/* QUESTION */}

                        <TableCell>

                          <div
                            className={
                              question.solved
                                ? "font-medium text-muted-foreground line-through"
                                : "font-medium"
                            }
                          >
                            {
                              question.title
                            }
                          </div>

                        </TableCell>

                        {/* COMPANIES */}

                        <TableCell>

                          {question.companies
                            ?.length >
                          0 ? (
                            <div className="flex max-w-[180px] flex-wrap gap-1">

                              {question.companies
                                .slice(
                                  0,
                                  3,
                                )
                                .map(
                                  (
                                    item,
                                    index,
                                  ) => (
                                    <Badge
                                      key={`${item}-${index}`}
                                      variant="secondary"
                                      className="text-[10px]"
                                    >
                                      {
                                        item
                                      }
                                    </Badge>
                                  ),
                                )}

                              {question.companies
                                .length >
                                3 && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  +
                                  {question
                                    .companies
                                    .length -
                                    3}
                                </Badge>
                              )}

                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}

                        </TableCell>

                        {/* PLATFORM */}

                        <TableCell>

                          <PlatformBadge
                            platform={
                              question.platform
                            }
                          />

                        </TableCell>

                        {/* DIFFICULTY */}

                        <TableCell>

                          <DifficultyBadge
                            difficulty={
                              question.difficulty
                            }
                          />

                        </TableCell>

                        {/* STATUS */}

                        <TableCell>

                          {question.solved ? (
                            <div className="flex items-center gap-1.5 text-xs text-green-600">
                              <CheckCircle2 className="size-3.5" />
                              Solved
                            </div>
                          ) : (
                            <StatusPill
                              status="Not Solved"
                            />
                          )}

                        </TableCell>

                        {/* ACTION */}

                        <TableCell className="text-right">

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary"
                            onClick={() =>
                              window.open(
                                question.problemUrl,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                          >
                            <Play className="mr-1.5 size-3.5" />
                            Solve
                          </Button>

                        </TableCell>

                      </TableRow>
                    ),
                  )
                )}

              </TableBody>

            </Table>

          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="text-xs text-muted-foreground">

              Showing{" "}
              <span className="font-medium text-foreground">
                {firstQuestion}
              </span>
              –
              <span className="font-medium text-foreground">
                {lastQuestion}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {totalElements}
              </span>

            </div>

            <div className="flex items-center gap-2">

              <Button
                size="sm"
                variant="outline"
                disabled={
                  page === 0
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        0,
                        current - 1,
                      ),
                  )
                }
              >
                Previous
              </Button>

              <span className="min-w-[100px] text-center text-xs text-muted-foreground">
                Page{" "}
                {totalPages ===
                0
                  ? 0
                  : page + 1}{" "}
                of{" "}
                {totalPages}
              </span>

              <Button
                size="sm"
                variant="outline"
                disabled={
                  totalPages ===
                    0 ||
                  page >=
                    totalPages - 1
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        totalPages -
                          1,
                        current + 1,
                      ),
                  )
                }
              >
                Next
              </Button>

            </div>

          </div>

        </SectionCard>

      </div>

    </div>
  );
}