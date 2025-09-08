import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Job } from "@/types/job";

const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

const querySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Math.max(1, Math.min(10, parseInt(v, 10))))
    .optional(),
  pages: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Math.max(1, Math.min(3, parseInt(v, 10))))
    .optional(),
  country: z.string().trim().length(2).optional(),
  date_posted: z.enum(["all", "month", "week", "today"]).optional(),
});

const externalItemSchema = z.object({
  job_id: z.unknown(),
  job_title: z.unknown(),
  employer_name: z.unknown(),
  job_city: z.unknown().optional(),
  job_country: z.unknown().optional(),
  job_employment_type: z.unknown().optional(),
  job_description: z.unknown().optional(),
  job_posted_at: z.unknown().optional(),
  job_posted_at_timestamp: z.unknown().optional(),
  job_apply_link: z.unknown().optional(),
  job_apply_links: z.array(z.unknown()).optional(),
});

function takeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");

  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";

  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });

    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;

  return true;
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);

  if (!checkRateLimit(ip)) {
    return NextResponse.json([], {
      status: 429,
      headers: {
        "cache-control": "no-store",
      },
    });
  }

  const url = new URL(req.url);
  const parseResult = querySchema.safeParse(
    Object.fromEntries(url.searchParams),
  );

  if (!parseResult.success) {
    return NextResponse.json([], { status: 400 });
  }
  const {
    q,
    page = 1,
    pages = 1,
    country = "ph",
    date_posted = "all",
  } = parseResult.data;

  const apiKey = process.env.JSEARCH_KEY;

  if (!apiKey) {
    return NextResponse.json([], {
      status: 503,
      headers: { "cache-control": "no-store" },
    });
  }

  const searchQuery = encodeURIComponent(q || "developer jobs");
  const externalUrl = `https://jsearch.p.rapidapi.com/search?query=${searchQuery}&page=${page}&num_pages=${pages}&country=${encodeURIComponent(
    country,
  )}&date_posted=${encodeURIComponent(date_posted)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(externalUrl, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
          Vary: "x-forwarded-for",
        },
      });
    }

    const json = await response.json();
    const rawItems: unknown[] = Array.isArray(json?.data) ? json.data : [];

    const jobs: Job[] = rawItems.map((raw) => {
      const safe = externalItemSchema.parse(raw);
      const id = takeString(safe.job_id);
      const title = takeString(safe.job_title);
      const company = takeString(safe.employer_name);
      const location =
        takeString(safe.job_city) || takeString(safe.job_country);
      const type = takeString(safe.job_employment_type);
      const description = takeString(safe.job_description);
      const postedAt = takeString(safe.job_posted_at);
      const postedAtTs = takeString(safe.job_posted_at_timestamp);

      let listedDate = "";

      if (postedAtTs) {
        const num = Number(postedAtTs);

        if (!Number.isNaN(num)) {
          const ms = num < 10_000_000_000 ? num * 1000 : num;
          const d = new Date(ms);

          if (!Number.isNaN(d.getTime())) listedDate = d.toISOString();
        }
      }
      if (!listedDate && postedAt) {
        const d = new Date(postedAt);

        if (!Number.isNaN(d.getTime())) listedDate = d.toISOString();
      }
      const applyUrl =
        takeString(safe.job_apply_link) ||
        takeString(safe.job_apply_links?.[0]);

      return {
        id,
        title,
        company,
        location,
        type,
        description,
        listedDate,
        applyUrl,
      } satisfies Job;
    });

    return NextResponse.json(jobs, {
      status: 200,
      headers: {
        "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
        Vary: "x-forwarded-for",
      },
    });
  } catch (error: any) {
    const isAbort = error?.name === "AbortError";

    return NextResponse.json([], {
      status: isAbort ? 504 : 200,
      headers: {
        "cache-control": "public, s-maxage=15, stale-while-revalidate=60",
        Vary: "x-forwarded-for",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}
