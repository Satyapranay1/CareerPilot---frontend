import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isTokenValid, logout } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: HomeRedirect,
});

function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const valid = isTokenValid();

    console.log("ROOT ROUTE AUTH CHECK:", valid);

    if (valid) {
      navigate({
        to: "/dashboard",
        replace: true,
      });
    } else {
      logout();

      navigate({
        to: "/login",
        replace: true,
      });
    }
  }, [navigate]);

  return null;
}