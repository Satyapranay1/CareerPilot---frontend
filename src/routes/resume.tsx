import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  PageHeader,
  SectionCard,
  StatCard,
  ProgressRing,
  EmptyState,
} from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/routes/LoadingSpinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  UploadCloud,
  FileText,
  Check,
  X,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  Zap,
  Target,
  Type,
  Award,
  Briefcase,
  Code2,
  CalendarDays,
  Building2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  ResumeHistory,
  ResumeAnalysis,
  ResumeAIAnalysis,
} from "@/features/resume/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [{ title: "Resume · InterviewOS AI" }],
  }),

  component: () => (
    <AppShell>
      <ResumePage />
    </AppShell>
  ),
});

function ResumePage() {
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

  const [history, setHistory] = useState<ResumeHistory[]>([]);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [selectedResumeId, setSelectedResumeId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingResume, setLoadingResume] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [companyOther, setCompanyOther] = useState("");
  const [jobRoleOther, setJobRoleOther] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisData: ResumeAIAnalysis | undefined =
    analysis?.analysis;

  const scores = analysisData?.scores;

  const formatScore = (
    value: number | undefined | null
  ) => (value == null ? "0" : Number(value).toFixed(0));

  const formatResumeDate = (
    date: string | null | undefined
  ) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Date unavailable";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getResumeUploadDates = (): Record<string, string> => {
    try {
      return JSON.parse(
        localStorage.getItem("resumeUploadDates") || "{}"
      );
    } catch {
      return {};
    }
  };

  const saveResumeUploadDate = (id: number) => {
    const dates = getResumeUploadDates();
    const date = new Date().toISOString();

    dates[String(id)] = date;

    localStorage.setItem(
      "resumeUploadDates",
      JSON.stringify(dates)
    );

    return date;
  };

  /* =========================================================
     LOAD HISTORY
  ========================================================= */

  const loadResumeHistory = async (
    autoSelect = true
  ) => {
    try {
      const response = await apiFetch("/resumes");

      if (!response.ok) {
        throw new Error("Failed to load resume history");
      }

      const data: ResumeHistory[] = await response.json();
      const savedDates = getResumeUploadDates();

      const historyWithDates = data.map((resume) => {
        const uploadedAt =
          savedDates[String(resume.id)] ||
          resume.uploadedAt ||
          new Date().toISOString();

        savedDates[String(resume.id)] = uploadedAt;

        return {
          ...resume,
          uploadedAt,
        };
      });

      localStorage.setItem(
        "resumeUploadDates",
        JSON.stringify(savedDates)
      );

      setHistory(historyWithDates);

      if (
        autoSelect &&
        historyWithDates.length &&
        selectedResumeId === null
      ) {
        await loadResume(historyWithDates[0].id);
      }
    } catch (error) {
      console.error("Resume history error:", error);
      toast.error("Unable to load resume history.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD SINGLE RESUME
  ========================================================= */

  const loadResume = async (id: number) => {
    try {
      setLoadingResume(true);

      const response = await apiFetch(`/resumes/${id}`);

      if (!response.ok) {
        throw new Error("Failed to load resume");
      }

      const data: ResumeAnalysis = await response.json();

      setAnalysis(data);
      setSelectedResumeId(id);
    } catch (error) {
      console.error("Resume load error:", error);
      toast.error("Unable to load resume details.");
    } finally {
      setLoadingResume(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteResume = async (id: number) => {
    try {
      const response = await apiFetch(`/resumes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      const remaining = history.filter(
        (resume) => resume.id !== id
      );

      setHistory(remaining);

      const dates = getResumeUploadDates();
      delete dates[String(id)];

      localStorage.setItem(
        "resumeUploadDates",
        JSON.stringify(dates)
      );

      toast.success("Resume deleted successfully.");

      if (selectedResumeId === id) {
        setAnalysis(null);
        setSelectedResumeId(null);

        if (remaining.length) {
          await loadResume(remaining[0].id);
        }
      }
    } catch (error) {
      console.error("Delete resume error:", error);
      toast.error("Unable to delete resume.");
    }
  };

  /* =========================================================
     DOWNLOAD
  ========================================================= */

  const downloadResume = async (id: number) => {
    try {
      const response = await apiFetch(
        `/resumes/${id}/file`
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();

      const contentDisposition =
        response.headers.get("Content-Disposition");

      const match = contentDisposition?.match(
        /filename="([^"]+)"/
      );

      const fileName =
        match?.[1] || "resume.pdf";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Resume downloaded.");
    } catch (error) {
      console.error("Download resume error:", error);
      toast.error("Unable to download resume.");
    }
  };

  /* =========================================================
     UPLOAD
  ========================================================= */

  const uploadResume = async () => {
    if (!selectedFile) {
      toast.error("Please select a resume.");
      return;
    }

    const finalCompany =
      company === "Other"
        ? companyOther.trim()
        : company.trim();

    const finalJobRole =
      jobRole === "Other"
        ? jobRoleOther.trim()
        : jobRole.trim();

    if (!finalCompany) {
      toast.error("Please enter target company.");
      return;
    }

    if (!finalJobRole) {
      toast.error("Please enter target job role.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("company", finalCompany);
      formData.append("jobRole", finalJobRole);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/resumes`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Upload failed");
      }

      const uploadedResume = await response.json();

      if (!uploadedResume?.id) {
        throw new Error("Invalid upload response");
      }

      saveResumeUploadDate(uploadedResume.id);

      /*
       * Load the complete backend analysis once.
       * We do not call loadResumeHistory() before this,
       * preventing unnecessary duplicate GET requests.
       */
      await loadResume(uploadedResume.id);

      /*
       * Refresh history without automatically loading
       * another resume.
       */
      await loadResumeHistory(false);

      setSelectedFile(null);
      setCompany("");
      setCompanyOther("");
      setJobRole("");
      setJobRoleOther("");
      setJobDescription("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(
        "Resume analyzed successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Upload resume error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadResumeHistory();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 pb-10">

      <PageHeader
        eyebrow="Resume"
        title="Resume analysis"
        description="Upload your resume and get an AI-powered review tailored to your target company and role."
        actions={null}
      />

      {/* =====================================================
          UPLOAD + ATS
      ===================================================== */}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">

        <SectionCard
          title="Upload new resume"
          description="PDF or DOCX up to 10 MB"
          padded={false}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={(e) =>
              setSelectedFile(
                e.target.files?.[0] || null
              )
            }
          />

          <div className="m-5 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-9 text-center">

            <div className="mx-auto grid size-12 place-items-center rounded-full gradient-brand text-white shadow-glow">
              <UploadCloud className="size-5" />
            </div>

            <div className="mt-3 text-sm font-semibold">
              Upload your resume
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              PDF or DOCX · 10MB maximum
            </div>

            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              Browse files
            </Button>

            {selectedFile && (
              <div className="mx-auto mt-3 max-w-sm truncate rounded-lg bg-background px-3 py-2 text-sm text-muted-foreground">
                {selectedFile.name}
              </div>
            )}

            <div className="mx-auto mt-5 max-w-md space-y-3">

              <Select
                value={company}
                onValueChange={(value) => {
                  setCompany(value);

                  if (value !== "Other") {
                    setCompanyOther("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target company" />
                </SelectTrigger>

                <SelectContent>
                  {companies.map((item) => (
                    <SelectItem
                      key={item}
                      value={item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {company === "Other" && (
                <Input
                  placeholder="Enter company name"
                  value={companyOther}
                  onChange={(e) =>
                    setCompanyOther(e.target.value)
                  }
                />
              )}

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
                  <SelectValue placeholder="Select target job role" />
                </SelectTrigger>

                <SelectContent>
                  {jobRoles.map((item) => (
                    <SelectItem
                      key={item}
                      value={item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {jobRole === "Other" && (
                <Input
                  placeholder="Enter job role"
                  value={jobRoleOther}
                  onChange={(e) =>
                    setJobRoleOther(e.target.value)
                  }
                />
              )}

              <Textarea
                placeholder="Paste job description (optional)"
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                className="min-h-[100px]"
              />

              <Button
                className="w-full"
                onClick={uploadResume}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Analyzing resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Analyze Resume
                  </>
                )}
              </Button>

            </div>
          </div>
        </SectionCard>

        {/* ATS SCORE */}

        <SectionCard
          title="ATS Score"
          description={
            analysis
              ? `${analysis.company} · ${analysis.jobRole}`
              : "No resume selected"
          }
        >
          <div className="flex flex-col items-center justify-center py-3">

            <ProgressRing
              value={analysis?.atsScore || 0}
              size={142}
              stroke={11}
              label="ATS"
              sub="/100"
            />

            <div className="mt-4 text-center">
              <div className="text-sm font-semibold">
                Resume compatibility
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                Based on your selected role and hiring context
              </div>
            </div>

          </div>
        </SectionCard>

      </div>

      {/* =====================================================
          RESUME DETAILS
      ===================================================== */}

      {analysis && (
        <SectionCard
          title="Resume details"
          description="Information associated with the selected resume"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <InfoBox
              icon={FileText}
              label="Resume"
              value={analysis.fileName}
            />

            <InfoBox
              icon={Building2}
              label="Company"
              value={analysis.company}
            />

            <InfoBox
              icon={Briefcase}
              label="Target role"
              value={analysis.jobRole}
            />

            <InfoBox
              icon={CalendarDays}
              label="Uploaded"
              value={formatResumeDate(
                analysis.uploadedAt
              )}
            />

          </div>
        </SectionCard>
      )}

      {/* =====================================================
          SCORES
      ===================================================== */}

      {analysis && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

          <StatCard
            label="Keyword Match"
            value={formatScore(
              scores?.keywordMatch
            )}
            suffix="%"
            icon={Target}
            tone="success"
          />

          <StatCard
            label="Impact"
            value={formatScore(
              scores?.impact
            )}
            suffix="/100"
            icon={Zap}
            tone="brand"
          />

          <StatCard
            label="Readability"
            value={formatScore(
              scores?.readability
            )}
            suffix="/100"
            icon={Type}
          />

          <StatCard
            label="Grammar"
            value={formatScore(
              scores?.grammar
            )}
            suffix="/100"
            icon={Award}
            tone="success"
          />

          <StatCard
            label="Structure"
            value={formatScore(
              scores?.structure
            )}
            suffix="/100"
            icon={FileText}
          />

        </div>
      )}

      {/* =====================================================
          TABS
      ===================================================== */}

      <Tabs defaultValue="overview">

        <TabsList className="grid w-full grid-cols-3 md:w-fit">

          <TabsTrigger value="overview">
            Overview
          </TabsTrigger>

          <TabsTrigger value="skills">
            Skills
          </TabsTrigger>

          <TabsTrigger value="history">
            History
          </TabsTrigger>

        </TabsList>

        {/* ===================================================
            OVERVIEW
        =================================================== */}

        <TabsContent
          value="overview"
          className="mt-4"
        >
          {loadingResume ? (
            <SectionCard>
              <div className="flex items-center justify-center py-10">
                <RefreshCw className="size-5 animate-spin text-muted-foreground" />
              </div>
            </SectionCard>
          ) : analysis ? (
            <div className="space-y-4">

              <SectionCard
                title="AI Resume Insights"
                description="Overall assessment of your resume"
              >
                <div className="flex gap-3">

                  <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-4" />
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {analysisData?.summary ||
                      "No summary available."}
                  </p>

                </div>
              </SectionCard>

              <div className="grid gap-4 md:grid-cols-2">

                <SectionCard
                  title="Strengths"
                  description="What is already working well"
                >
                  <InsightList
                    items={analysisData?.strongAreas}
                    icon={Check}
                    empty="No strengths available."
                    className="bg-success/15 text-success"
                  />
                </SectionCard>

                <SectionCard
                  title="Weak Areas"
                  description="Areas that need attention"
                >
                  <InsightList
                    items={analysisData?.weakAreas}
                    icon={AlertTriangle}
                    empty="No weak areas available."
                    className="bg-warning/20 text-warning"
                  />
                </SectionCard>

              </div>

              <SectionCard
                title="Priority improvements"
                description="Recommended actions ranked by practical impact"
              >
                {analysisData?.improvementSuggestions?.length ? (
                  <div className="space-y-2.5">

                    {analysisData.improvementSuggestions.map(
                      (item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="flex gap-3 rounded-xl border bg-muted/20 p-3.5"
                        >
                          <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                            {index + 1}
                          </div>

                          <div className="text-sm leading-6">
                            {item}
                          </div>
                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <EmptyMessage text="No improvement suggestions available." />
                )}
              </SectionCard>

            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No resume selected"
              description="Upload a resume or select one from history."
            />
          )}
        </TabsContent>

        {/* ===================================================
            SKILLS
        =================================================== */}

        <TabsContent
          value="skills"
          className="mt-4"
        >
          {analysis ? (
            <div className="space-y-4">

              <div className="grid gap-4 md:grid-cols-2">

                <SectionCard
                  title="Missing ATS keywords"
                  description="Exact keywords that may improve search visibility"
                >
                  {analysisData?.missingKeywords?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {analysisData.missingKeywords.map(
                        (keyword, index) => (
                          <Badge
                            key={`${keyword}-${index}`}
                            variant="outline"
                            className="border-destructive/30 bg-destructive/10 text-destructive"
                          >
                            <X className="mr-1 size-3" />
                            {keyword}
                          </Badge>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyMessage text="No missing keywords found." />
                  )}
                </SectionCard>

                <SectionCard
                  title="Missing skills"
                  description="Broader capabilities that could strengthen your profile"
                >
                  {analysisData?.missingSkills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {analysisData.missingSkills.map(
                        (skill, index) => (
                          <Badge
                            key={`${skill}-${index}`}
                            variant="outline"
                            className="border-warning/30 bg-warning/10 text-warning"
                          >
                            <Code2 className="mr-1 size-3" />
                            {skill}
                          </Badge>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyMessage text="No missing skills found." />
                  )}
                </SectionCard>

              </div>

              <SectionCard
                title="Skill coverage"
                description="Quick view of the AI-identified gaps"
              >
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                  <MetricBox
                    label="Missing keywords"
                    value={
                      analysisData?.missingKeywords
                        ?.length || 0
                    }
                  />

                  <MetricBox
                    label="Missing skills"
                    value={
                      analysisData?.missingSkills
                        ?.length || 0
                    }
                  />

                  <MetricBox
                    label="Strong areas"
                    value={
                      analysisData?.strongAreas
                        ?.length || 0
                    }
                  />

                  <MetricBox
                    label="Weak areas"
                    value={
                      analysisData?.weakAreas
                        ?.length || 0
                    }
                  />

                </div>
              </SectionCard>

              <SectionCard
                title="Keyword strategy"
                description="Use missing keywords only when they accurately represent your experience"
              >
                {analysisData?.missingKeywords?.length ? (
                  <>
                    <p className="mb-4 text-sm leading-6 text-muted-foreground">
                      Prioritize keywords that directly match
                      the target role. Add them naturally to
                      relevant skills, project descriptions,
                      or experience bullets only when truthful.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {analysisData.missingKeywords
                        .slice(0, 10)
                        .map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="secondary"
                          >
                            {keyword}
                          </Badge>
                        ))}
                    </div>
                  </>
                ) : (
                  <EmptyMessage text="No keyword recommendations available." />
                )}
              </SectionCard>

            </div>
          ) : (
            <EmptyState
              icon={Code2}
              title="No skills analysis"
              description="Select a resume to view its skill analysis."
            />
          )}
        </TabsContent>

        {/* ===================================================
            HISTORY
        =================================================== */}

        <TabsContent
          value="history"
          className="mt-4"
        >
          <SectionCard
            title="Resume history"
            description={`${history.length} resume${
              history.length === 1 ? "" : "s"
            } available`}
            padded={false}
          >
            {history.length === 0 ? (
              <EmptyState
                icon={UploadCloud}
                title="No resumes uploaded"
                description="Upload your first resume to begin analysis."
              />
            ) : (
              <div className="divide-y divide-border/60">

                {history.map((resume) => {
                  const selected =
                    selectedResumeId === resume.id;

                  return (
                    <div
                      key={resume.id}
                      className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-5 ${
                        selected
                          ? "bg-primary/5"
                          : ""
                      }`}
                    >

                      <span className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
                        <FileText className="size-4" />
                      </span>

                      <div className="min-w-0">

                        <div className="truncate text-sm font-semibold">
                          {resume.fileName}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatResumeDate(
                            resume.uploadedAt
                          )}{" "}
                          · {resume.company} ·{" "}
                          {resume.jobRole}
                        </div>

                      </div>

                      <div className="flex items-center gap-1.5">

                        <Badge
                          variant="outline"
                          className="tabular-nums"
                        >
                          ATS {formatScore(
                            resume.atsScore
                          )}
                        </Badge>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          disabled={loadingResume}
                          onClick={async () => {
                            await loadResume(
                              resume.id
                            );

                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });

                            toast.success(
                              "Resume loaded."
                            );
                          }}
                        >
                          <Eye className="size-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() =>
                            downloadResume(
                              resume.id
                            )
                          }
                        >
                          <Download className="size-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            deleteResume(
                              resume.id
                            )
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </Button>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}
          </SectionCard>
        </TabsContent>

      </Tabs>

    </div>
  );
}

/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

function EmptyMessage({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function MetricBox({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="text-2xl font-bold tabular-nums">
        {value}
      </div>

      <div className="mt-1 text-xs text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </div>

      <div className="mt-2 truncate text-sm font-semibold">
        {value || "Not available"}
      </div>
    </div>
  );
}

function InsightList({
  items,
  icon: Icon,
  empty,
  className,
}: {
  items?: string[];
  icon: typeof Check;
  empty: string;
  className: string;
}) {
  if (!items?.length) {
    return <EmptyMessage text={empty} />;
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-2.5 text-sm"
        >
          <span
            className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${className}`}
          >
            <Icon className="size-3" />
          </span>

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
