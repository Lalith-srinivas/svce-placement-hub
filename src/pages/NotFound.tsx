import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Compass className="h-6 w-6" />
      </div>
      <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        That URL doesn't match anything in the portal. Head back to the company grid to keep exploring.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-navy px-4 text-sm font-medium text-white hover:bg-navy-light"
      >
        Back to all companies
      </Link>
    </div>
  );
}
