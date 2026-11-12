import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { INPUT, LABEL } from "@/lib/styles";
import { OPTION_LABEL } from "@/admin/collections";

const toLocalInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 16);
};

function FileField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(file_url);
    } catch {
      setError("Upload failed. Try a smaller file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.csv,.xlsx"
        onChange={pick}
        className="block w-full text-xs text-muted-foreground file:mr-3 file:cursor-pointer file:border file:border-border file:bg-card file:px-3 file:py-1.5 file:text-[10px] file:uppercase file:tracking-[0.14em] file:text-foreground/70"
      />
      {busy ? <p className="mt-1.5 text-[11px] text-muted-foreground">Uploading…</p> : null}
      {value ? (
        <div className="mt-2 flex items-center gap-3">
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="truncate text-[11px] text-accent hover:underline"
          >
            {String(value).split("/").pop()}
          </a>
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-accent"
          >
            Remove
          </button>
        </div>
      ) : null}
      {error ? <p className="mt-1.5 text-[11px] text-accent">{error}</p> : null}
    </div>
  );
}

function ImageField({ value, onChange, accept = "image/*" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(file_url);
    } catch {
      setError("Upload failed. Try a smaller file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-border bg-secondary">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="eyebrow text-muted-foreground/50">None</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            type="file"
            accept={accept}
            onChange={pick}
            className="block w-full text-xs text-muted-foreground file:mr-3 file:cursor-pointer file:border file:border-border file:bg-card file:px-3 file:py-1.5 file:text-[10px] file:uppercase file:tracking-[0.14em] file:text-foreground/70"
          />
          {busy ? <p className="mt-1.5 text-[11px] text-muted-foreground">Uploading…</p> : null}
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-accent"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="mt-1.5 text-[11px] text-accent">{error}</p> : null}
    </div>
  );
}

export default function FormField({ field, value, onChange, lookups = {} }) {
  const set = (v) => onChange(field.key, v);

  let control;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          id={field.key}
          rows={4}
          className={INPUT}
          value={value ?? ""}
          placeholder={field.hint}
          onChange={(e) => set(e.target.value)}
        />
      );
      break;
    case "number":
      control = (
        <input
          id={field.key}
          type="number"
          className={INPUT}
          value={value ?? ""}
          onChange={(e) => set(e.target.value)}
        />
      );
      break;
    case "date":
      control = (
        <input
          id={field.key}
          type="date"
          className={INPUT}
          value={String(value ?? "").slice(0, 10)}
          onChange={(e) => set(e.target.value)}
        />
      );
      break;
    case "datetime":
      control = (
        <input
          id={field.key}
          type="datetime-local"
          className={INPUT}
          value={toLocalInput(value)}
          onChange={(e) => set(e.target.value)}
        />
      );
      break;
    case "select":
      control = (
        <select id={field.key} className={INPUT} value={value ?? ""} onChange={(e) => set(e.target.value)}>
          {(field.options || []).map((o) => (
            <option key={o} value={o}>
              {OPTION_LABEL(o)}
            </option>
          ))}
        </select>
      );
      break;
    case "ref":
      control = (
        <select id={field.key} className={INPUT} value={value ?? ""} onChange={(e) => set(e.target.value)}>
          <option value="">{field.emptyLabel || "None"}</option>
          {(lookups[field.ref] || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "bool":
      control = (
        <label className="flex cursor-pointer items-center gap-2.5 py-2 text-sm text-foreground/80">
          <input
            id={field.key}
            type="checkbox"
            checked={!!value}
            onChange={(e) => set(e.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--accent))]"
          />
          {field.hint || "Enabled"}
        </label>
      );
      break;
    case "image":
      control = <ImageField value={value} onChange={set} />;
      break;
    case "file":
      control = <FileField value={value} onChange={set} />;
      break;
    default:
      control = (
        <input
          id={field.key}
          type="text"
          className={INPUT}
          value={value ?? ""}
          onChange={(e) => set(e.target.value)}
        />
      );
  }

  return (
    <div className={field.full ? "sm:col-span-2" : ""}>
      <label className={LABEL} htmlFor={field.key}>
        {field.label}
      </label>
      {control}
      {field.hint && field.type !== "bool" && field.type !== "textarea" ? (
        <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{field.hint}</p>
      ) : null}
    </div>
  );
}