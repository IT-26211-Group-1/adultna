const isDevelopment = process.env.NODE_ENV !== "production";

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  group: (...args: any[]) => {
    if (isDevelopment) {
      console.group(...args);
    }
  },

  groupCollapsed: (...args: any[]) => {
    if (isDevelopment) {
      console.groupCollapsed(...args);
    }
  },

  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },

  table: (...args: any[]) => {
    if (isDevelopment) {
      console.table(...args);
    }
  },

  time: (label?: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },

  timeEnd: (label?: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },

  trace: (...args: any[]) => {
    if (isDevelopment) {
      console.trace(...args);
    }
  },
};
