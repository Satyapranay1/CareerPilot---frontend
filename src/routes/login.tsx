import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { saveAuth, isTokenValid } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Authentication · InterviewOS AI" }],
  }),
  component: AuthPage,
});

type AuthResponse = {
  message: string;
  token?: string;
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

function AuthPage() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isTokenValid()) {
      navigate({
        to: "/dashboard",
        replace: true,
      });
    }
  }, [navigate]);

  const passwordsMatch =
    !isSignup ||
    !form.confirmPassword ||
    form.password === form.confirmPassword;

  const switchMode = (signup: boolean) => {
    setIsSignup(signup);
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (isSignup && !form.name.trim()) {
    toast.error("Please enter your full name.");
    return;
  }

  if (!form.email.trim()) {
    toast.error("Please enter your email.");
    return;
  }

  if (!form.password) {
    toast.error("Please enter your password.");
    return;
  }

  if (isSignup && form.password.length < 6) {
    toast.error("Password must be at least 6 characters.");
    return;
  }

  if (isSignup && form.password !== form.confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const response = await apiFetch(
      isSignup ? "/auth/register" : "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(
          isSignup
            ? {
                name: form.name,
                email: form.email,
                password: form.password,
              }
            : {
                email: form.email,
                password: form.password,
              }
        ),
      }
    );

    const text = await response.text();

    let data: AuthResponse = { message: "" };

    try {
      data = text ? JSON.parse(text) : { message: "" };
    } catch {
      toast.error("Invalid server response.");
      return;
    }

    console.log("AUTH RESPONSE:", response.status, data);

    if (!response.ok) {
      toast.error(data.message || `Request failed (${response.status})`);
      return;
    }

    if (isSignup) {
      toast.success(data.message || "Account created successfully.");
      switchMode(false);
      return;
    }

    if (
      !data.token ||
      data.id === undefined ||
      data.name === undefined ||
      data.email === undefined ||
      data.role === undefined
    ) {
      toast.error("Invalid login response from server.");
      return;
    }

    saveAuth(data.token, {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    });

    toast.success(data.message || "Login successful.");

    navigate({
      to: "/dashboard",
      replace: true,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    toast.error(
      isSignup
        ? "Unable to create account. Please try again."
        : "Unable to sign in. Please check your connection and try again."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative grid min-h-screen w-full lg:grid-cols-2">
      {/* Left Side */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -left-16 top-1/3 size-96 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-10 right-10 size-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="size-5" />
            InterviewOS AI
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-3xl font-semibold leading-tight">
              The AI-powered career OS for software engineers.
            </p>

            <p className="text-white/80">
              Resume analysis, coding practice and interview preparation in
              one premium platform.
            </p>
          </div>

          <div className="text-xs text-white/60" />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="grid size-8 place-items-center rounded-lg gradient-brand text-white">
              <Sparkles className="size-4" />
            </div>
            <span className="font-semibold">InterviewOS AI</span>
          </div>

          <h1 className="text-2xl font-semibold">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isSignup
              ? "Create your InterviewOS AI account."
              : "Sign in to continue your preparation."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <div className="mt-3 space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="mt-3 space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="pr-10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {form.confirmPassword && (
                  <p
                    className={`text-xs ${
                      passwordsMatch
                        ? "text-green-600"
                        : "text-destructive"
                    }`}
                  >
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={
                loading ||
                (isSignup &&
                  (!form.password ||
                    !form.confirmPassword ||
                    form.password !== form.confirmPassword))
              }
              className="w-full gradient-brand text-white shadow-glow"
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className="font-medium text-primary hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className="font-medium text-primary hover:underline"
                >
                  Create Account
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
