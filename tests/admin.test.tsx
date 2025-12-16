import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockPatch = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/apiClient", () => {
  const actual = jest.requireActual("@/lib/apiClient");
  return {
    ...actual,
    ApiClient: {
      get: (...args: any[]) => mockGet(...args),
      post: (...args: any[]) => mockPost(...args),
      put: (...args: any[]) => mockPut(...args),
      patch: (...args: any[]) => mockPatch(...args),
      delete: (...args: any[]) => mockDelete(...args),
    },
  };
});

const mockAddToast = jest.fn();
jest.mock("@heroui/toast", () => ({ addToast: (...args: any[]) => mockAddToast(...args) }));

const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };
jest.mock("@/lib/logger", () => ({ logger: mockLogger }));

import { useInterviewQuestions } from "../hooks/queries/admin/useInterviewQuestionQueries";
import { useAdminAuth, useAdminUsers } from "../hooks/queries/admin/useAdminQueries";
import { useGuidesQueries } from "../hooks/queries/admin/useGuidesQueries";
import { useOnboardingQuestions } from "../hooks/queries/admin/useOnboardingQueries";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Admin interview question hooks", () => {
  it("useInterviewQuestions lists questions from API", async () => {
    mockGet.mockResolvedValue({ data: { questions: [{ id: "q1", question: "What is X?" }], total: 1 } });

    const qc = new QueryClient();

    function Harness() {
      const { questions } = useInterviewQuestions();
      return <div data-testid="out">{JSON.stringify(questions)}</div>;
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

    // wait for query to resolve
    await act(async () => new Promise((r) => setTimeout(r, 0)));

    expect(mockGet).toHaveBeenCalledWith("/interview-questions");
    expect(container.textContent).toContain("q1");

    document.body.removeChild(container);
  });

  it("createQuestion mutation posts to API", async () => {
    mockPost.mockResolvedValue({ data: { question: { id: "q2" } } });

    const qc = new QueryClient();

    function Harness() {
      const { createQuestionAsync } = useInterviewQuestions();

      return (
        <div>
          <button id="go" onClick={() => createQuestionAsync({ question: "Q?", category: "general" } as any)}>go</button>
        </div>
      );
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

    const btn = container.querySelector("#go") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/interview-questions", { question: "Q?", category: "general" });

    document.body.removeChild(container);
  });
});

