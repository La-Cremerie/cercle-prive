/**
 * Logger minimal sans dépendance.
 */

const COLORS = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
};

let verbose = false;

export function setVerbose(v: boolean): void {
  verbose = v;
}

function ts(): string {
  return new Date().toISOString().slice(11, 19);
}

export const logger = {
  info: (msg: string): void => {
    process.stdout.write(`${COLORS.gray}[${ts()}]${COLORS.reset} ${msg}\n`);
  },
  success: (msg: string): void => {
    process.stdout.write(`${COLORS.green}[${ts()}] ✓ ${msg}${COLORS.reset}\n`);
  },
  warn: (msg: string): void => {
    process.stdout.write(`${COLORS.yellow}[${ts()}] ⚠ ${msg}${COLORS.reset}\n`);
  },
  error: (msg: string, err?: unknown): void => {
    const detail = err instanceof Error ? ` :: ${err.message}` : err ? ` :: ${String(err)}` : "";
    process.stderr.write(`${COLORS.red}[${ts()}] ✗ ${msg}${detail}${COLORS.reset}\n`);
  },
  debug: (msg: string): void => {
    if (verbose) process.stdout.write(`${COLORS.cyan}[${ts()}] · ${msg}${COLORS.reset}\n`);
  },
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
