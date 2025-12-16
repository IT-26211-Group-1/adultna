import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mocks for gabay API
const mockChat = jest.fn();
const mockRename = jest.fn();
const mockGetConversations = jest.fn();
const mockGetMessages = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/api/gabay", () => ({
  gabayApi: {
    chat: (...args: any[]) => mockChat(...args),
    renameConversation: (...args: any[]) => mockRename(...args),
    getConversations: (...args: any[]) => mockGetConversations(...args),
    getConversationMessages: (...args: any[]) => mockGetMessages(...args),
    deleteConversation: (...args: any[]) => mockDelete(...args),
  },
}));

const mockAddToast = jest.fn();
jest.mock("@heroui/toast", () => ({ addToast: (...args: any[]) => mockAddToast(...args) }));

const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };
jest.mock("@/lib/logger", () => ({ logger: mockLogger }));

import {
  useGabayChat,
  useRenameConversation,
  useGabayConversationMessages,
  useDeleteConversation,
  useGabayConversations,
} from "../hooks/queries/useGabayQueries";

afterEach(() => {
  jest.clearAllMocks();
});

describe("useGabayChat & related hooks", () => {
  it("useGabayChat sends message and returns data", async () => {
    mockChat.mockResolvedValue({ reply: "ok", sessionId: "s1" });

    const qc = new QueryClient();

    function Harness() {
      const { sendMessageAsync, data } = useGabayChat();

      return (
        <div>
          <button id="btn" onClick={() => sendMessageAsync({ message: "hi", sessionId: "s1" } as any)}>go</button>
          <div data-testid="out">{JSON.stringify(data || {})}</div>
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

    const btn = container.querySelector("#btn") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockChat).toHaveBeenCalledWith({ message: "hi", sessionId: "s1" });
    document.body.removeChild(container);
  });

  it("useRenameConversation calls API and onSuccess callback", async () => {
    mockRename.mockResolvedValue({ success: true });

    const onSuccess = jest.fn();
    const qc = new QueryClient();

    function Harness() {
      const { renameConversationAsync } = useRenameConversation({ onSuccess });

      return (
        <div>
          <button id="btn" onClick={() => renameConversationAsync({ sessionId: "s1", newTopic: "t" } as any)}>go</button>
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

    const btn = container.querySelector("#btn") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockRename).toHaveBeenCalledWith("s1", "t");
    expect(onSuccess).toHaveBeenCalledWith("s1", "t");
    document.body.removeChild(container);
  });

  it("useGabayConversationMessages returns messages for a session", async () => {
    mockGetMessages.mockResolvedValue({ messages: [{ id: "m1", text: "hello" }] });

    const qc = new QueryClient();

    function Harness() {
      const { data } = useGabayConversationMessages("s1");

      return <div data-testid="count">{(data || []).length}</div>;
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

    // wait a tick for query to resolve
    await act(async () => new Promise((r) => setTimeout(r, 0)));

    expect(mockGetMessages).toHaveBeenCalledWith("s1");
    expect(container.querySelector("[data-testid=count]")!.textContent).toBe("1");
    document.body.removeChild(container);
  });

  it("useDeleteConversation shows toast on success and calls callback", async () => {
    mockDelete.mockResolvedValue({ success: true });

    const onSuccess = jest.fn();
    const qc = new QueryClient();

    function Harness() {
      const { deleteConversationAsync } = useDeleteConversation({ onSuccess });

      return (
        <div>
          <button id="btn" onClick={() => deleteConversationAsync("s1")}>go</button>
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

    const btn = container.querySelector("#btn") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockDelete).toHaveBeenCalledWith("s1");
    expect(mockAddToast).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith("s1");
    document.body.removeChild(container);
  });

  it("useGabayConversations loads pages and uses getNextPageParam", async () => {
    mockGetConversations.mockResolvedValue({ hasMore: false, conversations: [] });

    const qc = new QueryClient();

    function Harness() {
      const { data } = useGabayConversations();

      return <div data-testid="pages">{JSON.stringify(data || {})}</div>;
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

    // allow query to resolve
    await act(async () => new Promise((r) => setTimeout(r, 0)));

    expect(mockGetConversations).toHaveBeenCalled();
    document.body.removeChild(container);
  });
});

describe('ChatInput and ChatContainer validation/filters', () => {
  it('ChatInput shows character counter and limit styling when near/at limit', async () => {
    const { ChatInput } = require('../app/(protected)/ai-gabay/_components/ChatInput')

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    await act(async () =>
      root.render(<ChatInput onSubmit={() => {}} />),
    )

    const input = container.querySelector('input') as HTMLInputElement
    const submit = container.querySelector('button[type="submit"]') as HTMLButtonElement

    // simulate long input beyond MAX_CHARACTERS (2000)
    const long = 'a'.repeat(2001)
    await act(async () => {
      input.value = long
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await new Promise((r) => setTimeout(r, 0))
    })

    // counter should show 2001 / 2000
    expect(container.textContent).toContain('2001 / 2000')

    // input should have the red border class when at limit
    expect(input.className).toMatch(/border-red-400|text-red-600/)

    // submit remains present (component doesn't prevent submit), but is enabled because input.trim() is truthy
    expect(submit.disabled).toBe(false)

    document.body.removeChild(container)
  })

  it('ChatContainer handles blocked/inappropriate responses by showing error message', async () => {
    // isolate modules to apply mocks cleanly
    await jest.isolateModules(async () => {
      // mock child components and router/searchParams before requiring ChatContainer
      jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), replace: jest.fn() }), useSearchParams: () => ({ get: () => null }) }))

      // mock the gabay hooks to simulate blocked response
      jest.mock('../hooks/queries/useGabayQueries', () => ({
        useGabayChat: (opts: any) => ({
          sendMessage: (payload: any) => {
            // simulate backend blocked response
            opts.onSuccess && opts.onSuccess({ blocked: true, blockReason: 'Inappropriate content' }, payload.message)
          },
          isPending: false,
        }),
        useGabayConversations: () => ({ data: { pages: [] }, fetchNextPage: () => {}, hasNextPage: false, isFetchingNextPage: false, refetch: () => {} }),
        useGabayConversationMessages: () => ({ data: [] }),
        useRenameConversation: () => ({ renameConversation: () => {}, renameConversationAsync: async () => {} }),
        useDeleteConversation: () => ({ deleteConversation: () => {}, deleteConversationAsync: async () => {} }),
      }))

      // mock ChatMessage to simplify rendering
      jest.mock('../app/(protected)/ai-gabay/_components/ChatMessage', () => ({
        ChatMessage: ({ message, error }: any) => (
          <div className="mock-chat">
            <span className="msg">{message}</span>
            {error && <span className="err">{error}</span>}
          </div>
        ),
      }))

      const { ChatContainer } = require('../app/(protected)/ai-gabay/_components/ChatContainer')

      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      // ensure crypto.randomUUID exists for message ids
      // @ts-ignore
      global.crypto = global.crypto || { randomUUID: () => 'id' }

      act(() => root.render(<ChatContainer />))

      // find input inside ChatContainer (ChatInput)
      const input = container.querySelector('input') as HTMLInputElement
      const form = container.querySelector('form') as HTMLFormElement

      // set a message and submit
      await act(async () => {
        input.value = 'this is bad'
        input.dispatchEvent(new Event('input', { bubbles: true }))
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
        await new Promise((r) => setTimeout(r, 0))
      })

      // after blocked response, error text should appear in DOM
      expect(container.textContent).toContain('Inappropriate content')

      document.body.removeChild(container)
    })
  })
})

