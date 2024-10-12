/** @type {import('jest').Config} */
export default {
  // Disable applying prettier to inline snapshots because Jest does not support Prettier 3 even a year later
  prettierPath: undefined,
  transform: {
    // Transform TS with SWC - it's the fastesta vailable option for Jest
    "\\.[tj]sx?$": "@swc/jest",
  },
  // On most modern systems and for local development, 50% core utilization this gives the best Jest performance
  maxWorkers: process.env.JEST_MAX_WORKERS ?? (process.env.CI ? 1 : "50%"),
  modulePathIgnorePatterns: [
    // Ignore our build output folder
    "<rootDir>/dist",
  ],
};
