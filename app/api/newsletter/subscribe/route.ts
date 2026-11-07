import "server-only";
import { unconfiguredNewsletterResponse } from "@/lib/newsletter/status";

export function POST() {
  const response = unconfiguredNewsletterResponse();
  return Response.json(response.body, { status: response.status });
}

export function GET() {
  const response = unconfiguredNewsletterResponse();
  return Response.json(response.body, { status: response.status });
}
