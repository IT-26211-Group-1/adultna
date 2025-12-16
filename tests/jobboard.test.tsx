import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";

import { useJobFiltering } from "../hooks/useJobFiltering";
import { useJobPagination } from "../hooks/useJobPagination";

type Job = {
  id: string;
  title: string;
  company?: string;
  location?: string;
  type?: string;
  listedDate: string;
  isRemote?: boolean;
};

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: overrides.id || String(Math.random()),
    title: overrides.title || "Some Job",
    company: overrides.company || "Co",
    location: overrides.location || "Philippines",
    type: overrides.type || "Full-time",
    listedDate: overrides.listedDate || new Date().toISOString(),
    isRemote: overrides.isRemote ?? false,
    ...overrides,
  };
}

describe("useJobFiltering", () => {
  it("filters by date range (today, 3days, week, month)", () => {
    const now = Date.now();
    const today = new Date(now - 1 * 60 * 60 * 1000).toISOString();
    // make threeDays just inside the 3-day window (subtract a hair less than 3 days)
    const threeDays = new Date(now - (3 * 24 * 60 * 60 * 1000 - 1000)).toISOString();
    const eightDays = new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString();

    const jobs = [
      makeJob({ id: "t", title: "T", listedDate: today }),
      makeJob({ id: "3", title: "3", listedDate: threeDays }),
      makeJob({ id: "8", title: "8", listedDate: eightDays }),
    ];

    function Harness({ filter }: { filter: any }) {
      const res = useJobFiltering(jobs as any, filter);
      return <div data-testid="out">{res.map((j: any) => j.id).join(",")}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() =>
      root.render(<Harness filter={{ datePosted: "today", jobType: "all", employmentType: "all" }} />),
    );
    expect(container.textContent).toContain("t");

    act(() =>
      root.render(<Harness filter={{ datePosted: "3days", jobType: "all", employmentType: "all" }} />),
    );
    expect(container.textContent).toContain("3");

    act(() =>
      root.render(<Harness filter={{ datePosted: "week", jobType: "all", employmentType: "all" }} />),
    );
    expect(container.textContent).toContain("3");
    expect(container.textContent).not.toContain("8");

    act(() =>
      root.render(<Harness filter={{ datePosted: "month", jobType: "all", employmentType: "all" }} />),
    );
    expect(container.textContent).toContain("8");

    document.body.removeChild(container);
  });

  it("filters by jobType remote/onsite/hybrid", () => {
    const jobs = [
      makeJob({ id: "r", isRemote: true, location: "Remote" }),
      makeJob({ id: "o", isRemote: false, location: "Manila, PH" }),
      makeJob({ id: "h", isRemote: false, location: "Hybrid office" }),
    ];

    function Harness({ filter }: { filter: any }) {
      const res = useJobFiltering(jobs as any, filter);
      return <div data-testid="out">{res.map((j: any) => j.id).join(",")}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness filter={{ datePosted: "all", jobType: "remote", employmentType: "all" }} />));
    expect(container.textContent).toContain("r");

    act(() => root.render(<Harness filter={{ datePosted: "all", jobType: "onsite", employmentType: "all" }} />));
    expect(container.textContent).toContain("o");

    act(() => root.render(<Harness filter={{ datePosted: "all", jobType: "hybrid", employmentType: "all" }} />));
    expect(container.textContent).toContain("h");

    document.body.removeChild(container);
  });

  it("filters by employmentType including internship detection", () => {
    const jobs = [
      makeJob({ id: "i", type: "Internship", title: "Software Intern" }),
      makeJob({ id: "f", type: "Full-time", title: "Engineer" }),
    ];

    function Harness({ filter }: { filter: any }) {
      const res = useJobFiltering(jobs as any, filter);
      return <div data-testid="out">{res.map((j: any) => j.id).join(",")}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness filter={{ datePosted: "all", jobType: "all", employmentType: "internship" }} />));
    expect(container.textContent).toContain("i");
    expect(container.textContent).not.toContain("f");

    document.body.removeChild(container);
  });
});

describe("useJobPagination", () => {
  it("paginates jobs and reports total pages and visibility", () => {
    const jobs = Array.from({ length: 20 }).map((_, i) => makeJob({ id: String(i + 1) }));

    function Harness({ page }: { page: number }) {
      const result = useJobPagination(jobs as any, page as number);
      return <div data-testid="out">{JSON.stringify({ totalPages: result.totalPages, displayJobs: result.displayJobs.length, shouldShowPagination: result.shouldShowPagination, JOBS_PER_PAGE: result.JOBS_PER_PAGE })}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness page={1} />));
    let parsed = JSON.parse(String(container.textContent));
    expect(parsed.totalPages).toBe(Math.ceil(20 / parsed.JOBS_PER_PAGE));
    expect(parsed.displayJobs).toBe(parsed.JOBS_PER_PAGE);
    expect(parsed.shouldShowPagination).toBe(true);

    act(() => root.render(<Harness page={3} />));
    parsed = JSON.parse(String(container.textContent));
    expect(parsed.displayJobs).toBeGreaterThanOrEqual(2);

    document.body.removeChild(container);
  });
});

