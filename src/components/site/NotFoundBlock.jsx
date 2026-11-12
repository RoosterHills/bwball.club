import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BTN } from "@/lib/styles";

export default function NotFoundBlock({ title, message }) {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "prerender-status-code";
    meta.content = "404";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="shell flex min-h-[55vh] flex-col items-center justify-center text-center">
      <p className="eyebrow text-accent">404</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">{title || "Not found"}</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        {message || "That page has retired to the dugout. Try the homepage."}
      </p>
      <Link to="/" className={`${BTN.primary} mt-6`}>
        Back to homepage
      </Link>
    </div>
  );
}