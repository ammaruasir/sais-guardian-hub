import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/submissions/new")({
  component: () => <Navigate to="/portal/requests/new" />,
});