describe('useGabayQueries edge cases', () => {
  it('useGabayChat logs error on API rejection', async () => {
    mockChat.mockRejectedValueOnce(new Error('network'));

    const qc = new QueryClient();

    function Harness() {
      const { sendMessageAsync } = useGabayChat();
      return <button id="btn" onClick={() => sendMessageAsync({ message: 'x' } as any)}>go</button>;
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

    const btn = container.querySelector('#btn') as HTMLButtonElement;

    await act(async () => {
      try {
        btn.click();
        await new Promise((r) => setTimeout(r, 0));
      } catch (e) {
        // swallow - we assert logging
      }
    });

    expect(mockChat).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('useRenameConversation does not call onSuccess when API fails', async () => {
    mockRename.mockRejectedValueOnce(new Error('fail'));

    const onSuccess = jest.fn();
    const qc = new QueryClient();

    function Harness() {
      const { renameConversationAsync } = useRenameConversation({ onSuccess });
      return <button id="btn" onClick={() => renameConversationAsync({ sessionId: 's', newTopic: 't' } as any)}>go</button>;
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

    const btn = container.querySelector('#btn') as HTMLButtonElement;

    await act(async () => {
      try {
        btn.click();
        await new Promise((r) => setTimeout(r, 0));
      } catch (e) {}
    });

    expect(mockRename).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('useGabayConversationMessages handles null messages gracefully', async () => {
    mockGetMessages.mockResolvedValueOnce({ messages: null });

    const qc = new QueryClient();

    function Harness() {
      const { data } = useGabayConversationMessages('s1');
      return <div data-testid="out">{String((data || []).length)}</div>;
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

    await act(async () => new Promise((r) => setTimeout(r, 0)));

    expect(container.querySelector('[data-testid=out]')!.textContent).toBe('0');

    document.body.removeChild(container);
  });

  it('useDeleteConversation non-success response triggers toast and does not call onSuccess', async () => {
    mockDelete.mockResolvedValueOnce({ success: false, message: 'not found' });

    const onSuccess = jest.fn();
    const qc = new QueryClient();

    function Harness() {
      const { deleteConversationAsync } = useDeleteConversation({ onSuccess });
      return <button id="btn" onClick={() => deleteConversationAsync('s1')}>go</button>;
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

    const btn = container.querySelector('#btn') as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockDelete).toHaveBeenCalledWith('s1');
    expect(mockAddToast).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('useGabayConversations tolerates malformed response without throwing', async () => {
    mockGetConversations.mockResolvedValueOnce({});

    const qc = new QueryClient();

    function Harness() {
      const { data } = useGabayConversations();
      return <div data-testid="out">{JSON.stringify(data || {})}</div>;
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

    await act(async () => new Promise((r) => setTimeout(r, 0)));

    expect(mockGetConversations).toHaveBeenCalled();

    document.body.removeChild(container);
  });
});
