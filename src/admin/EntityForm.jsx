import { useState } from "react";
import FormField from "@/admin/FormField";
import { BTN } from "@/lib/styles";

const buildInitial = (fields, record) => {
  const values = {};
  fields.forEach((f) => {
    const raw = record ? record[f.key] : undefined;
    if (raw !== undefined && raw !== null) values[f.key] = raw;
    else values[f.key] = f.type === "bool" ? true : "";
  });
  return values;
};

const normalize = (fields, values) => {
  const out = {};
  fields.forEach((f) => {
    const v = values[f.key];
    if (f.type === "number") out[f.key] = v === "" || v === null || v === undefined ? 0 : Number(v);
    else if (f.type === "bool") out[f.key] = !!v;
    else out[f.key] = v ?? "";
  });
  return out;
};

export default function EntityForm({ fields, record, lookups, onSubmit, onCancel, saving, error }) {
  const [values, setValues] = useState(() => buildInitial(fields, record));

  const change = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit(normalize(fields, values));
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <FormField
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={change}
          lookups={lookups}
        />
      ))}

      {error ? <p className="text-xs font-medium text-accent sm:col-span-2">{error}</p> : null}

      <div className="flex items-center gap-3 border-t border-border pt-4 sm:col-span-2">
        <button type="submit" disabled={saving} className={BTN.primary}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}