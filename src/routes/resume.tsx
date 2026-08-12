import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard, StatCard, ProgressRing, EmptyState } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/routes/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { ResumeHistory, ResumeAnalysis } from "@/features/resume/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "Resume · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <ResumePage />
    </AppShell>
  ),
});

function ResumePage() {
  const formatResumeDate = (date: string | null | undefined) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
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
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [company, setCompany] = useState("");

  const [jobRole, setJobRole] = useState("");

  const [companyOther, setCompanyOther] = useState("");
  const [jobRoleOther, setJobRoleOther] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const getResumeUploadDates = (): Record<string, string> => {
  try {
    return JSON.parse(
      localStorage.getItem("resumeUploadDates") || "{}"
    );
  } catch {
    return {};
  }
};

const saveResumeUploadDate = (resumeId: number) => {
  const dates = getResumeUploadDates();

  dates[String(resumeId)] = new Date().toISOString();

  localStorage.setItem(
    "resumeUploadDates",
    JSON.stringify(dates)
  );

  return dates[String(resumeId)];
};
  const loadResumeHistory = async () => {
  try {
    const response = await apiFetch("/resumes");

    if (!response.ok) {
      throw new Error("Failed to load resume history");
    }

    const data: ResumeHistory[] = await response.json();

    const savedDates = getResumeUploadDates();

    const historyWithDates = data.map((resume) => {
      let uploadedAt = savedDates[String(resume.id)];

      // If this resume doesn't have a frontend date yet,
      // create one now.
      if (!uploadedAt) {
        uploadedAt = new Date().toISOString();

        savedDates[String(resume.id)] = uploadedAt;
      }

      return {
        ...resume,
        uploadedAt,
      };
    });

    // Save any newly generated dates
    localStorage.setItem(
      "resumeUploadDates",
      JSON.stringify(savedDates)
    );

    setHistory(historyWithDates);

    if (historyWithDates.length > 0) {
      loadResume(historyWithDates[0].id);
    }
  } catch (error) {
    console.error("Resume history error:", error);
    toast.error("Unable to load resumes.");
  } finally {
    setLoading(false);
  }
};
  const loadResume = async (id: number) => {
    try {
      const response = await apiFetch(`/resumes/${id}`);

      if (!response.ok) throw new Error();

      const data = await response.json();

      setAnalysis(data);

      setSelectedResumeId(id);
    } catch {
      toast.error("Unable to load resume.");
    }
  };

  const deleteResume = async (id: number) => {
    try {
      const response = await apiFetch(`/resumes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("Resume deleted.");

      await loadResumeHistory();
    } catch {
      toast.error("Unable to delete resume.");
    }
  };
  const downloadResume = async (id: number) => {
    try {
      const response = await apiFetch(`/resumes/${id}/file`);

      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();

      const contentDisposition = response.headers.get("Content-Disposition");

      let fileName = "resume.pdf";

      const match = contentDisposition?.match(/filename="([^"]+)"/);

      if (match?.[1]) {
        fileName = match[1];
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download resume error:", error);

      toast.error("Unable to download resume.");
    }
  };

  const uploadResume = async () => {
    if (!selectedFile) {
      toast.error("Please select a resume.");
      return;
    }

    const finalCompany = company === "Other" ? companyOther.trim() : company.trim();

    const finalJobRole = jobRole === "Other" ? jobRoleOther.trim() : jobRole.trim();

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

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resumes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const uploadedResume = await response.json();
      if (uploadedResume?.id) {
  saveResumeUploadDate(uploadedResume.id);
}
      toast.success("Resume uploaded successfully.");

      // Immediately show the newly uploaded review
      if (uploadedResume?.id) {
        await loadResume(uploadedResume.id);
      }

      // Refresh history
      await loadResumeHistory();

      // Reset form
      setSelectedFile(null);
      setCompany("");
      setCompanyOther("");
      setJobRole("");
      setJobRoleOther("");
      setJobDescription("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Scroll to the review
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Upload resume error:", error);

      toast.error("Unable to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    loadResumeHistory();
  }, []);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resume"
        title="Resume analysis"
        description="Upload your resume and let the AI grade it against your target role, ATS filters and industry benchmarks."
        actions={null}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Upload zone */}
        <SectionCard title="Upload new resume" description="PDF or DOCX up to 10 MB" padded={false}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />
          <div className="m-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors hover:border-primary/60 hover:bg-primary/[0.04]">
            <div className="grid size-12 place-items-center rounded-full gradient-brand text-white shadow-glow">
              <UploadCloud className="size-5" />
            </div>
            <div className="mt-3 text-sm font-semibold">Drag & drop your resume here</div>
            <div className="mt-1 text-xs text-muted-foreground">
              or click to browse — PDF, DOCX · 10MB max
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse files
            </Button>
            {selectedFile && (
              <div className="mt-3 text-sm text-muted-foreground">{selectedFile.name}</div>
            )}

            <div className="mt-4 space-y-3">
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
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {company === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Enter company name"
                  value={companyOther}
                  onChange={(e) => setCompanyOther(e.target.value)}
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
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {jobRole === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Enter job role"
                  value={jobRoleOther}
                  onChange={(e) => setJobRoleOther(e.target.value)}
                />
              )}

              <Textarea
                placeholder="Job Description (Optional)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <Button className="w-full" onClick={uploadResume} disabled={uploading}>
                {uploading ? (
                  <>
                    <span
                      className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                      aria-hidden="true"
                    />
                    Uploading...
                  </>
                ) : (
                  "Upload Resume"
                )}
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="ATS Score"
          description={
            history.length > 0
              ? (history.find((h) => h.id === selectedResumeId)?.fileName ?? "Resume Analysis")
              : "No resume selected"
          }
        >
          <div className="flex flex-col items-center gap-3">
            <ProgressRing
              value={analysis?.analysis?.atsScore ?? analysis?.atsScore ?? 0}
              size={132}
              stroke={10}
              label="ATS"
              sub="/100"
            />
            <div className="text-center">
              <div className="text-sm font-medium">AI Resume Score</div>
              <div className="text-xs text-muted-foreground">
                Based on your target company and role
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard
          label="Impact Score"
          value={analysis?.analysis?.scores?.impact ?? 0}
          suffix="/100"
          icon={Zap}
          tone="brand"
        />

        <StatCard
          label="Keyword Match"
          value={analysis?.analysis?.scores?.keywordMatch ?? 0}
          suffix="%"
          icon={Target}
          tone="success"
        />

        <StatCard
          label="Readability"
          value={analysis?.analysis?.scores?.readability ?? 0}
          suffix="/100"
          icon={Type}
        />

        <StatCard
          label="Grammar"
          value={analysis?.analysis?.scores?.grammar ?? 0}
          suffix="/100"
          icon={Award}
          tone="success"
        />
        <StatCard
          label="Structure"
          value={analysis?.analysis?.scores?.structure ?? 0}
          suffix="/100"
          icon={FileText}
        />
      </div>

      <Tabs defaultValue="insights">
        <TabsList>
          <TabsTrigger value="insights">AI insights</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-4">
          <div className="space-y-4">
            <SectionCard title="AI Insights" description="AI-generated resume analysis">
              <p className="text-sm leading-6 text-muted-foreground">
                {analysis?.analysis?.summary || "No AI insights available."}
              </p>
            </SectionCard>

            <div className="grid gap-4 md:grid-cols-2">
              <SectionCard title="Strengths" description="What's working well">
                {analysis?.analysis?.strongAreas?.length ? (
                  <ul className="space-y-2.5">
                    {analysis.analysis.strongAreas.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                          <Check className="size-3" />
                        </span>

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No strengths available.</p>
                )}
              </SectionCard>

              <SectionCard title="Weak Areas" description="Fix these to improve your score">
                {analysis?.analysis?.weakAreas?.length ? (
                  <ul className="space-y-2.5">
                    {analysis.analysis.weakAreas.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-warning/20 text-warning">
                          <AlertTriangle className="size-3" />
                        </span>

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No weak areas available.</p>
                )}
              </SectionCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard
              title="Missing Keywords"
              description="Keywords recommended for your target role"
            >
              {analysis?.analysis?.missingKeywords?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysis.analysis.missingKeywords.map((keyword, index) => (
                    <Badge
                      key={`${keyword}-${index}`}
                      variant="outline"
                      className="border-destructive/30 bg-destructive/10 text-destructive"
                    >
                      <X className="mr-1 size-3" />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No missing keywords found.</p>
              )}
            </SectionCard>

            <SectionCard
              title="Missing Skills"
              description="Skills that could strengthen your resume"
            >
              {analysis?.analysis?.missingSkills?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {analysis.analysis.missingSkills.map((skill, index) => (
                    <Badge key={`${skill}-${index}`} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No missing skills found.</p>
              )}
            </SectionCard>

            <SectionCard title="Improvement Suggestions" description="Recommended changes">
              {analysis?.analysis?.improvementSuggestions?.length ? (
                <ul className="space-y-2">
                  {analysis.analysis.improvementSuggestions.map((suggestion, index) => (
                    <li key={`${suggestion}-${index}`} className="rounded-lg border p-3 text-sm">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No improvement suggestions available.
                </p>
              )}
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SectionCard padded={false}>
            {history.length === 0 ? (
              <EmptyState
                icon={UploadCloud}
                title="No resumes uploaded"
                description="Upload your first resume to begin analysis."
              />
            ) : (
              <div className="divide-y divide-border/60">
                {history.map((r) => (
                  <div
                    key={r.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5"
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <FileText className="size-4" />
                    </span>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{r.fileName}</div>

                      <div className="text-xs text-muted-foreground">
                        {formatResumeDate(r.uploadedAt)} · {r.company} · {r.jobRole}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="tabular-nums">
                        ATS {r.atsScore}
                      </Badge>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        onClick={async () => {
                          await loadResume(r.id);

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                      >
                        <Eye className="size-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        onClick={async () => {
                          await downloadResume(r.id);
                        }}
                      >
                        <Download className="size-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        onClick={async () => {
                          await deleteResume(r.id);
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
