import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mocks
const mockSetSecureItem = jest.fn();
const mockGetSecureItem = jest.fn();

jest.mock("@/hooks/useSecureStorage", () => ({
  useSecureStorage: () => ({
    setSecureItem: mockSetSecureItem,
    getSecureItem: mockGetSecureItem,
    removeSecureItem: jest.fn(),
    clearAllSecure: jest.fn(),
  }),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));

const mockAddToast = jest.fn();
jest.mock("@heroui/toast", () => ({ addToast: (...args: any[]) => mockAddToast(...args) }));

const mockInterviewClear = jest.fn();
jest.mock("@/utils/interviewStorage", () => ({ interviewStorage: { clear: (...args: any[]) => mockInterviewClear(...args) } }));

// ApiClient mock used by admin interview queries
const mockApiPost = jest.fn();
const mockApiGet = jest.fn();
jest.mock("@/lib/apiClient", () => ({ ApiClient: { post: (...args: any[]) => mockApiPost(...args), get: (...args: any[]) => mockApiGet(...args) } }));

import { useMockInterviewState } from "../hooks/useMockInterviewState";
import { useInterviewSubmission } from "../hooks/useInterviewSubmission";
import { useCreateInterviewSession, useSpeechToText } from "../hooks/queries/admin/useInterviewQuestionQueries";

afterEach(() => {
  jest.clearAllMocks();
});

describe("useMockInterviewState", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null as any;
  });

  it("selectField sets general to General job role and moves to guidelines", async () => {
    mockGetSecureItem.mockReturnValue(null);

    function Harness() {
      const { state, actions } = useMockInterviewState();

      return (
        <div>
          <div data-testid="step">{state.currentStep}</div>
          <div data-testid="job">{state.selectedJobRole || ""}</div>
          <button id="btn" onClick={() => actions.selectField("general")}>go</button>
        </div>
      );
    }

    const root = createRoot(container);
    await act(async () => root.render(<Harness />));

    expect(container.querySelector("[data-testid=step]")!.textContent).toBe("field");

    const btn = container.querySelector("#btn") as HTMLButtonElement;
    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(container.querySelector("[data-testid=step]")!.textContent).toBe("guidelines");
    expect(container.querySelector("[data-testid=job]")!.textContent).toBe("General");
    expect(mockSetSecureItem).toHaveBeenCalled();
  });

  it("startQuestions sets session and questions and goBack navigates correctly", async () => {
    mockGetSecureItem.mockReturnValue(null);

    function Harness() {
      const { state, actions } = useMockInterviewState();

      return (
        <div>
          <div data-testid="step">{state.currentStep}</div>
          <div data-testid="idx">{state.currentQuestionIndex}</div>
          <button id="start" onClick={() => actions.startQuestions("s1", [{ id: "q1" } as any])}>start</button>
          <button id="back" onClick={() => actions.goBack()}>back</button>
        </div>
      );
    }

    const root = createRoot(container);
    await act(async () => root.render(<Harness />));

    const start = container.querySelector("#start") as HTMLButtonElement;
    const back = container.querySelector("#back") as HTMLButtonElement;

    await act(async () => {
      start.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(container.querySelector("[data-testid=step]")!.textContent).toBe("questions");
    expect(container.querySelector("[data-testid=idx]")!.textContent).toBe("0");
    expect(mockSetSecureItem).toHaveBeenCalled();

    await act(async () => {
      back.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    // from questions goBack should move to guidelines
    expect(container.querySelector("[data-testid=step]")!.textContent).toBe("guidelines");
  });

  it('initializes from stored state when valid JSON present', async () => {
    const stored = JSON.stringify({ currentStep: 'questions', selectedField: 'f', selectedJobRole: 'J', sessionId: 's1', sessionQuestions: [{ id: 'q1' }], currentQuestionIndex: 2 });
    mockGetSecureItem.mockReturnValueOnce(stored);

    function Harness() {
      const { state } = useMockInterviewState();
      return (
        <div>
          <div data-testid="step">{state.currentStep}</div>
          <div data-testid="idx">{state.currentQuestionIndex}</div>
          <div data-testid="sess">{state.sessionId}</div>
        </div>
      );
    }

    const root = createRoot(container);
    await act(async () => root.render(<Harness />));

    expect(container.querySelector('[data-testid=step]')!.textContent).toBe('questions');
    expect(container.querySelector('[data-testid=idx]')!.textContent).toBe('2');
    expect(container.querySelector('[data-testid=sess]')!.textContent).toBe('s1');
  });

  it('invalid stored JSON falls back to default state', async () => {
    mockGetSecureItem.mockReturnValueOnce('not-json');

    function Harness() {
      const { state } = useMockInterviewState();
      return <div data-testid="step">{state.currentStep}</div>;
    }

    const root = createRoot(container);
    await act(async () => root.render(<Harness />));

    expect(container.querySelector('[data-testid=step]')!.textContent).toBe('field');
  });
});

describe("useInterviewSubmission", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null as any;
  });

  it("shows toast and returns when no answers", async () => {
    function Harness() {
      const { submitInterview } = useInterviewSubmission();

      return (
        <div>
          <button id="btn" onClick={() => submitInterview([], { jobRole: "r", totalQuestions: 0, answeredQuestions: 0 })}>go</button>
        </div>
      );
    }

    const root = createRoot(container);
    await act(async () => root.render(<Harness />));
    const btn = container.querySelector("#btn") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockAddToast).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("stores results, clears interviewStorage and navigates on success", async () => {
    function Harness() {
      const { submitInterview } = useInterviewSubmission();

      return (
        <div>
          <button id="btn" onClick={() => submitInterview(["a1"], { jobRole: "r", totalQuestions: 1, answeredQuestions: 1 }, "s1")}>go</button>
        </div>
      );
    }

    const root = createRoot(container);
    await act(async () => root.render(<Harness />));

    const btn = container.querySelector("#btn") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockSetSecureItem).toHaveBeenCalledWith(
      "interview_results",
      expect.any(String),
      60 * 24,
    );
    expect(mockInterviewClear).toHaveBeenCalledWith("s1");
    expect(mockAddToast).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/mock-interview/results");
  });

  it('submitInterview shows failure toast when secure storage throws', async () => {
    // make setSecureItem throw
    mockSetSecureItem.mockImplementationOnce(() => { throw new Error('storage error') });

    function Harness() {
      const { submitInterview } = useInterviewSubmission();

      return (
        <div>
          <button id="btn" onClick={() => submitInterview(['a1'], { jobRole: 'r', totalQuestions: 1, answeredQuestions: 1 })}>go</button>
        </div>
      );
    }

    const root = createRoot(container);
    await act(async () => root.render(<Harness />));

    const btn = container.querySelector('#btn') as HTMLButtonElement;
    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Failed to complete interview. Please try again.' }));
    expect(mockPush).not.toHaveBeenCalledWith('/mock-interview/results');
  });
});

