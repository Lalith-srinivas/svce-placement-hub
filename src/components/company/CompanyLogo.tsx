import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

function domainFromUrl(url: string): string | null {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function CompanyLogo({
  name,
  logoUrl,
  websiteUrl,
  className,
  accentHex,
}: {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  className?: string;
  accentHex?: string;
}) {
  const logoDevKey = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY as string | undefined;
  const domain = useMemo(() => (websiteUrl ? domainFromUrl(websiteUrl) : null), [websiteUrl]);

  const candidates = useMemo(() => {
    const list: string[] = [];
    if (logoDevKey && domain) {
      list.push(`https://img.logo.dev/${domain}?token=${logoDevKey}&size=128&format=png`);
    }
    if (logoUrl && !logoUrl.includes("logo.clearbit.com")) {
      list.push(logoUrl);
    }
    if (domain) {
      list.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    }
    return list;
  }, [logoDevKey, domain, logoUrl]);

  const [idx, setIdx] = useState(0);
  const src = candidates[idx];

  if (!src) {
    const initial = name?.trim()?.[0]?.toUpperCase() || "?";
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg font-heading font-black text-black border-2 border-black bg-neo-yellow shadow-neo-sm text-base",
          className
        )}
        style={{ backgroundColor: accentHex || "#FFE600" }}
        aria-label={name}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      loading="lazy"
      className={cn("rounded-lg border-2 border-black bg-white object-contain p-1 shadow-neo-sm", className)}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}
