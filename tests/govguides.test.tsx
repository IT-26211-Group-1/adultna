import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockGet = jest.fn();

jest.mock("@/lib/apiClient", () => {
  const actual = jest.requireActual("@/lib/apiClient");
  return {
    ...actual,
    ApiClient: {
      get: (...args: any[]) => mockGet(...args),
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

import { useGovGuides, useGovGuide, useTranslatedGuide } from "../hooks/queries/useGovGuidesQueries";

describe("GovGuides queries", () => {
  it("useGovGuides fetches list without params", async () => {
    mockGet.mockResolvedValue({ guides: [{ id: "g1", title: "G1" }], total: 1, success: true });

    const qc = new QueryClient();

    function Harness() {
      const { guides } = useGovGuides();
      return <div data-testid="out">{JSON.stringify(guides)}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    await act(async () => new Promise((r) => setTimeout(r, 0)));

    expect(mockGet).toHaveBeenCalledWith("/guides/public");
    expect(container.textContent).toContain("G1");

    document.body.removeChild(container);
  });

  it("useGovGuides appends query params when provided", async () => {
    mockGet.mockResolvedValue({ guides: [], total: 0, success: true });

    const qc = new QueryClient();

    function Harness() {
      const { guides } = useGovGuides({ status: "accepted" as any });
      return <div data-testid="out">{JSON.stringify(guides)}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    await act(async () => new Promise((r) => setTimeout(r, 0)));

    expect(mockGet).toHaveBeenCalledWith("/guides/public?status=accepted");

    document.body.removeChild(container);
  });

  it("useGovGuide fetches guide detail when id provided", async () => {
    mockGet.mockResolvedValue({ guide: { id: "g1", title: "Detail" }, success: true });

    const qc = new QueryClient();

    function Harness() {
      const { guide } = useGovGuide("g1");
      return <div data-testid="one">{guide ? guide.title : ""}</div>;
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    await act(async () => new Promise((r) => setTimeout(r, 0)));

    expect(mockGet).toHaveBeenCalledWith("/guides/public/g1");
    expect(container.querySelector("[data-testid=one]")!.textContent).toBe("Detail");

    document.body.removeChild(container);
  });

  it("useTranslatedGuide calls translate endpoint only when language is 'fil'", async () => {
    mockGet.mockResolvedValue({ title: "T", description: "D", steps: [], requirements: [], generalTips: null });

    const qc = new QueryClient();

    // language 'en' -> disabled
    function HarnessEn() {
      const { data } = useTranslatedGuide("g1", "en");
      return <div data-testid="en">{String(!!data)}</div>;
    }

    const containerEn = document.createElement("div");
    document.body.appendChild(containerEn);
    const rootEn = createRoot(containerEn);

    await act(async () =>
      rootEn.render(
        <QueryClientProvider client={qc}>
          <HarnessEn />
        </QueryClientProvider>,
      ),
    );

    await act(async () => new Promise((r) => setTimeout(r, 0)));

    // not called for 'en'
    expect(mockGet).not.toHaveBeenCalledWith("/guides/public/g1/translate?lang=en");

    document.body.removeChild(containerEn);

    // language 'fil' -> should call
    function HarnessFil() {
      const { data } = useTranslatedGuide("g1", "fil");
      return <div data-testid="fil">{String(!!data)}</div>;
    }

    const containerFil = document.createElement("div");
    document.body.appendChild(containerFil);
    const rootFil = createRoot(containerFil);

    await act(async () =>
      rootFil.render(
        <QueryClientProvider client={qc}>
          <HarnessFil />
        </QueryClientProvider>,
      ),
    );

    await act(async () => new Promise((r) => setTimeout(r, 0)));

    expect(mockGet).toHaveBeenCalledWith("/guides/public/g1/translate?lang=fil");

    document.body.removeChild(containerFil);
  });

  it('handles API rejection without throwing', async () => {
    mockGet.mockRejectedValueOnce(new Error('network'));

    const qc = new QueryClient();

    function Harness() {
      const { guides } = useGovGuides();
      return <div data-testid="out">{String(Array.isArray(guides) ? guides.length : 0)}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    // ensure the API was attempted
    expect(mockGet).toHaveBeenCalledWith('/guides/public');

    document.body.removeChild(container);
  });

  it('handles missing guides key in response gracefully', async () => {
    mockGet.mockResolvedValueOnce({ success: true });

    const qc = new QueryClient();

    function Harness() {
      const { guides } = useGovGuides();
      return <div data-testid="out">{String(guides ? guides.length : 0)}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    expect(mockGet).toHaveBeenCalledWith('/guides/public');

    document.body.removeChild(container);
  });

  it('useTranslatedGuide tolerates translate endpoint failure', async () => {
    // return normal guide for non-translate calls, but fail translate
    mockGet.mockImplementation((url: string) => {
      if (url.includes('/translate')) return Promise.reject(new Error('404'));
      return Promise.resolve({ title: 'T', description: 'D', steps: [], requirements: [], generalTips: null });
    });

    const qc = new QueryClient();

    function Harness() {
      const { data } = useTranslatedGuide('g2', 'fil');
      return <div data-testid="out">{String(!!data)}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    expect(mockGet).toHaveBeenCalledWith('/guides/public/g2/translate?lang=fil');

    document.body.removeChild(container);
  });

  it('handles a large list of guides without crashing', async () => {
    const big = Array.from({ length: 200 }).map((_, i) => ({ id: `g${i}`, title: `G${i}` }));
    mockGet.mockResolvedValueOnce({ guides: big, total: big.length, success: true });

    const qc = new QueryClient();

    function Harness() {
      const { guides } = useGovGuides();
      return <div data-testid="out">{String((guides || []).length)}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    expect(container.textContent).toContain('200');

    document.body.removeChild(container);
  });

  it('does not throw when guide fields are null or missing', async () => {
    mockGet.mockResolvedValueOnce({ guides: [{ id: null, title: null }], total: 1, success: true });

    const qc = new QueryClient();

    function Harness() {
      const { guides } = useGovGuides();
      return <div data-testid="out">{String(Array.isArray(guides) ? guides.length : 0)}</div>;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    expect(container.textContent).toContain('1');

    document.body.removeChild(container);
  });
});
