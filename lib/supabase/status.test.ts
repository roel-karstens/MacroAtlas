import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getSupabasePublicStatus } from "@/lib/supabase/status";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".ts") || full.endsWith(".tsx") ? [full] : [];
  });
}

describe("supabase public status", () => {
  it("stays on snapshots when env is empty and refuses any other project", () => {
    const empty = getSupabasePublicStatus({});
    expect(empty.configured).toBe(false);
    expect(empty.remote).toBe("not-configured");
    expect(empty.projectRef).toBe("worlgpganiczzjwmapjk");

    const wrong = getSupabasePublicStatus({
      NEXT_PUBLIC_SUPABASE_URL: "https://other-project.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable_test",
    });
    expect(wrong.remote).toBe("refused-wrong-project");
    expect(wrong.configured).toBe(false);

    const approved = getSupabasePublicStatus({
      NEXT_PUBLIC_SUPABASE_URL: "https://worlgpganiczzjwmapjk.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable_test",
    });
    expect(approved.remote).toBe("key-present-but-unread");
    expect(JSON.stringify(approved)).not.toContain("publishable_test");
  });

  it("does not put a service-role key in client modules", () => {
    const files = [...walk("app"), ...walk("components")];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const isClient = source.startsWith('"use client"') || source.startsWith("'use client'");
      if (!isClient) continue;
      expect(source, file).not.toMatch(/SERVICE_ROLE|service_role|SUPABASE_SERVICE_ROLE_KEY/);
    }
    const migration = readFileSync("supabase/migrations/20261107120000_init.sql", "utf8");
    expect(migration).toContain("enable row level security");
    expect(migration).toContain("worlgpganiczzjwmapjk");
    expect(migration).toContain("security_invoker");
    expect(migration.toLowerCase()).not.toContain("service_role");
  });
});
