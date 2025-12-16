import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Minimal mock for ApiClient and queryKeys used by hooks
const mockPost = jest.fn();
const mockPatch = jest.fn();
const mockPut = jest.fn();
const mockGet = jest.fn();

jest.mock("@/lib/apiClient", () => ({
  ApiClient: {
    post: (...args: any[]) => mockPost(...args),
    patch: (...args: any[]) => mockPatch(...args),
    put: (...args: any[]) => mockPut(...args),
    get: (...args: any[]) => mockGet(...args),
  },
  queryKeys: {
    coverLetters: { detail: (id: string) => ["coverLetters", "detail", id] },
    filebox: { quota: () => ["filebox", "quota"] },
  },
}));

// Ensure env used by export hook is defined
process.env.NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API || "https://api.example";

import {
  useExportCoverLetter,
  useGenerateUploadUrl,
  useUploadFile,
  useUpdateSection,
} from "../hooks/queries/useCoverLetterQueries";

afterEach(() => {
  jest.clearAllMocks();
});

describe("cover letter query hooks - important flows", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null as any;
    jest.resetAllMocks();
  });

  it("useExportCoverLetter calls fetch and revokes object URL", async () => {
    // mock a fetch response with headers and blob
    const fakeBlob = new Blob(["pdf-content"], { type: "application/pdf" });
    const headers = new Map([["Content-Disposition", 'attachment; filename="myletter.pdf"']]);

    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: async () => fakeBlob,
      headers: { get: (k: string) => headers.get(k) },
    });

    // Ensure window.URL has createObjectURL/revokeObjectURL so jest.spyOn can attach
    // @ts-ignore
    if (!window.URL) window.URL = {} as any;
    // @ts-ignore
    if (!("createObjectURL" in window.URL)) {
      // @ts-ignore
      window.URL.createObjectURL = () => "blob://u";
    }
    // @ts-ignore
    if (!("revokeObjectURL" in window.URL)) {
      // @ts-ignore
      window.URL.revokeObjectURL = () => undefined;
    }

    const createUrl = jest.spyOn(window.URL as any, "createObjectURL").mockReturnValue("blob://u");
    const revoke = jest.spyOn(window.URL as any, "revokeObjectURL").mockImplementation(() => undefined);

    function Harness() {
      const exportHook = useExportCoverLetter();

      return (
        <div>
          <button id="btn-export" onClick={() => exportHook.mutateAsync("cid-1")}>export</button>
        </div>
      );
    }

    const root = createRoot(container);
    const qc = new QueryClient();
    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    const btn = container.querySelector("#btn-export") as HTMLButtonElement;

    await act(async () => {
      await btn.click();
      // allow microtasks
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API}/cover-letters/cid-1/export`,
      expect.objectContaining({ method: "GET" }),
    );

    expect(createUrl).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalled();
  });

  it("generate upload url then upload file (PUT) via useGenerateUploadUrl + useUploadFile", async () => {
    mockPost.mockResolvedValue({ data: { uploadUrl: "https://upload.example/puthere", fileKey: "fkey" } });

    // mock fetch PUT for upload
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200 });

    function Harness() {
      const gen = useGenerateUploadUrl();
      const upload = useUploadFile();

      return (
        <div>
          <button
            id="btn-gen"
            onClick={async () => {
              const data = await gen.mutateAsync({ fileName: "f.pdf", contentType: "application/pdf", fileSize: 123 });
              // now call upload with returned url
              await upload.mutateAsync({ uploadUrl: data.uploadUrl, file: new File(["x"], "f.pdf", { type: "application/pdf" }) });
            }}
          >
            gen
          </button>
        </div>
      );
    }

    const root = createRoot(container);
    const qc = new QueryClient();
    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    const btn = container.querySelector("#btn-gen") as HTMLButtonElement;

    await act(async () => {
      btn.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPost).toHaveBeenCalledWith("/cover-letters/generate-upload-url", expect.any(Object));
    expect(global.fetch).toHaveBeenCalledWith("https://upload.example/puthere", expect.objectContaining({ method: "PUT" }));
  });

  it("useUpdateSection throws when sectionType missing and returns section on success", async () => {
    // success response
    mockPatch.mockResolvedValue({ data: [{ sectionType: "intro", content: "new" }] });

    function Harness() {
      const upd = useUpdateSection("cid-2");

      return (
        <div>
          <button
            id="btn-bad"
            onClick={() => {
              // @ts-ignore force empty sectionType
              // capture rejection to avoid an unhandled promise rejection from the click event
              upd.mutateAsync({ content: "x", sectionType: "" }).catch((e) => {
                (window as any).__updateSectionError = e;
              });
            }}
          >
            bad
          </button>
          <button
            id="btn-ok"
            onClick={() => upd.mutateAsync({ content: "ok", sectionType: "intro" })}
          >
            ok
          </button>
        </div>
      );
    }

    const root = createRoot(container);
    const qc = new QueryClient();
    await act(async () =>
      root.render(
        <QueryClientProvider client={qc}>
          <Harness />
        </QueryClientProvider>,
      ),
    );

    const bad = container.querySelector("#btn-bad") as HTMLButtonElement;
    const ok = container.querySelector("#btn-ok") as HTMLButtonElement;

    // bad -> should reject
        await act(async () => {
          // clear any previous error capture
          (window as any).__updateSectionError = undefined;
          bad.click();
          await new Promise((r) => setTimeout(r, 0));
          expect((window as any).__updateSectionError).toBeTruthy();
        });

    // ok -> resolves and calls ApiClient.patch
    await act(async () => {
      ok.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockPatch).toHaveBeenCalledWith("/cover-letters/cid-2/sections", { sections: [{ sectionType: "intro", content: "ok" }] });
  });
});
