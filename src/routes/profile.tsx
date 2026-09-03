import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  PageHeader,
  SectionCard,
} from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/routes/LoadingSpinner";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

import {
  Camera,
  User,
  Mail,
  Briefcase,
  Github,
  Linkedin,
  MapPin,
  LogOut,
  Trash2,
  Save,
  FileText,
  Code2,
  X,
  GraduationCap,
  Plus,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   ROUTE
   ============================================================ */

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      {
        title: "Profile · CareerPilot",
      },
    ],
  }),

  component: () => (
    <AppShell>
      <ProfilePage />
    </AppShell>
  ),
});

/* ============================================================
   TYPES
   ============================================================ */

interface Experience {
  id?: number;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface Education {
  id?: number;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
}

interface ProfileData {
  id?: number;
  name?: string;
  email?: string;
  shortBio?: string;
  role?: string;
  profilePicture?: string;
}

/* ============================================================
   PROFILE PAGE
   ============================================================ */

function ProfilePage() {
  /* ==========================================================
     BASIC PROFILE STATE
     ========================================================== */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [profile, setProfile] =
  useState<ProfileData>({
    name: "",
    email: "",
    shortBio: "",
    role: "",
    profilePicture: "",
  });

  const [skillsText, setSkillsText] =
    useState("");

  /* ==========================================================
     EXPERIENCE STATE
     ========================================================== */

  const [experiences, setExperiences] =
    useState<Experience[]>([]);

  const [showExperienceForm, setShowExperienceForm] =
    useState(false);

  const [newExperience, setNewExperience] =
    useState<Experience>({
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });

  /* ==========================================================
     EDUCATION STATE
     ========================================================== */

  const [education, setEducation] =
    useState<Education[]>([]);

  const [showEducationForm, setShowEducationForm] =
    useState(false);

  const [newEducation, setNewEducation] =
    useState<Education>({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      grade: "",
    });

  /* ==========================================================
     PROFILE IMAGE
     ========================================================== */

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const profileImageInputRef =
    useRef<HTMLInputElement>(null);

  /* ==========================================================
     LOAD PROFILE
     ========================================================== */

  const loadProfile = async () => {
  try {
    setLoading(true);

    const response =
      await apiFetch("/auth/profile");

    if (!response.ok) {
      throw new Error(
        `Failed to load profile: ${response.status}`
      );
    }

    const data =
      await response.json();

    const profileData: ProfileData = {
      id: data.id,
      name: data.name ?? "",
      email: data.email ?? "",
      shortBio: data.shortBio ?? "",
      role: data.role ?? "",
      profilePicture:
        data.profilePicture ?? "",
    };

    setProfile(profileData);

    setProfileImage(
      data.profilePicture ?? null
    );

    /*
     * Backend returns Skill objects:
     *
     * [
     *   { id: 1, skillName: "Java" }
     * ]
     */
    if (Array.isArray(data.skills)) {
      setSkillsText(
        data.skills
          .map(
            (skill: {
              skillName?: string;
            }) =>
              skill.skillName ?? ""
          )
          .filter(Boolean)
          .join(", ")
      );
    } else {
      setSkillsText("");
    }

    /*
     * Backend field is "experience"
     */
    if (Array.isArray(data.experience)) {
      setExperiences(
        data.experience.map(
          (item: any) => ({
            id: item.id,
            company:
              item.company ?? "",
            role:
              item.jobTitle ?? "",
            location: "",
            startDate:
              item.startDate ?? "",
            endDate:
              item.endDate ?? "",
            current:
              item.endDate == null,
            description:
              item.description ?? "",
          })
        )
      );
    } else {
      setExperiences([]);
    }

    /*
     * Backend education format is
     * slightly different from the old frontend.
     */
    if (Array.isArray(data.education)) {
      setEducation(
        data.education.map(
          (item: any) => ({
            id: item.id,
            institution:
              item.institution ?? "",
            degree:
              item.degree ?? "",
            field:
              item.fieldOfStudy ?? "",
            startDate:
              item.startYear
                ? String(item.startYear)
                : "",
            endDate:
              item.endYear
                ? String(item.endYear)
                : "",
            grade:
              item.grade ?? "",
          })
        )
      );
    } else {
      setEducation([]);
    }

  } catch (error) {

    console.error(
      "Profile loading error:",
      error
    );

    toast.error(
      "Unable to load profile."
    );

  } finally {
    setLoading(false);
  }
};

  /* ==========================================================
     LOAD PROFILE ON PAGE OPEN
     ========================================================== */

  useEffect(() => {
    loadProfile();
  }, []);

  /* ==========================================================
     UPDATE PROFILE FIELD
     ========================================================== */

  const updateProfile = (
    field: keyof ProfileData,
    value: string
  ) => {
    setProfile(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  /* ==========================================================
     PROFILE IMAGE
     ========================================================== */

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      toast.error(
        "Please select an image file."
      );

      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      toast.error(
        "Profile image must be smaller than 2MB."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const imageUrl =
        reader.result as string;

      setProfileImage(
        imageUrl
      );

      toast.success(
        "Profile picture updated."
      );
    };

    reader.readAsDataURL(file);
  };

  /* ==========================================================
     REMOVE PROFILE IMAGE
     ========================================================== */

  const removeProfileImage = () => {
  setProfileImage(null);

  setProfile(
    previous => ({
      ...previous,
      profilePicture: "",
    })
  );

  if (
    profileImageInputRef.current
  ) {
    profileImageInputRef.current.value =
      "";
  }

  toast.success(
    "Profile picture removed."
  );
};

  /* ==========================================================
     SAVE PROFILE
     ========================================================== */

  const saveProfile = async () => {
    try {
      setSaving(true);

      const skills =
        skillsText
          .split(",")
          .map(
            (skill) =>
              skill.trim()
          )
          .filter(Boolean);

      const payload = {
        name: profile.name,

        email: profile.email,

       
        skills,

       

        /*
         * Send these only if your backend
         * supports them.
         */
        experiences,

        education,
      };

      const response =
        await apiFetch(
          "/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to save profile"
        );
      }

      setProfile(
        (previous) => ({
          ...previous,
          skills,
        })
      );

      toast.success(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     LOGOUT
     ========================================================== */

  const handleLogout = () => {

  localStorage.removeItem(
    "token"
  );

  toast.success(
    "Logged out successfully."
  );

  window.location.href =
    "/login";
};

  /* ==========================================================
     INITIALS
     ========================================================== */

  const getInitials = () => {
    const name =
      profile.name?.trim();

    if (!name) {
      return "U";
    }

    const parts =
      name.split(/\s+/);

    if (parts.length === 1) {
      return parts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[
        parts.length - 1
      ][0]
    ).toUpperCase();
  };

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your personal information, career details, skills and professional background."
        actions={
          <Button
            onClick={
              saveProfile
            }
            disabled={
              saving
            }
          >
            {saving ? (
              <>
                <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            )}
          </Button>
        }
      />

      {/* ======================================================
          PROFILE HERO
          ====================================================== */}

      <SectionCard
        padded={false}
      >
        <div className="relative overflow-hidden rounded-xl">

          {/* COVER */}

          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

          <div className="px-6 pb-6">

            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">

              {/* PROFILE IMAGE */}

              <div className="relative shrink-0">

                <div className="size-28 overflow-hidden rounded-full border-4 border-background bg-muted shadow-lg">

                  {profileImage ? (
                    <img
                      src={
                        profileImage
                      }
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-primary/10 text-2xl font-bold text-primary">
                      {getInitials()}
                    </div>
                  )}

                </div>

                <input
                  ref={
                    profileImageInputRef
                  }
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={
                    handleProfileImageChange
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    profileImageInputRef.current?.click()
                  }
                  className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full border-2 border-background bg-card shadow-md transition hover:scale-105 hover:bg-muted"
                  title="Change profile picture"
                >
                  <Camera className="size-4 text-muted-foreground" />
                </button>

              </div>

              {/* PROFILE DETAILS */}

              <div className="min-w-0 flex-1">

                <h2 className="truncate text-xl font-bold">
                  {profile.name ||
                    "Your Name"}
                </h2>

                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-3.5" />

                  {profile.email ||
                    "Email not available"}
                </p>

               

              </div>

            </div>

            {/* PHOTO ACTIONS */}

            <div className="mt-4 flex flex-wrap gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  profileImageInputRef.current?.click()
                }
              >
                <Camera className="mr-2 size-3.5" />
                Change Photo
              </Button>

              {profileImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={
                    removeProfileImage
                  }
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 size-3.5" />
                  Remove
                </Button>
              )}

            </div>

          </div>

        </div>
      </SectionCard>

      {/* ======================================================
          PERSONAL INFORMATION
          ====================================================== */}

      <SectionCard
        title="Personal Information"
        description="Your basic personal information."
      >

        <div className="grid gap-5 md:grid-cols-2">

          {/* NAME */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Full Name
            </label>

            <div className="relative">

              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={
                  profile.name ??
                  ""
                }
                onChange={(event) =>
                  updateProfile(
                    "name",
                    event.target.value
                  )
                }
                className="pl-9"
                placeholder="Enter your full name"
              />

            </div>

          </div>

          {/* EMAIL */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Email
            </label>

            <div className="relative">

              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="email"
                value={
                  profile.email ??
                  ""
                }
                onChange={(event) =>
                  updateProfile(
                    "email",
                    event.target.value
                  )
                }
                className="pl-9"
                placeholder="Enter your email"
              />

            </div>

          </div>

          {/* PHONE */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Phone
            </label>

          </div>

          {/* LOCATION */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Location
            </label>

            <div className="relative">

              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            </div>

          </div>

        </div>

      </SectionCard>

      {/* ======================================================
          CAREER INFORMATION
          ====================================================== */}

      <SectionCard
        title="Career Information"
        description="Tell CareerPilot what kind of opportunities you are targeting."
      >

        <div className="space-y-5">

          {/* TARGET ROLE */}

          <div className="space-y-2">

            <label className="flex items-center gap-2 text-sm font-medium">

              <Briefcase className="size-4 text-muted-foreground" />

              Target Job Role

            </label>

          </div>

          {/* BIO */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              About You
            </label>
            <p className="text-xs text-muted-foreground">
              Keep it concise and focused on your career.
            </p>

          </div>

        </div>

      </SectionCard>

      {/* ======================================================
          SKILLS
          ====================================================== */}

      <SectionCard
        title="Skills"
        description="Add the technical and professional skills you want recruiters to see."
      >

        <div className="space-y-4">

          <div className="space-y-2">

            <label className="flex items-center gap-2 text-sm font-medium">

              <Code2 className="size-4 text-muted-foreground" />

              Your Skills

            </label>

            <Input
              value={
                skillsText
              }
              onChange={(event) =>
                setSkillsText(
                  event.target.value
                )
              }
              placeholder="Java, Spring Boot, React, PostgreSQL, Python"
            />

            <p className="text-xs text-muted-foreground">
              Separate each skill using commas.
            </p>

          </div>

          {skillsText && (
            <div className="flex flex-wrap gap-2">

              {skillsText
                .split(",")
                .map(
                  (skill) =>
                    skill.trim()
                )
                .filter(Boolean)
                .map(
                  (
                    skill,
                    index
                  ) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  )
                )}

            </div>
          )}

        </div>

      </SectionCard>

      {/* ======================================================
          EXPERIENCE
          ====================================================== */}

      <SectionCard
        title="Experience"
        description="Add your professional experience, internships and work history."
      >

        <div className="space-y-5">

          {/* EMPTY STATE */}

          {experiences.length ===
            0 && (
            <div className="rounded-xl border border-dashed p-8 text-center">

              <Briefcase className="mx-auto size-8 text-muted-foreground" />

              <h3 className="mt-3 text-sm font-semibold">
                No experience added
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Add your work experience to build a stronger career profile.
              </p>

            </div>
          )}

          {/* EXPERIENCE LIST */}

          {experiences.map(
            (
              experience,
              index
            ) => (
              <div
                key={
                  experience.id ??
                  index
                }
                className="rounded-xl border p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex gap-3">

                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">

                      <Briefcase className="size-5" />

                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {
                          experience.role
                        }
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {
                          experience.company
                        }
                      </p>

                      {experience.location && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {
                            experience.location
                          }
                        </p>
                      )}

                      <p className="mt-2 text-xs text-muted-foreground">

                        {
                          experience.startDate
                        }

                        {" — "}

                        {experience.current
                          ? "Present"
                          : experience.endDate ||
                            "Present"}

                      </p>

                    </div>

                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {

                      setExperiences(
                        (
                          previous
                        ) =>
                          previous.filter(
                            (
                              _,
                              i
                            ) =>
                              i !==
                              index
                          )
                      );

                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>

                </div>

                {experience.description && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {
                      experience.description
                    }
                  </p>
                )}

              </div>
            )
          )}

          {/* ADD EXPERIENCE BUTTON */}

          {!showExperienceForm ? (
            <Button
              variant="outline"
              onClick={() =>
                setShowExperienceForm(
                  true
                )
              }
            >
              <Plus className="mr-2 size-4" />

              Add Experience
            </Button>
          ) : (

            /* EXPERIENCE FORM */

            <div className="rounded-xl border bg-muted/20 p-5">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    Add Experience
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    Add your job or internship details.
                  </p>

                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setShowExperienceForm(
                      false
                    )
                  }
                >
                  <X className="size-4" />
                </Button>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                {/* ROLE */}

                <Input
                  placeholder="Job title"
                  value={
                    newExperience.role
                  }
                  onChange={(event) =>
                    setNewExperience(
                      {
                        ...newExperience,
                        role:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* COMPANY */}

                <Input
                  placeholder="Company"
                  value={
                    newExperience.company
                  }
                  onChange={(event) =>
                    setNewExperience(
                      {
                        ...newExperience,
                        company:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* LOCATION */}

                <Input
                  placeholder="Location"
                  value={
                    newExperience.location
                  }
                  onChange={(event) =>
                    setNewExperience(
                      {
                        ...newExperience,
                        location:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* START DATE */}

                <Input
                  type="date"
                  value={
                    newExperience.startDate
                  }
                  onChange={(event) =>
                    setNewExperience(
                      {
                        ...newExperience,
                        startDate:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* END DATE */}

                <Input
                  type="date"
                  value={
                    newExperience.endDate
                  }
                  disabled={
                    newExperience.current
                  }
                  onChange={(event) =>
                    setNewExperience(
                      {
                        ...newExperience,
                        endDate:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* CURRENT */}

                <label className="flex items-center gap-2 text-sm">

                  <input
                    type="checkbox"
                    checked={
                      newExperience.current
                    }
                    onChange={(event) =>
                      setNewExperience(
                        {
                          ...newExperience,
                          current:
                            event
                              .target
                              .checked,
                          endDate:
                            event
                              .target
                              .checked
                              ? ""
                              : newExperience.endDate,
                        }
                      )
                    }
                  />

                  Currently working here

                </label>

              </div>

              {/* DESCRIPTION */}

              <Textarea
                className="mt-4 min-h-28"
                placeholder="Describe your responsibilities, achievements and technologies..."
                value={
                  newExperience.description
                }
                onChange={(event) =>
                  setNewExperience(
                    {
                      ...newExperience,
                      description:
                        event.target
                          .value,
                    }
                  )
                }
              />

              {/* ADD */}

              <div className="mt-4 flex justify-end">

                <Button
                  onClick={() => {

                    if (
                      !newExperience.company ||
                      !newExperience.role ||
                      !newExperience.startDate
                    ) {
                      toast.error(
                        "Company, role and start date are required."
                      );

                      return;
                    }

                    setExperiences(
                      (
                        previous
                      ) => [
                        ...previous,
                        {
                          ...newExperience,
                        },
                      ]
                    );

                    setNewExperience(
                      {
                        company:
                          "",
                        role:
                          "",
                        location:
                          "",
                        startDate:
                          "",
                        endDate:
                          "",
                        current:
                          false,
                        description:
                          "",
                      }
                    );

                    setShowExperienceForm(
                      false
                    );

                    toast.success(
                      "Experience added."
                    );
                  }}
                >

                  <Plus className="mr-2 size-4" />

                  Add Experience

                </Button>

              </div>

            </div>
          )}

        </div>

      </SectionCard>

      {/* ======================================================
          EDUCATION
          ====================================================== */}

      <SectionCard
        title="Education"
        description="Add your academic qualifications and educational background."
      >

        <div className="space-y-5">

          {/* EMPTY STATE */}

          {education.length ===
            0 && (
            <div className="rounded-xl border border-dashed p-8 text-center">

              <GraduationCap className="mx-auto size-8 text-muted-foreground" />

              <h3 className="mt-3 text-sm font-semibold">
                No education added
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Add your degree or academic qualifications.
              </p>

            </div>
          )}

          {/* EDUCATION LIST */}

          {education.map(
            (
              item,
              index
            ) => (
              <div
                key={
                  item.id ??
                  index
                }
                className="rounded-xl border p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex gap-3">

                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">

                      <GraduationCap className="size-5" />

                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {
                          item.degree
                        }
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {
                          item.institution
                        }
                      </p>

                      {item.field && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {
                            item.field
                          }
                        </p>
                      )}

                      {(item.startDate ||
                        item.endDate) && (
                        <p className="mt-2 text-xs text-muted-foreground">

                          {
                            item.startDate
                          }

                          {" — "}

                          {
                            item.endDate ||
                            "Present"
                          }

                        </p>
                      )}

                      {item.grade && (
                        <p className="mt-2 text-xs font-medium">
                          Grade:{" "}
                          {
                            item.grade
                          }
                        </p>
                      )}

                    </div>

                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {

                      setEducation(
                        (
                          previous
                        ) =>
                          previous.filter(
                            (
                              _,
                              i
                            ) =>
                              i !==
                              index
                          )
                      );

                    }}
                  >

                    <Trash2 className="size-4" />

                  </Button>

                </div>

              </div>
            )
          )}

          {/* ADD EDUCATION */}

          {!showEducationForm ? (

            <Button
              variant="outline"
              onClick={() =>
                setShowEducationForm(
                  true
                )
              }
            >

              <Plus className="mr-2 size-4" />

              Add Education

            </Button>

          ) : (

            /* EDUCATION FORM */

            <div className="rounded-xl border bg-muted/20 p-5">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    Add Education
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    Add your degree and academic details.
                  </p>

                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setShowEducationForm(
                      false
                    )
                  }
                >

                  <X className="size-4" />

                </Button>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                {/* INSTITUTION */}

                <Input
                  placeholder="Institution / University"
                  value={
                    newEducation.institution
                  }
                  onChange={(event) =>
                    setNewEducation(
                      {
                        ...newEducation,
                        institution:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* DEGREE */}

                <Input
                  placeholder="Degree"
                  value={
                    newEducation.degree
                  }
                  onChange={(event) =>
                    setNewEducation(
                      {
                        ...newEducation,
                        degree:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* FIELD */}

                <Input
                  placeholder="Field of study"
                  value={
                    newEducation.field
                  }
                  onChange={(event) =>
                    setNewEducation(
                      {
                        ...newEducation,
                        field:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* GRADE */}

                <Input
                  placeholder="CGPA / Percentage"
                  value={
                    newEducation.grade
                  }
                  onChange={(event) =>
                    setNewEducation(
                      {
                        ...newEducation,
                        grade:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* START */}

                <Input
                  type="date"
                  value={
                    newEducation.startDate
                  }
                  onChange={(event) =>
                    setNewEducation(
                      {
                        ...newEducation,
                        startDate:
                          event.target
                            .value,
                      }
                    )
                  }
                />

                {/* END */}

                <Input
                  type="date"
                  value={
                    newEducation.endDate
                  }
                  onChange={(event) =>
                    setNewEducation(
                      {
                        ...newEducation,
                        endDate:
                          event.target
                            .value,
                      }
                    )
                  }
                />

              </div>

              {/* ADD BUTTON */}

              <div className="mt-4 flex justify-end">

                <Button
                  onClick={() => {

                    if (
                      !newEducation.institution ||
                      !newEducation.degree
                    ) {

                      toast.error(
                        "Institution and degree are required."
                      );

                      return;
                    }

                    setEducation(
                      (
                        previous
                      ) => [
                        ...previous,
                        {
                          ...newEducation,
                        },
                      ]
                    );

                    setNewEducation(
                      {
                        institution:
                          "",
                        degree:
                          "",
                        field:
                          "",
                        startDate:
                          "",
                        endDate:
                          "",
                        grade:
                          "",
                      }
                    );

                    setShowEducationForm(
                      false
                    );

                    toast.success(
                      "Education added."
                    );

                  }}
                >

                  <Plus className="mr-2 size-4" />

                  Add Education

                </Button>

              </div>

            </div>
          )}

        </div>

      </SectionCard>

      {/* ======================================================
          PROFESSIONAL LINKS

      {/* ======================================================
          PROFILE COMPLETENESS
          ====================================================== */}

      <SectionCard
        title="Profile Completeness"
        description="Complete your profile to get better career recommendations."
      >

        {(() => {

          const fields = [
            profile.name,
            profile.email,
            skillsText,
            experiences.length >
              0
              ? "experience"
              : "",
            education.length >
              0
              ? "education"
              : "",
          ];

          const completed =
            fields.filter(
              Boolean
            ).length;

          const percentage =
            Math.round(
              (completed /
                fields.length) *
                100
            );

          return (
            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-sm font-medium">
                  Profile completion
                </span>

                <span className="text-sm font-bold">
                  {percentage}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">

                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

              <div className="grid gap-2 sm:grid-cols-2">

                <CompletionItem
                  label="Personal information"
                  completed={
                    Boolean(
                      profile.name &&
                      profile.email
                    )
                  }
                />

               

                <CompletionItem
                  label="Skills"
                  completed={
                    skillsText.trim()
                      .length > 0
                  }
                />

                <CompletionItem
                  label="Experience"
                  completed={
                    experiences.length >
                    0
                  }
                />

                <CompletionItem
                  label="Education"
                  completed={
                    education.length >
                    0
                  }
                />

              </div>

            </div>
          );

        })()}

      </SectionCard>

      {/* ======================================================
          SAVE PROFILE
          ====================================================== */}

      <div className="flex justify-end">

        <Button
          size="lg"
          onClick={
            saveProfile
          }
          disabled={
            saving
          }
        >

          {saving ? (
            <>
              <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />

              Save Profile
            </>
          )}

        </Button>

      </div>

      {/* ======================================================
          LOGOUT
          ====================================================== */}

      <SectionCard
        title="Account Actions"
        description="Manage your current session."
      >

        <div className="rounded-xl border border-destructive/20 bg-destructive/[0.04] p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <LogOut className="size-4 text-destructive" />

                <h3 className="text-sm font-semibold text-destructive">
                  Sign out
                </h3>

              </div>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Sign out of your CareerPilot account on this device.
              </p>

            </div>

            <Button
              variant="destructive"
              onClick={
                handleLogout
              }
              className="shrink-0"
            >

              <LogOut className="mr-2 size-4" />

              Logout

            </Button>

          </div>

        </div>

      </SectionCard>

    </div>
  );
}

/* ============================================================
   COMPLETION ITEM
   ============================================================ */

function CompletionItem({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">

      <span className="text-xs text-muted-foreground">
        {label}
      </span>

      <span
        className={
          completed
            ? "text-xs font-medium text-green-600"
            : "text-xs font-medium text-muted-foreground"
        }
      >
        {completed
          ? "Complete"
          : "Incomplete"}
      </span>

    </div>
  );
}