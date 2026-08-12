import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Award, Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type {
  ProfileResponse,
  Experience,
  ExperienceRequest,
  Education,
  EducationRequest,
  Skill,
  SkillRequest,
} from "@/features/profile/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { LoadingSpinner } from "./LoadingSpinner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · InterviewOS AI" }] }),
  component: () => (
    <AppShell>
      <ProfilePage />
    </AppShell>
  ),
});

function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editExperience, setEditExperience] = useState<Experience | null>(null);
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    company: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [education, setEducation] = useState<Education[]>([]);
  const [editEducation, setEditEducation] = useState<Education | null>(null);
  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);

  const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: 0,
    endYear: 0,
    grade: "",
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  const [skillForm, setSkillForm] = useState({
    skillName: "",
  });

  const openAddExperience = () => {
    setEditExperience(null);

    setExperienceForm({
      company: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      description: "",
    });

    setIsAddExperienceOpen(true);
  };

  const openEditExperience = (experience: Experience) => {
    setEditExperience(experience);

    setExperienceForm({
      company: experience.company,
      jobTitle: experience.jobTitle,
      startDate: experience.startDate,
      endDate: experience.endDate ?? "",
      description: experience.description,
    });
  };

  const openAddEducation = () => {
    setEditEducation(null);

    setEducationForm({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      grade: "",
    });

    setIsAddEducationOpen(true);
  };

  const openEditEducation = (education: Education) => {
    setEditEducation(education);

    setEducationForm({
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startYear: education.startYear,
      endYear: education.endYear,
      grade: education.grade ?? "",
    });
  };

  const addSkill = async (skill: SkillRequest) => {
    const response = await apiFetch("/auth/skills", {
      method: "POST",
      body: JSON.stringify(skill),
    });

    if (!response.ok) {
      throw new Error("Unable to add skill.");
    }

    const created = await response.json();

    setSkills((prev) => [...prev, created]);
  };

  const updateSkill = async (id: number, skill: SkillRequest) => {
    const response = await apiFetch(`/auth/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(skill),
    });

    if (!response.ok) {
      throw new Error("Unable to update skill.");
    }

    const updated = await response.json();

    setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const deleteSkill = async (id: number) => {
    const response = await apiFetch(`/auth/skills/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete skill.");
    }

    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const saveBio = async () => {
    try {
      const response = await apiFetch("/auth/bio", {
        method: "PUT",
        body: JSON.stringify({
          shortBio: bio,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bio");
      }

      const updated = await response.json();

      setProfile(updated);
      setBio(updated.shortBio);

      toast.success("Bio updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update bio.");
    }
  };
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiFetch("/auth/profile");

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data: ProfileResponse = await response.json();

        setProfile(data);
        setExperiences(data.experience);
        setEducation(data.education);
        setBio(data.shortBio);
        setSkills(data.skills);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return <div>Unable to load profile.</div>;
  }

  const addExperience = async (experience: ExperienceRequest) => {
    const response = await apiFetch("/auth/experience", {
      method: "POST",
      body: JSON.stringify(experience),
    });

    if (!response.ok) {
      throw new Error("Unable to add experience.");
    }

    const created = await response.json();

    setExperiences((prev) => [...prev, created]);
  };

  const updateExperience = async (id: number, experience: ExperienceRequest) => {
    const response = await apiFetch(`/auth/experience/${id}`, {
      method: "PUT",
      body: JSON.stringify(experience),
    });

    if (!response.ok) {
      throw new Error("Unable to update experience.");
    }

    const updated = await response.json();

    setExperiences((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const deleteExperience = async (id: number) => {
    const response = await apiFetch(`/auth/experience/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete experience.");
    }

    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const addEducation = async (education: EducationRequest) => {
    const response = await apiFetch("/auth/education", {
      method: "POST",
      body: JSON.stringify(education),
    });

    if (!response.ok) {
      throw new Error("Unable to add education.");
    }

    const created = await response.json();

    setEducation((prev) => [...prev, created]);
  };

  const updateEducation = async (id: number, education: EducationRequest) => {
    const response = await apiFetch(`/auth/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(education),
    });

    if (!response.ok) {
      throw new Error("Unable to update education.");
    }

    const updated = await response.json();

    setEducation((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const deleteEducation = async (id: number) => {
    const response = await apiFetch(`/auth/education/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete education.");
    }

    setEducation((prev) => prev.filter((e) => e.id !== id));
  };

  const openAddSkill = () => {
    setEditSkill(null);

    setSkillForm({
      skillName: "",
    });

    setIsAddSkillOpen(true);
  };

  const openEditSkill = (skill: Skill) => {
    setEditSkill(skill);

    setSkillForm({
      skillName: skill.skillName,
    });
  };

  const saveEducation = async () => {
    const request = {
      institution: educationForm.institution,
      degree: educationForm.degree,
      fieldOfStudy: educationForm.fieldOfStudy,
      startYear: educationForm.startYear,
      endYear: educationForm.endYear,
      grade: educationForm.grade,
    };

    if (editEducation) {
      await updateEducation(editEducation.id, request);
    } else {
      await addEducation(request);
    }

    setEditEducation(null);
    setIsAddEducationOpen(false);
    setEducationForm({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startYear: 0,
      endYear: 0,
      grade: "",
    });
  };

  const saveSkill = async () => {
    const request = {
      skillName: skillForm.skillName,
    };

    if (editSkill) {
      await updateSkill(editSkill.id, request);
    } else {
      await addSkill(request);
    }

    setEditSkill(null);
    setIsAddSkillOpen(false);
    setSkillForm({
      skillName: "",
    });
  };

  const saveExperience = async () => {
    if (editExperience) {
      await updateExperience(editExperience.id, {
        company: experienceForm.company,
        jobTitle: experienceForm.jobTitle,
        startDate: experienceForm.startDate,
        endDate: experienceForm.endDate || null,
        description: experienceForm.description,
      });
    } else {
      await addExperience({
        company: experienceForm.company,
        jobTitle: experienceForm.jobTitle,
        startDate: experienceForm.startDate,
        endDate: experienceForm.endDate || null,
        description: experienceForm.description,
      });
    }

    setEditExperience(null);
    setIsAddExperienceOpen(false);
    setExperienceForm({
      company: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Your career OS"
        description="Everything the AI knows about you."
      />

      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl gradient-brand text-xl font-bold text-white shadow-glow">
            {profile.name
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{profile.name}</h2>

            <div className="mt-0.5 text-sm text-muted-foreground">{profile.role}</div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                San Francisco, CA
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="size-3" />
                Targeting Google L5
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Edit profile
          </Button>
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Experience" description="Roles that shape your résumé">
          <ul className="space-y-3">
            {experiences.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <Briefcase className="size-4" />
                  </span>

                  <div className="min-w-0">
                    <div className="text-sm font-medium">{e.jobTitle}</div>

                    <div className="text-xs text-muted-foreground">
                      {e.company} · {e.startDate} — {e.endDate ?? "Present"}
                    </div>

                    {e.description && (
                      <div className="mt-1 text-xs text-muted-foreground">{e.description}</div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditExperience(e)}>
                    Edit
                  </Button>

                  <Button size="sm" variant="destructive" onClick={() => deleteExperience(e.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-end">
            <Button onClick={openAddExperience}>Add Experience</Button>
          </div>
        </SectionCard>
        <SectionCard title="Education" description="Academic qualifications">
          <ul className="space-y-3">
            {education.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="mt-0.5 grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <GraduationCap className="size-4" />
                  </span>

                  <div>
                    <div className="text-sm font-medium">
                      {e.degree} in {e.fieldOfStudy}
                    </div>

                    <div className="text-xs text-muted-foreground">{e.institution}</div>

                    <div className="text-xs text-muted-foreground">
                      {e.startYear} - {e.endYear}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditEducation(e)}>
                    Edit
                  </Button>

                  <Button size="sm" variant="destructive" onClick={() => deleteEducation(e.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-end">
            <Button onClick={openAddEducation}>Add Education</Button>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Skills" description="AI-verified against your resume & practice">
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between rounded-lg border p-3">
              <Badge variant="outline" className="gap-1">
                <Award className="size-3 text-primary" />
                {skill.skillName}
              </Badge>

              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEditSkill(skill)}>
                  Edit
                </Button>

                <Button size="sm" variant="destructive" onClick={() => deleteSkill(skill.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button onClick={openAddSkill}>Add Skill</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Bio">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fn">Full Name</Label>
            <Input id="fn" value={profile.name} disabled />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="em">Email</Label>
            <Input id="em" value={profile.email} disabled />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bio">Short Bio</Label>

            <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button onClick={saveBio}>Save Bio</Button>
          </div>
        </div>
      </SectionCard>

      <Dialog
        open={editExperience !== null || isAddExperienceOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditExperience(null);
            setIsAddExperienceOpen(false);
            setExperienceForm({
              company: "",
              jobTitle: "",
              startDate: "",
              endDate: "",
              description: "",
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editExperience ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Company</Label>

              <Input
                value={experienceForm.company}
                onChange={(e) =>
                  setExperienceForm({
                    ...experienceForm,
                    company: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Job Title</Label>

              <Input
                value={experienceForm.jobTitle}
                onChange={(e) =>
                  setExperienceForm({
                    ...experienceForm,
                    jobTitle: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Start Date</Label>

              <Input
                type="date"
                value={experienceForm.startDate}
                onChange={(e) =>
                  setExperienceForm({
                    ...experienceForm,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>End Date</Label>

              <Input
                type="date"
                value={experienceForm.endDate}
                onChange={(e) =>
                  setExperienceForm({
                    ...experienceForm,
                    endDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Description</Label>

              <Textarea
                rows={4}
                value={experienceForm.description}
                onChange={(e) =>
                  setExperienceForm({
                    ...experienceForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditExperience(null);
                setIsAddExperienceOpen(false);

                setExperienceForm({
                  company: "",
                  jobTitle: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                });
              }}
            >
              Cancel
            </Button>

            <Button onClick={saveExperience}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editEducation !== null || isAddEducationOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditEducation(null);
            setIsAddEducationOpen(false);
            setEducationForm({
              institution: "",
              degree: "",
              fieldOfStudy: "",
              startYear: 0,
              endYear: 0,
              grade: "",
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editEducation ? "Edit Education" : "Add Education"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Institution"
              value={educationForm.institution}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  institution: e.target.value,
                })
              }
            />

            <Input
              placeholder="Degree"
              value={educationForm.degree}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  degree: e.target.value,
                })
              }
            />

            <Input
              placeholder="Field of Study"
              value={educationForm.fieldOfStudy}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  fieldOfStudy: e.target.value,
                })
              }
            />

            <Input
              type="number"
              placeholder="Start Year"
              value={educationForm.startYear}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  startYear: Number(e.target.value),
                })
              }
            />

            <Input
              type="number"
              placeholder="End Year"
              value={educationForm.endYear}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  endYear: Number(e.target.value),
                })
              }
            />

            <Input
              placeholder="Grade"
              value={educationForm.grade}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  grade: e.target.value,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditEducation(null);
                setIsAddEducationOpen(false);
                setEducationForm({
                  institution: "",
                  degree: "",
                  fieldOfStudy: "",
                  startYear: 0,
                  endYear: 0,
                  grade: "",
                });
              }}
            >
              Cancel
            </Button>

            <Button onClick={saveEducation}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editSkill !== null || isAddSkillOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditSkill(null);
            setIsAddSkillOpen(false);
            setSkillForm({
              skillName: "",
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Skill"
            value={skillForm.skillName}
            onChange={(e) =>
              setSkillForm({
                skillName: e.target.value,
              })
            }
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditSkill(null);
                setIsAddSkillOpen(false);
                setSkillForm({
                  skillName: "",
                });
              }}
            >
              Cancel
            </Button>

            <Button onClick={saveSkill}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
