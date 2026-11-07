/** The only Supabase project this app may use. */
export const APPROVED_SUPABASE_PROJECT_REF = "worlgpganiczzjwmapjk";

export type SupabasePublicStatus = {
  configured: boolean;
  projectRef: typeof APPROVED_SUPABASE_PROJECT_REF;
  remote: "not-configured" | "refused-wrong-project" | "key-present-but-unread";
  reasons: string[];
};

/**
 * Public configuration only. Never reads a service-role key.
 * Pages keep using checked-in content either way, so a missing key cannot blank the edition.
 */
export function getSupabasePublicStatus(
  env: Record<string, string | undefined> = process.env,
): SupabasePublicStatus {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const publishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";
  const reasons: string[] = [];
  if (!url) reasons.push("NEXT_PUBLIC_SUPABASE_URL is not set.");
  if (!publishableKey) reasons.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set.");
  if (url && !url.includes(APPROVED_SUPABASE_PROJECT_REF)) {
    reasons.push("The Supabase URL is not the approved Macro Atlas project.");
    return {
      configured: false,
      projectRef: APPROVED_SUPABASE_PROJECT_REF,
      remote: "refused-wrong-project",
      reasons,
    };
  }
  if (reasons.length > 0) {
    return {
      configured: false,
      projectRef: APPROVED_SUPABASE_PROJECT_REF,
      remote: "not-configured",
      reasons,
    };
  }
  return {
    configured: true,
    projectRef: APPROVED_SUPABASE_PROJECT_REF,
    remote: "key-present-but-unread",
    reasons: [
      "A publishable key is present for the approved project. This edition still renders its checked-in pages and does not query the database.",
    ],
  };
}
