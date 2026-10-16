// Ghép các rule này vào eslint.config.js hiện có (flat config).
// Cấm import chéo portal và cấm shared import từ portals/app.
const ban = (patterns, message) => ({
  "no-restricted-imports": ["error", { patterns: patterns.map((group) => ({ group, message })) }],
});

export default [
  {
    files: ["src/portals/client/**/*.{ts,tsx}"],
    rules: ban(["@/portals/mentor/*", "@/portals/admin/*"], "Không import chéo portal."),
  },
  {
    files: ["src/portals/mentor/**/*.{ts,tsx}"],
    rules: ban(["@/portals/client/*", "@/portals/admin/*"], "Không import chéo portal."),
  },
  {
    files: ["src/portals/admin/**/*.{ts,tsx}"],
    rules: ban(["@/portals/client/*", "@/portals/mentor/*"], "Không import chéo portal."),
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: ban(["@/portals/*", "@/app/*"], "shared không được import từ portals hoặc app."),
  },
];