describe("useCreateInterviewSession (admin)", () => {
  it("calls ApiClient.post via createSessionAsync", async () => {
    mockApiPost.mockResolvedValue({ data: { sessionId: "sess1" } });

    // simple harness that calls createSessionAsync
    function Harness() {
      const { createSessionAsync } = useCreateInterviewSession();

      return (
        <div>
          <button id="btn" onClick={() => createSessionAsync({ jobRole: "dev", questions: [] } as any)}>go</button>
        </div>
      );
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const qc = new QueryClient();

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    const btn = container.querySelector("#btn") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockApiPost).toHaveBeenCalled();
    document.body.removeChild(container);
  });
});

describe("useSpeechToText.transcribeAndPoll", () => {
  it("uploads audio, starts transcription and returns transcript", async () => {
    // presigned URL response
    mockApiPost.mockImplementation((path: string) => {
      if (path === "/transcribe/presigned-url") {
        return Promise.resolve({ data: { uploadUrl: "https://upload.example/put", s3Key: "s3key", jobName: "job-1" } });
      }

      if (path === "/transcribe/start") {
        return Promise.resolve({ data: { jobName: "job-1", status: "started" } });
      }

      return Promise.resolve({});
    });

    mockApiGet.mockImplementation((path: string) => {
      if (path.startsWith("/transcribe/result")) {
        return Promise.resolve({ data: { status: "COMPLETED", transcript: "the transcript" } });
      }

      return Promise.resolve({ data: {} });
    });

    // mock fetch PUT
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    const container = document.createElement("div");
    document.body.appendChild(container);

    const qc = new QueryClient();

    function Harness() {
      const { transcribeAndPoll } = useSpeechToText("user-1");

      return (
        <div>
          <button
            id="btn"
            onClick={async () => {
              const res = await transcribeAndPoll(new Blob(["a"], { type: "audio/webm" }), "dev");
              // attach result to window for assertion
              // @ts-ignore
              window.__lastTranscript = res;
            }}
          >
            go
          </button>
        </div>
      );
    }

    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    const btn = container.querySelector("#btn") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    // @ts-ignore
    expect(window.__lastTranscript).toBe("the transcript");
    expect(mockApiPost).toHaveBeenCalled();
    expect(mockApiGet).toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it("isSpeechRecognitionSupported reflects window API presence", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const qc = new QueryClient();

    function Harness() {
      const { isSpeechRecognitionSupported } = useSpeechToText("user-2");

      return <div data-supported={String(isSpeechRecognitionSupported())} />;
    }

    // ensure no SpeechRecognition
    // @ts-ignore
    delete (window as any).SpeechRecognition;
    // @ts-ignore
    delete (window as any).webkitSpeechRecognition;

    const root = createRoot(container);

    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    expect(container.firstElementChild!.getAttribute("data-supported")).toBe("false");

    // define webkitSpeechRecognition and re-render
    // @ts-ignore
    (window as any).webkitSpeechRecognition = function () {};

    await act(async () => {
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      );
    });

    expect(container.firstElementChild!.getAttribute("data-supported")).toBe("true");

    document.body.removeChild(container);
  });
});
