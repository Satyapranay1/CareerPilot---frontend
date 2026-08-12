import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DifficultyPill, PageHeader, SectionCard, StatusPill } from "@/components/ui-kit";
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
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import type {
  Question,
  Progress,
  TopicDetails,
  CodingCatalog,
} from "@/features/coding";
import { Search, Play } from "lucide-react";
import { LoadingSpinner } from "@/routes/LoadingSpinner";

export const Route = createFileRoute("/coding")({
  head: () => ({ meta: [{ title: "Coding Practice · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <CodingPage />
    </AppShell>
  ),
});

function PlatformBadge({ platform }: { platform: string }) {
  const value = platform?.toUpperCase();

  if (value === "LEETCODE") {
    return (
      <div className="flex items-center gap-2 rounded-md border px-2 py-1">
        <img src="/icons/leetcode.png" alt="LeetCode" className="size-5" />
        <span className="text-sm">LeetCode</span>
      </div>
    );
  }

  if (value === "GFG" || value === "GEEKSFORGEEKS") {
    return (
      <div className="flex items-center gap-2 rounded-md border px-2 py-1">
        <img src="/icons/gfg.png" alt="GeeksforGeeks" className="size-5" />
        <span className="text-sm">GFG</span>
      </div>
    );
  }

  return <Badge variant="outline">{platform}</Badge>;
}

function CodingPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [difficulty, setDifficulty] = useState("");

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [catalog, setCatalog] = useState<CodingCatalog | null>(null);

  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const [topicDetails, setTopicDetails] = useState<TopicDetails | null>(null);

  const [platform, setPlatform] = useState("");

  const [company, setCompany] = useState("");

  const [solvedFilter, setSolvedFilter] = useState("");

  const [loadingTopic, setLoadingTopic] = useState(false);

  const loadCatalog = async () => {
    try {
      const response = await apiFetch("/coding");

      if (!response.ok) throw new Error();

      const data = await response.json();

      setCatalog(data);
    } catch {
      toast.error("Unable to load topics.");
    }
  };

  const loadTopic = async (id: number) => {
    setLoadingTopic(true);

    try {
      const response = await apiFetch(`/coding/topics/${id}`);

      if (!response.ok) throw new Error();

      const data = await response.json();

      setTopicDetails(data);

      setSelectedTopic(id);
    } finally {
      setLoadingTopic(false);
    }
  };

  const loadProgress = async () => {
    try {
      const response = await apiFetch("/coding/progress");

      if (!response.ok) throw new Error();

      const data = await response.json();

      setProgress(data);
    } catch {
      toast.error("Unable to load progress.");
    }
  };

  const loadQuestions = async () => {
    try {
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      if (difficulty) {
        params.append("difficulty", difficulty);
      }

      if (platform) {
        params.append("platform", platform);
      }

      if (company.trim()) {
        params.append("company", company.trim());
      }

      if (selectedTopic) {
        params.append("topicId", selectedTopic.toString());
      }

      if (solvedFilter) {
        params.append("solved", solvedFilter);
      }

      params.append("page", page.toString());

      params.append("size", pageSize.toString());

      const response = await apiFetch(`/coding/questions?${params.toString()}`);

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setQuestions(data.questions);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Unable to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSolved = async (question: Question) => {
    try {
      const response = await apiFetch(
        `/coding/questions/${question.id}/solved?solved=${!question.solved}`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) throw new Error();

      await loadQuestions();
      await loadProgress();
      await loadCatalog();

      if (selectedTopic) {
        await loadTopic(selectedTopic);
      }
    } catch {
      toast.error("Unable to update question.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(search);
      setPage(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadQuestions();
  }, [searchQuery, difficulty, platform, company, solvedFilter, selectedTopic, page, pageSize]);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    loadCatalog();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Practice"
        title="Coding problems"
        description="Track your progress across topics, difficulties and companies. Bookmark favorites and export reports."
        actions={null}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <SectionCard className="sticky top-20 h-[calc(30vh-8rem)] overflow-y-auto">
          <h3 className="font-semibold">Overall</h3>
          <p>
            {progress?.solved}/{progress?.total}
          </p>
        </SectionCard>

        <SectionCard>
          <h3 className="font-semibold">Easy</h3>

          <p>
            {progress?.difficulty.easySolved}/{progress?.difficulty.easyTotal}
          </p>
        </SectionCard>

        <SectionCard>
          <h3 className="font-semibold">Medium</h3>

          <p>
            {progress?.difficulty.mediumSolved}/{progress?.difficulty.mediumTotal}
          </p>
        </SectionCard>

        <SectionCard>
          <h3 className="font-semibold">Hard</h3>

          <p>
            {progress?.difficulty.hardSolved}/{progress?.difficulty.hardTotal}
          </p>
        </SectionCard>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <SectionCard>
            <h3 className="mb-4 font-semibold">Topics</h3>

            <div className="space-y-2">
              {catalog?.topics.map((topic) => (
                <Button
                  key={topic.id}
                  variant={selectedTopic === topic.id ? "default" : "ghost"}
                  className="w-full justify-between"
                  onClick={() => {
                    setPage(0);
                    loadTopic(topic.id);
                  }}
                >
                  <span>{topic.name}</span>

                  <Badge>
                    {topic.solved}/{topic.total}
                  </Badge>
                </Button>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="col-span-9">
          <SectionCard padded={false}>
            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 p-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  className="h-8 pl-9"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {["", "EASY", "MEDIUM", "HARD"].map((level) => (
                  <Button
                    key={level || "ALL"}
                    size="sm"
                    variant={difficulty === level ? "default" : "outline"}
                    onClick={() => {
                      setDifficulty(level);
                      setPage(0);
                    }}
                  >
                    {level || "All"}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="h-8 rounded-md border bg-background px-2 text-sm"
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">Platform</option>
                  <option value="LEETCODE">LeetCode</option>
                  <option value="GFG">GFG</option>
                </select>

                <select
                  className="h-8 rounded-md border bg-background px-2 text-sm"
                  value={solvedFilter}
                  onChange={(e) => {
                    setSolvedFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All</option>
                  <option value="true">Solved</option>
                  <option value="false">Unsolved</option>
                </select>

                <Input
                  placeholder="Search company..."
                  className="h-8 w-40"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    setPage(0);
                  }}
                />
              </div>
            </div>
            {topicDetails && (
              <SectionCard className="mb-5">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">{topicDetails.name}</h2>

                  <Badge>
                    {topicDetails.solved}/{topicDetails.total}
                  </Badge>
                </div>

                <div className="mt-5 space-y-4">
                  {topicDetails.components.map((component) => (
                    <div key={component.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{component.name}</h3>

                        <Badge>
                          {component.solved}/{component.total}
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-2">
                        {component.questions.map((question) => (
                          <div
                            key={question.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={question.solved}
                                onChange={() => toggleSolved(question)}
                                className="size-4"
                              />

                              <div className="space-y-2">
                                <div className="font-medium">{question.title}</div>

                                <div className="flex flex-wrap gap-2">
                                  <DifficultyPill level={question.difficulty} />

                                  <PlatformBadge platform={question.platform} />

                                  {question.companies.map((company) => (
                                    <Badge key={company} variant="secondary">
                                      {company}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => window.open(question.problemUrl)}
                            >
                              <Play className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
            {!selectedTopic && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted/40 backdrop-blur">
                    <TableRow>
                      <TableHead>Problem</TableHead>

                      <TableHead>Platform</TableHead>

                      <TableHead>Difficulty</TableHead>

                      <TableHead>Status</TableHead>

                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {questions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center">
                          No questions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      questions.map((p) => (
                        <TableRow key={p.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{p.title}</TableCell>

                          <TableCell>
                            <PlatformBadge platform={p.platform} />
                          </TableCell>

                          <TableCell>
                            <DifficultyPill level={p.difficulty} />
                          </TableCell>

                          <TableCell>
                            <StatusPill status={p.solved ? "Solved" : "Not Solved"} />
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7 text-primary"
                              onClick={() => window.open(p.problemUrl)}
                            >
                              <Play className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            {!selectedTopic && (
              <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
                <span>
                  Showing 1–{questions.length} of {totalElements}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
