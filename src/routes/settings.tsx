import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SectionCard } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Camera,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Moon,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  BriefcaseBusiness,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings · CareerPilot" }],
  }),
  component: () => (
    <AppShell>
      <SettingsPage />
    </AppShell>
  ),
});

type UserProfile = {
  name?: string | null;
  email?: string | null;
  targetRole?: string | null;
  profileImageUrl?: string | null;
};

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    targetRole: "",
    profileImageUrl: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
  localStorage.getItem("profileImage")
);

const handleProfileImageChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file.");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.error("Profile image must be smaller than 2MB.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result as string;

    setProfileImage(imageUrl);
    localStorage.setItem("profileImage", imageUrl);

    toast.success("Profile picture updated.");
  };

  reader.readAsDataURL(file);
};

const profileImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const response = await apiFetch("/profile");

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await response.json();

      setProfile({
        name: data.name ?? "",
        email: data.email ?? "",
        targetRole: data.targetRole ?? "",
        profileImageUrl:
          data.profileImageUrl ??
          data.profilePicture ??
          data.avatarUrl ??
          null,
      });
    } catch (error) {
      console.error("Profile loading error:", error);
      toast.error("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    field: keyof UserProfile,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveProfile() {
    try {
      setSaving(true);

      const response = await apiFetch("/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          targetRole: profile.targetRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();

      setProfile((current) => ({
        ...current,
        name: data.name ?? current.name,
        email: data.email ?? current.email,
        targetRole: data.targetRole ?? current.targetRole,
        profileImageUrl:
          data.profileImageUrl ??
          data.profilePicture ??
          data.avatarUrl ??
          current.profileImageUrl,
      }));

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile save error:", error);
      toast.error("Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full bg-primary/10">
            <Sparkles className="size-5 animate-pulse text-primary" />
          </div>

          <p className="text-sm text-muted-foreground">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

  const initials = profile.name?.trim()
    ? profile.name.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-7 pb-10">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your profile, appearance, and account security."
      />

      {/* ================================================= */}
      {/* PROFILE HERO */}
      {/* ================================================= */}

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Decorative background */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent" />

        <div className="relative p-5 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative shrink-0">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={profile.name || "Profile"}
                  className="size-24 rounded-2xl border-4 border-background object-cover shadow-lg"
                />
              ) : (
                <div className="grid size-24 place-items-center rounded-2xl border-4 border-background bg-gradient-to-br from-primary/20 to-primary/5 text-3xl font-bold text-primary shadow-lg">
                  {initials}
                </div>
              )}

              <>
  <input
    ref={profileImageInputRef}
    type="file"
    accept="image/png,image/jpeg,image/webp"
    hidden
    onChange={handleProfileImageChange}
  />

  <button
    type="button"
    onClick={() => profileImageInputRef.current?.click()}
    className="absolute -bottom-2 -right-2 grid size-8 place-items-center rounded-full border-2 border-background bg-card shadow-sm transition-all hover:scale-110 hover:bg-muted"
    title="Change profile picture"
  >
    <Camera className="size-3.5 text-muted-foreground" />
  </button>
</>
            </div>

            {/* Profile info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {profile.name || "Your Profile"}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3" />
                  Active
                </span>
              </div>

              <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                {profile.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    {profile.email}
                  </span>
                )}

                {profile.targetRole && (
                  <span className="inline-flex items-center gap-1.5">
                    <BriefcaseBusiness className="size-3.5" />
                    {profile.targetRole}
                  </span>
                )}
              </div>

              <p className="mt-3 max-w-xl text-xs leading-5 text-muted-foreground">
                Keep your profile information updated so CareerPilot can
                personalize your resume analysis and career preparation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ACCOUNT INFORMATION */}
      {/* ================================================= */}

      <SectionCard
        title="Profile information"
        description="Update the information used to personalize your CareerPilot experience."
      >
        <div className="space-y-6">
          {/* Name + Email */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="flex items-center gap-1.5"
              >
                <User className="size-3.5 text-muted-foreground" />
                Display name
              </Label>

              <Input
                id="name"
                value={profile.name ?? ""}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
                placeholder="Enter your name"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-1.5"
              >
                <Mail className="size-3.5 text-muted-foreground" />
                Email address
              </Label>

              <Input
                id="email"
                type="email"
                value={profile.email ?? ""}
                disabled
                className="h-11 bg-muted/40"
              />

              <p className="text-[11px] text-muted-foreground">
                Email is managed by your account and cannot be changed here.
              </p>
            </div>
          </div>

          {/* Target Role */}
          <div className="space-y-2">
            <Label
              htmlFor="targetRole"
              className="flex items-center gap-1.5"
            >
              <BriefcaseBusiness className="size-3.5 text-muted-foreground" />
              Target role
            </Label>

            <Input
              id="targetRole"
              value={profile.targetRole ?? ""}
              onChange={(e) =>
                updateField("targetRole", e.target.value)
              }
              placeholder="e.g. Java Backend Developer"
              className="h-11"
            />

            <p className="text-[11px] text-muted-foreground">
              Your target role helps CareerPilot tailor resume and interview
              recommendations.
            </p>
          </div>

          {/* Save */}
          <div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Changes are saved to your CareerPilot profile.
            </p>

            <Button
              onClick={saveProfile}
              disabled={saving}
              className="gradient-brand text-white shadow-sm"
            >
              {saving ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* ================================================= */}
      {/* APPEARANCE */}
      {/* ================================================= */}

      <SectionCard
        title="Appearance"
        description="Choose the interface style that works best for you."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Dark */}
          <ThemeOption
            selected={theme === "dark"}
            icon={Moon}
            title="Dark mode"
            description="A darker interface that's comfortable in low-light environments."
            onClick={() => setTheme("dark")}
          />

          {/* Light */}
          <ThemeOption
            selected={theme === "light"}
            icon={Sun}
            title="Light mode"
            description="A clean, bright interface for well-lit environments."
            onClick={() => setTheme("light")}
          />
        </div>
      </SectionCard>

      {/* ================================================= */}
      {/* SECURITY */}
      {/* ================================================= */}

      <SectionCard
        title="Security"
        description="Protect your CareerPilot account with a strong password."
      >
        <PasswordSection />
      </SectionCard>
    </div>
  );
}

/* ===================================================== */
/* THEME OPTION */
/* ===================================================== */

function ThemeOption({
  selected,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: typeof Moon;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/[0.06] shadow-md shadow-primary/10"
          : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
      }`}
    >
      {selected && (
        <div className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3.5" />
        </div>
      )}

      <div
        className={`grid size-11 place-items-center rounded-xl transition-colors ${
          selected
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        }`}
      >
        <Icon className="size-5" />
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold">{title}</p>

        <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  );
}

/* ===================================================== */
/* PASSWORD SECTION */
/* ===================================================== */

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);

  async function updatePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await apiFetch("/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Password update failed");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password updated successfully.");
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Unable to update password.");
    } finally {
      setSaving(false);
    }
  }

  const passwordLengthValid = newPassword.length >= 8;
  const passwordsMatch =
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  return (
    <div className="space-y-6">
      {/* Security banner */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="size-4" />
        </div>

        <div>
          <p className="text-sm font-medium">
            Keep your account secure
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Use a unique password that you don't use on other websites.
          </p>
        </div>
      </div>

      {/* Password fields */}
      <div className="grid gap-5 md:grid-cols-3">
        <PasswordField
          id="current-password"
          label="Current password"
          value={currentPassword}
          visible={showCurrent}
          onChange={setCurrentPassword}
          onToggle={() => setShowCurrent((value) => !value)}
        />

        <PasswordField
          id="new-password"
          label="New password"
          value={newPassword}
          visible={showNew}
          onChange={setNewPassword}
          onToggle={() => setShowNew((value) => !value)}
        />

        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirmPassword}
          visible={showConfirm}
          onChange={setConfirmPassword}
          onToggle={() => setShowConfirm((value) => !value)}
        />
      </div>

      {/* Password checks */}
      {newPassword && (
        <div className="grid gap-2 sm:grid-cols-2">
          <PasswordCheck
            valid={passwordLengthValid}
            text="At least 8 characters"
          />

          <PasswordCheck
            valid={passwordsMatch}
            text="Passwords match"
          />
        </div>
      )}

      {/* Update button */}
      <div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          Your password is securely handled by the backend.
        </div>

        <Button
          onClick={updatePassword}
          disabled={saving}
          className="gradient-brand text-white"
        >
          {saving ? (
            <>
              <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Updating...
            </>
          ) : (
            <>
              <Lock className="mr-2 size-4" />
              Update password
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/* ===================================================== */
/* PASSWORD FIELD */
/* ===================================================== */

function PasswordField({
  id,
  label,
  value,
  visible,
  onChange,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 pr-11"
          placeholder="••••••••"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

/* ===================================================== */
/* PASSWORD CHECK */
/* ===================================================== */

function PasswordCheck({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
        valid
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <span
        className={`grid size-4 place-items-center rounded-full ${
          valid
            ? "bg-emerald-500 text-white"
            : "bg-muted-foreground/20"
        }`}
      >
        {valid && <Check className="size-2.5" />}
      </span>

      {text}
    </div>
  );
}