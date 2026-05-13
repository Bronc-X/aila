import type { ModelRequest } from "../types";
import type { LocalHistoryEntry } from "./localHistory";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_LUSIE_SUPABASE_URL ?? "").replace(/\/+$/, "");
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export type SupabaseSyncState = "disabled" | "ready";

export function getSupabaseSyncState(): SupabaseSyncState {
  return supabaseUrl && supabasePublishableKey ? "ready" : "disabled";
}

export async function syncHistoryEntry(entry: LocalHistoryEntry) {
  if (getSupabaseSyncState() !== "ready") return { ok: false, reason: "disabled" };

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/toybox_history`, {
      method: "POST",
      headers: {
        "apikey": supabasePublishableKey,
        "Authorization": `Bearer ${supabasePublishableKey}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({
        id: entry.id,
        run_id: entry.runId,
        title: entry.title,
        label: entry.label,
        status: entry.status,
        input: buildSyncedInput(entry),
        concepts: entry.concepts,
        selected_concept_id: entry.selectedConceptId,
        preview_image_url: entry.previewImageUrl,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt
      })
    });

    if (!response.ok) {
      return { ok: false, reason: await response.text() };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "supabase_sync_failed" };
  }
}

function buildSyncedInput(entry: LocalHistoryEntry): ModelRequest & { _files?: LocalHistoryEntry["files"] } {
  if (!entry.files || Object.keys(entry.files).length === 0) return entry.input;
  return { ...entry.input, _files: entry.files };
}
