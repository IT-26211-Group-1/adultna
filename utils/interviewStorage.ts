import { logger } from "@/lib/logger";

const PREFIX = "interview_answers_";

export const interviewStorage = {
  save(sessionId: string, answers: Map<string, string>) {
    try {
      localStorage.setItem(
        `${PREFIX}${sessionId}`,
        JSON.stringify(Array.from(answers.entries())),
      );
    } catch (e) {
      logger.error("Failed to save answers:", e);
    }
  },

  load(sessionId: string): Map<string, string> {
    try {
      const saved = localStorage.getItem(`${PREFIX}${sessionId}`);

      return saved ? new Map(JSON.parse(saved)) : new Map();
    } catch (e) {
      logger.error("Failed to load answers:", e);

      return new Map();
    }
  },

  clear(sessionId: string) {
    try {
      localStorage.removeItem(`${PREFIX}${sessionId}`);
    } catch (e) {
      logger.error("Failed to clear answers:", e);
    }
  },
};
