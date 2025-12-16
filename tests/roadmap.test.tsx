import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock ApiClient while preserving queryKeys
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPatch = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/apiClient", () => {
	const actual = jest.requireActual("@/lib/apiClient");
	return {
		...actual,
		ApiClient: {
			get: (...args: any[]) => mockGet(...args),
			post: (...args: any[]) => mockPost(...args),
			patch: (...args: any[]) => mockPatch(...args),
			delete: (...args: any[]) => mockDelete(...args),
		},
	};
});

const mockAddToast = jest.fn();
jest.mock("@heroui/toast", () => ({ addToast: (...args: any[]) => mockAddToast(...args) }));

const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };
jest.mock("@/lib/logger", () => ({ logger: mockLogger }));

import { queryKeys } from "@/lib/apiClient";
import {
	useUserMilestones,
	useMilestone,
	useCreateMilestone,
	useDeleteMilestone,
} from "../hooks/queries/useRoadmapQueries";

afterEach(() => {
	jest.clearAllMocks();
});

describe("Roadmap queries", () => {
	it("useUserMilestones returns milestones from API", async () => {
		mockGet.mockResolvedValue({ data: { milestones: [{ id: "m1", title: "M1", tasks: [] }], count: 1 } });

		const qc = new QueryClient();

		function Harness() {
			const { data } = useUserMilestones();

			return <div data-testid="out">{JSON.stringify(data || [])}</div>;
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

		expect(mockGet).toHaveBeenCalledWith("/roadmap/milestones");
		expect(container.querySelector("[data-testid=out]")!.textContent).toContain("M1");

		document.body.removeChild(container);
	});

	it("useMilestone returns single milestone when enabled", async () => {
		mockGet.mockResolvedValue({ data: { milestone: { id: "m1", title: "Solo", tasks: [] } } });

		const qc = new QueryClient();

		function Harness() {
			const { data } = useMilestone("m1");

			return <div data-testid="one">{data ? data.title : ""}</div>;
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

		expect(mockGet).toHaveBeenCalledWith("/roadmap/milestones/m1");
		expect(container.querySelector("[data-testid=one]")!.textContent).toBe("Solo");

		document.body.removeChild(container);
	});

	it("useCreateMilestone posts payload and shows toast on success", async () => {
		const newMilestone = { id: "m-new", title: "New Milestone", tasks: [] };
		mockPost.mockResolvedValue({ data: { milestone: newMilestone } });

		const qc = new QueryClient();

		function Harness() {
			const create = useCreateMilestone();

			return (
				<div>
					<button id="go" onClick={() => create.mutateAsync({ title: "New Milestone" } as any)}>go</button>
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

		expect(mockPost).toHaveBeenCalledWith("/roadmap/milestones", { title: "New Milestone" });
		expect(mockAddToast).toHaveBeenCalled();

		document.body.removeChild(container);
	});

	it("useDeleteMilestone optimistically removes milestone from cache", async () => {
		const milestones = [
			{ id: "m1", title: "A", tasks: [] },
			{ id: "m2", title: "B", tasks: [] },
		];

		const qc = new QueryClient();
		// prime cache
		qc.setQueryData(queryKeys.roadmap.milestones(), milestones);

		mockDelete.mockResolvedValue({ success: true });

		function Harness() {
			const del = useDeleteMilestone();

			return (
				<div>
					<button id="del" onClick={() => del.mutateAsync("m1")}>del</button>
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

		const btn = container.querySelector("#del") as HTMLButtonElement;

		await act(async () => {
			btn.click();
			// wait for mutation flow
			await new Promise((r) => setTimeout(r, 0));
		});

		const after = qc.getQueryData<any[]>(queryKeys.roadmap.milestones());
		expect(after?.find((m) => m.id === "m1")).toBeUndefined();
		expect(mockDelete).toHaveBeenCalledWith("/roadmap/milestones/m1");

		document.body.removeChild(container);
	});

	it("useUserMilestones handles empty list gracefully", async () => {
		mockGet.mockResolvedValue({ data: { milestones: [], count: 0 } });

		const qc = new QueryClient();

		function Harness() {
			const { data } = useUserMilestones();
			return <div data-testid="out-empty">{JSON.stringify(data || [])}</div>;
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

		expect(mockGet).toHaveBeenCalledWith("/roadmap/milestones");
		expect(container.querySelector("[data-testid=out-empty]")!.textContent).toBe("[]");

		document.body.removeChild(container);
	});

	it("useCreateMilestone shows error toast when API fails", async () => {
		mockPost.mockRejectedValue(new Error("bad"));

		const qc = new QueryClient();

		function Harness() {
			const create = useCreateMilestone();

			return (
				<div>
					<button id="go-err" onClick={() => create.mutateAsync({ title: "X" } as any)}>go</button>
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

		const btn = container.querySelector("#go-err") as HTMLButtonElement;

		await act(async () => {
			btn.click();
			await new Promise((r) => setTimeout(r, 0));
		});

		expect(mockPost).toHaveBeenCalledWith("/roadmap/milestones", { title: "X" });
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ color: "danger" }));

		document.body.removeChild(container);
	});

	it("useDeleteMilestone restores cache when API delete fails", async () => {
		const milestones = [
			{ id: "m1", title: "A", tasks: [] },
			{ id: "m2", title: "B", tasks: [] },
		];

		const qc = new QueryClient();
		qc.setQueryData(queryKeys.roadmap.milestones(), milestones);

		mockDelete.mockRejectedValue(new Error("delete failed"));

		function Harness() {
			const del = useDeleteMilestone();

			return (
				<div>
					<button id="del-err" onClick={() => del.mutateAsync("m1")}>del</button>
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

		const btn = container.querySelector("#del-err") as HTMLButtonElement;

		await act(async () => {
			btn.click();
			await new Promise((r) => setTimeout(r, 0));
		});

		const after = qc.getQueryData<any[]>(queryKeys.roadmap.milestones());
		expect(after?.find((m) => m.id === "m1")).toBeDefined();
		expect(mockDelete).toHaveBeenCalledWith("/roadmap/milestones/m1");

		document.body.removeChild(container);
	});
});

