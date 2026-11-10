import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".agents/**",
    "prisma/seed.js",
    // Superseded by .mjs equivalents — kept for reference only.
    "scripts/create-admin.js",
    "scripts/reset-admin.js",
    "scripts/reset-admin-password.js",
    "scripts/create-admin.cjs",
    "scripts/reset-admin.cjs",
    "scripts/reset-admin-password.cjs",
  ]),
]);

export default eslintConfig;
