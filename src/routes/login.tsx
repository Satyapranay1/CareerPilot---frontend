import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { getToken } from "@/lib/auth";

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
    if (getToken()) {
      navigate({
        to: "/dashboard",
        replace: true,
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignup && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = isSignup
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
          }
        : {
            email: form.email,
            password: form.password,
          };

      const response = await apiFetch(isSignup ? "/auth/register" : "/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      let data: AuthResponse;

      try {
        data = await response.json();
      } catch {
        data = {
          message: "Something went wrong.",
        };
      }

      if (!response.ok) {
        alert(data.message);
        return;
      }

      if (isSignup) {
        alert(data.message);

        setIsSignup(false);

        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        return;
      }

      if (!data.token) {
        alert("Invalid login response.");
        return;
      }

      saveAuth(data.token, {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      alert(data.message);

      navigate({
        to: "/dashboard",
        replace: true,
      });
    } catch {
      alert("Something went wrong.");
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
              Resume analysis, coding practice and interview preparation in one premium platform.
            </p>
          </div>

          <div className="text-xs text-white/60">
            {/* © {new Date().getFullYear()} InterviewOS AI */}
          </div>
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

          <h1 className="text-2xl font-semibold">{isSignup ? "Create Account" : "Welcome Back"}</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {isSignup
              ? "Create your InterviewOS AI account."
              : "Sign in to continue your preparation."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <div className="space-y-1.5 mt-3">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
            )}

            <div className="space-y-1.5  mt-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
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
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-brand text-white shadow-glow"
            >
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
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
                  onClick={() => setIsSignup(true)}
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
