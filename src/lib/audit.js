import { base44 } from "@/api/base44Client";

// Best-effort change trail for the admin dashboard. Never blocks the action itself.
export async function logAudit({ action, entity, label, note, actor }) {
  try {
    let email = actor;
    if (!email) {
      try {
        const me = await base44.auth.me();
        email = me?.email || "unknown";
      } catch {
        email = "unknown";
      }
    }
    await base44.entities.AuditLog.create({
      action,
      entity_name: entity || "",
      record_label: String(label || "").slice(0, 180),
      actor_email: email,
      note: note || "",
    });
  } catch {
    // The audit trail is informational; a failed write must not break the edit.
  }
}