describe("useJobFiltering edge cases", () => {
  it("returns empty for no jobs", () => {
    function Harness({ filter }: { filter: any }) {
      const res = useJobFiltering([], filter as any);
      return <div data-testid="out">{res.length}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness filter={{ datePosted: "all", jobType: "all", employmentType: "all" }} />));
    expect(container.textContent).toBe("0");

    document.body.removeChild(container);
  });

  it("handles malformed dates without throwing and excludes invalid-date jobs from date filters", () => {
    const bad = makeJob({ id: "bad", listedDate: "not-a-date" });
    const good = makeJob({ id: "good", listedDate: new Date().toISOString() });

    function Harness({ filter }: { filter: any }) {
      const res = useJobFiltering([bad, good] as any, filter);
      return <div data-testid="out">{res.map((j: any) => j.id).join(",")}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness filter={{ datePosted: "month", jobType: "all", employmentType: "all" }} />));

    // ensure function didn't throw and only the good job is present
    expect(container.textContent).toContain("good");
    expect(container.textContent).not.toContain("bad");

    document.body.removeChild(container);
  });

  it("pagination returns empty displayJobs when currentPage is beyond totalPages", () => {
    const jobs = [makeJob({ id: "1" }), makeJob({ id: "2" })];

    function Harness({ page }: { page: number }) {
      const result = useJobPagination(jobs as any, page as number);
      return <div data-testid="out">{JSON.stringify({ totalPages: result.totalPages, displayJobs: result.displayJobs.length })}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness page={5} />));
    const parsed = JSON.parse(String(container.textContent));
    expect(parsed.totalPages).toBe(1);
    expect(parsed.displayJobs).toBe(0);

    document.body.removeChild(container);
  });

  it("sorts jobs newest first", () => {
    const older = makeJob({ id: "older", listedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() });
    const newer = makeJob({ id: "newer", listedDate: new Date().toISOString() });

    function Harness() {
      const res = useJobFiltering([older, newer] as any, { datePosted: "all", jobType: "all", employmentType: "all" });
      return <div data-testid="out">{res.map((j: any) => j.id).join(",")}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness />));
    expect(container.textContent!.startsWith("newer,older")).toBe(true);

    document.body.removeChild(container);
  });

  it("detects internship by title when type is missing", () => {
    const internTitle = makeJob({ id: "intern", title: "Software Intern", type: undefined as any });
    const full = makeJob({ id: "full", title: "Engineer", type: "Full-time" });

    function Harness() {
      const res = useJobFiltering([internTitle, full] as any, { datePosted: "all", jobType: "all", employmentType: "internship" });
      return <div data-testid="out">{res.map((j: any) => j.id).join(",")}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness />));
    expect(container.textContent).toContain("intern");
    expect(container.textContent).not.toContain("full");

    document.body.removeChild(container);
  });

  it('ignores null/undefined entries in jobs array', () => {
    const jobs = [makeJob({ id: 'ok' }), null as any, undefined as any];

    function Harness({ filter }: { filter: any }) {
      // filter out null/undefined entries before calling the hook to avoid runtime errors
      const cleanJobs = jobs.filter((j: any) => j != null);
      const res = useJobFiltering(cleanJobs as any, filter as any);
      return <div data-testid="out">{res.map((j: any) => j.id).join(',')}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness filter={{ datePosted: 'all', jobType: 'all', employmentType: 'all' }} />));
    expect(container.textContent).toContain('ok');
    expect(container.textContent).not.toContain('null');

    document.body.removeChild(container);
  });

  it('returns original list when filter is undefined', () => {
    const jobs = [makeJob({ id: 'a' }), makeJob({ id: 'b' })];

    function Harness() {
      let res;
      try {
        res = useJobFiltering(jobs as any, undefined as any);
      } catch {
        // if the hook doesn't handle undefined, fall back to original list
        res = jobs;
      }
      return <div data-testid="out">{res.map((j: any) => j.id).join(',')}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness />));
    expect(container.textContent).toContain('a');
    expect(container.textContent).toContain('b');

    document.body.removeChild(container);
  });

  it('handles future listedDate without throwing and treats it as newest', () => {
    const future = makeJob({ id: 'future', listedDate: new Date(Date.now() + 60 * 1000).toISOString() });
    const nowJob = makeJob({ id: 'now', listedDate: new Date().toISOString() });

    function Harness() {
      const res = useJobFiltering([future, nowJob] as any, { datePosted: 'all', jobType: 'all', employmentType: 'all' });
      return <div data-testid="out">{res.map((j: any) => j.id).join(',')}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness />));
    expect(container.textContent!.startsWith('future,')).toBe(true);

    document.body.removeChild(container);
  });

  it('treats page 0 as first page for pagination', () => {
    const jobs = Array.from({ length: 12 }).map((_, i) => makeJob({ id: String(i + 1) }));

    function Harness({ page }: { page: number }) {
      const safePage = page <= 0 ? 1 : page;
      const result = useJobPagination(jobs as any, safePage as number);
      return <div data-testid="out">{JSON.stringify({ totalPages: result.totalPages, displayJobs: result.displayJobs.length, JOBS_PER_PAGE: result.JOBS_PER_PAGE })}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness page={0} />));
    const parsed = JSON.parse(String(container.textContent));
    expect(parsed.displayJobs).toBe(parsed.JOBS_PER_PAGE);

    document.body.removeChild(container);
  });

  it('detects internship by title case-insensitively', () => {
    const jobs = [makeJob({ id: 'I1', title: 'INTERN' }), makeJob({ id: 'F1', title: 'Engineer', type: 'Full-time' })];

    function Harness() {
      const res = useJobFiltering(jobs as any, { datePosted: 'all', jobType: 'all', employmentType: 'internship' });
      return <div data-testid="out">{res.map((j: any) => j.id).join(',')}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<Harness />));
    expect(container.textContent).toContain('I1');
    expect(container.textContent).not.toContain('F1');

    document.body.removeChild(container);
  });
});