describe("Admin auth hooks", () => {
  it("useAdminAuth login mutation calls API and triggers refetch", async () => {
    mockPost.mockResolvedValue({ success: true, user: { id: "a1", email: "admin@x" } });

    const qc = new QueryClient();
    const refetchSpy = jest.spyOn(qc, "refetchQueries");

    function Harness() {
      const { loginAsync } = useAdminAuth();

      return (
        <div>
          <button id="login" onClick={() => loginAsync({ email: "admin@x", password: "p" } as any)}>login</button>
        </div>
      );
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

    const btn = container.querySelector("#login") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/admin/login", { email: "admin@x", password: "p" });
    expect(refetchSpy).toHaveBeenCalled();

    document.body.removeChild(container);
  });
});

describe("Admin user management", () => {
  it("useAdminUsers lists users from API", async () => {
    mockGet.mockResolvedValue({ users: [{ id: "u1", email: "u1@x" }] });

    const qc = new QueryClient();

    function Harness() {
      const { users } = useAdminUsers();
      return <div data-testid="out-users">{JSON.stringify(users)}</div>;
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

    expect(mockGet).toHaveBeenCalledWith("/admin/list-users");
    expect(container.textContent).toContain("u1");

    document.body.removeChild(container);
  });

  it("updateUserStatus suspends/reactivates a user via API", async () => {
    mockPatch.mockResolvedValue({ success: true, user: { id: "u1", status: "deactivated" } });

    const qc = new QueryClient();

    function Harness() {
      const { updateUserStatusAsync } = useAdminUsers();

      return (
        <div>
          <button id="suspend" onClick={() => updateUserStatusAsync({ userId: "u1", status: "deactivated" } as any)}>s</button>
        </div>
      );
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

    const btn = container.querySelector("#suspend") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPatch).toHaveBeenCalledWith("/admin/update-status/u1", { status: "deactivated" });

    document.body.removeChild(container);
  });

  it("useAdminUsers handles empty user list from API", async () => {
    mockGet.mockResolvedValue({ users: [] });

    const qc = new QueryClient();

    function Harness() {
      const { users } = useAdminUsers();
      return <div data-testid="out-users-empty">{JSON.stringify(users)}</div>;
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

    expect(mockGet).toHaveBeenCalledWith("/admin/list-users");
    expect(container.textContent).toContain("[]");

    document.body.removeChild(container);
  });

  it("updateUserStatus handles API error without throwing uncaught", async () => {
    mockPatch.mockRejectedValue(new Error("network"));

    const qc = new QueryClient();

    function Harness() {
      const { updateUserStatusAsync } = useAdminUsers();

      return (
        <div>
          <button id="suspend-err" onClick={async () => {
            try {
              await updateUserStatusAsync({ userId: "u1", status: "deactivated" } as any);
            } catch (e) { /* swallow for test */ }
          }}>s</button>
        </div>
      );
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

    const btn = container.querySelector("#suspend-err") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPatch).toHaveBeenCalled();

    document.body.removeChild(container);
  });
});

describe("Admin interview question edits", () => {
  it("update interview question calls API put", async () => {
    mockPut.mockResolvedValue({ success: true, question: { id: "q2" } });

    const qc = new QueryClient();

    function Harness() {
      const { updateQuestionAsync } = useInterviewQuestions();

      return (
        <div>
          <button id="edit" onClick={() => updateQuestionAsync({ questionId: "q2", question: "New?" } as any)}>edit</button>
        </div>
      );
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

    const btn = container.querySelector("#edit") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPut).toHaveBeenCalledWith("/interview-questions/q2", { question: "New?", category: undefined, industry: undefined, jobRoles: undefined, source: undefined });

    document.body.removeChild(container);
  });

  it("update interview question with minimal payload still calls API", async () => {
    mockPut.mockResolvedValue({ success: true });

    const qc = new QueryClient();

    function Harness() {
      const { updateQuestionAsync } = useInterviewQuestions();

      return (
        <div>
          <button id="edit-min" onClick={() => updateQuestionAsync({ questionId: "q3" } as any)}>edit-min</button>
        </div>
      );
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

    const btn = container.querySelector("#edit-min") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPut).toHaveBeenCalledWith("/interview-questions/q3", { question: undefined, category: undefined, industry: undefined, jobRoles: undefined, source: undefined });

    document.body.removeChild(container);
  });
});

describe("Admin guides and onboarding", () => {
  it("createGuide posts to API", async () => {
    mockPost.mockResolvedValue({ data: { data: { id: "g1" } } });

    const qc = new QueryClient();
    const { createGuideAsync } = useGuidesQueries();

    function Harness() {
      const { createGuideAsync } = useGuidesQueries();
      return (
        <div>
          <button id="cg" onClick={() => createGuideAsync({ title: "T", category: "other", description: "d", keywords: [], steps: [], requirements: [], processingTime: "1", offices: { issuingAgency: "A" } } as any)}>cg</button>
        </div>
      );
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

    const btn = container.querySelector("#cg") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/guides/create", expect.any(Object));

    document.body.removeChild(container);
  });

  it("batchArchiveGuides calls batch archive endpoint", async () => {
    mockPost.mockResolvedValue({ results: { successful: ["g1"], failed: [] } });

    const qc = new QueryClient();

    function Harness() {
      const { batchArchiveGuidesAsync } = useGuidesQueries();
      return (
        <div>
          <button id="bag" onClick={() => batchArchiveGuidesAsync(["g1"]) }>bag</button>
        </div>
      );
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

    const btn = container.querySelector("#bag") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/guides/batch/archive", { guideIds: ["g1"] });

    document.body.removeChild(container);
  });

  it("createGuide logs error on API failure", async () => {
    mockPost.mockRejectedValue(new Error("bad request"));

    const qc = new QueryClient();

    function Harness() {
      const { createGuideAsync } = useGuidesQueries();
      return (
        <div>
          <button id="cg-err" onClick={async () => {
            try {
              await createGuideAsync({ title: "T" } as any);
            } catch (e) { /* swallow */ }
          }}>cg-err</button>
        </div>
      );
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

    const btn = container.querySelector("#cg-err") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it("batchArchiveGuides handles partial failures", async () => {
    mockPost.mockResolvedValue({ results: { successful: [], failed: [{ guideId: "g2", reason: "x" }] } });

    const qc = new QueryClient();

    function Harness() {
      const { batchArchiveGuidesAsync } = useGuidesQueries();
      return (
        <div>
          <button id="bag-part" onClick={async () => {
            const res = await batchArchiveGuidesAsync(["g2"] as any);
            // attach result to DOM for assertion
            (document.getElementById("out") as any).textContent = JSON.stringify(res);
          }}>bag-part</button>
          <div id="out"></div>
        </div>
      );
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

    const btn = container.querySelector("#bag-part") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/guides/batch/archive", { guideIds: ["g2"] });
    expect(container.querySelector("#out")?.textContent).toContain("g2");

    document.body.removeChild(container);
  });

  it("updateGuide calls API put with guideId and data", async () => {
    mockPut.mockResolvedValue({ data: { guide: { id: "g1", title: "Updated" } } });

    const qc = new QueryClient();

    function Harness() {
      const { updateGuideAsync } = useGuidesQueries();
      return (
        <div>
          <button id="ug" onClick={() => updateGuideAsync({ guideId: "g1", data: { title: "Updated" } } as any)}>ug</button>
        </div>
      );
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

    const btn = container.querySelector("#ug") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPut).toHaveBeenCalledWith("/guides/update/g1", { title: "Updated" });

    document.body.removeChild(container);
  });

  it("create onboarding question posts to onboarding API", async () => {
    mockPost.mockResolvedValue({ success: true, questionId: 123 });

    const qc = new QueryClient();

    function Harness() {
      const { createQuestionAsync } = useOnboardingQuestions();
      return (
        <div>
          <button id="coq" onClick={() => createQuestionAsync({ question: "Q?", category: "personal", options: [{ optionText: "a" }] } as any)}>coq</button>
        </div>
      );
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

    const btn = container.querySelector("#coq") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/onboarding/create", expect.any(Object));

    document.body.removeChild(container);
  });

  it("batchArchiveQuestions for onboarding calls batch archive endpoint", async () => {
    mockPost.mockResolvedValue({ results: { successful: [1], failed: [] } });

    const qc = new QueryClient();

    function Harness() {
      const { batchArchiveQuestionsAsync } = useOnboardingQuestions();
      return (
        <div>
          <button id="baoq" onClick={() => batchArchiveQuestionsAsync([1, 2]) }>baoq</button>
        </div>
      );
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

    const btn = container.querySelector("#baoq") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/admin/onboarding/questions/batch/archive", { questionIds: [1, 2] });

    document.body.removeChild(container);
  });

  it("batchArchiveQuestions handles partial failures for onboarding", async () => {
    mockPost.mockResolvedValue({ results: { successful: [1], failed: [{ questionId: 2, reason: "x" }] } });

    const qc = new QueryClient();

    function Harness() {
      const { batchArchiveQuestionsAsync } = useOnboardingQuestions();
      return (
        <div>
          <button id="baoq-part" onClick={async () => {
            const res = await batchArchiveQuestionsAsync([1, 2] as any);
            (document.getElementById("out-onboarding") as any).textContent = JSON.stringify(res);
          }}>baoq-part</button>
          <div id="out-onboarding"></div>
        </div>
      );
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

    const btn = container.querySelector("#baoq-part") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/admin/onboarding/questions/batch/archive", { questionIds: [1, 2] });
    expect(container.querySelector("#out-onboarding")?.textContent).toContain("questionId");

    document.body.removeChild(container);
  });
});
