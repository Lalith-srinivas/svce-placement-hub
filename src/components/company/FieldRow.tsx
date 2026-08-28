import { ExternalLink, Star, PlayCircle } from "lucide-react";
import { asString, isNullish, splitItems } from "@/lib/companyData";
import type { FieldDef } from "@/data/intelligenceData";

function AutoPills({ value }: { value: string }) {
  const hasDelimiters = /[;,]/.test(value);
  if (!hasDelimiters) return <p className="text-sm font-semibold leading-relaxed text-black">{value}</p>;
  const items = value
    .split(/[;,]/)
    .map((v) => v.trim())
    .filter(Boolean);
  if (items.length <= 1) return <p className="text-sm font-semibold leading-relaxed text-black">{value}</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center rounded-md border border-black bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-black"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function renderFieldValue(field: FieldDef, rawValue: unknown) {
  const value = asString(rawValue);
  if (isNullish(value)) return null;

  switch (field.type) {
    case "url":
      return (
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:underline"
        >
          {value.replace(/^https?:\/\//, "")}
          <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
        </a>
      );
    case "video":
      return (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:underline"
        >
          <PlayCircle className="h-4 w-4" />
          Watch video
        </a>
      );
    case "rating": {
      const num = parseFloat(value);
      return (
        <span className="inline-flex items-center gap-1 text-sm font-black text-black">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
          {Number.isFinite(num) ? num.toFixed(1) : value}
        </span>
      );
    }
    case "list": {
      const items = splitItems(value);
      if (items.length <= 1) return <p className="text-sm font-semibold leading-relaxed text-black">{value}</p>;
      return (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-medium leading-relaxed text-black">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-black" />
              {item}
            </li>
          ))}
        </ul>
      );
    }
    case "paragraph":
      return <p className="text-sm font-semibold leading-relaxed text-slate-800">{value}</p>;
    default:
      return <AutoPills value={value} />;
  }
}

export function FieldRow({ field, value }: { field: FieldDef; value: unknown }) {
  if (isNullish(value)) return null;

  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
      <div className="text-xs font-black uppercase font-mono tracking-label text-slate-600 sm:w-1/3">
        {field.label}
      </div>
      <div className="sm:w-2/3">{renderFieldValue(field, value)}</div>
    </div>
  );
}
