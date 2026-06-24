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
  ]),
  // House style migrated from the legacy .eslintrc.json. The plugins these rules
  // reference (import, @typescript-eslint, react, react-hooks, jsx-a11y) are all
  // registered by the eslint-config-next flat configs spread above.
  //
  // Intentionally NOT migrated:
  //   - prettier/prettier — eslint-plugin-prettier/eslint-config-prettier are not
  //     installed, and prettier's defaults (2-space) conflict with this 4-space
  //     codebase. Run prettier separately with a matching .prettierrc if wanted.
  //   - jest/* — no jest setup or tests exist.
  //   - strict-null-checks/* — redundant with `strictNullChecks` in tsconfig.json.
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    settings: {
      // Treat path-aliased imports (@modules, @components, ...) as "internal" so
      // import/order groups them after third-party packages, as the old alias
      // resolver did.
      "import/internal-regex":
        "^@(modules|common|components|auth|user|catalog|core|utils|config|static|localisation|constants|app)(/|$)",
    },
    rules: {
      // Use the TypeScript-aware unused-vars rule (the core one misfires on types).
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { args: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],

      "react/react-in-jsx-scope": "off",
      "react/jsx-curly-newline": "off",
      "react/jsx-props-no-spreading": "off",
      "react/destructuring-assignment": "off",
      "react/jsx-filename-extension": [
        "warn",
        { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      ],

      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",

      "import/no-cycle": "off",
      "import/prefer-default-export": "off",
      "import/no-unresolved": "off",
      "import/no-anonymous-default-export": "off",
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
          groups: ["builtin", "external", "internal", "sibling", "index", "parent"],
        },
      ],

      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: { regex: "^I[A-Z]", match: true },
        },
      ],

      // Forbid relative parent imports (`../`) so cross-directory imports use the
      // tsconfig path aliases (@modules, @core, @constants, ...) instead. Matches on the
      // import string, so same-directory (`./`) imports — barrels and co-located files —
      // and the aliases themselves are left alone.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^\\.\\.",
              message:
                "Relative parent imports ('../') are not allowed — use a path alias (@modules, @core, @constants, ...) instead.",
            },
          ],
        },
      ],

      "object-curly-spacing": ["error", "always"],
      "consistent-return": "off",
      "no-param-reassign": ["error", { props: false }],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0, maxBOF: 0 }],
      "no-duplicate-imports": "error",
      "eol-last": ["error", "always"],
      "curly": ["warn", "all"],
      "max-len": ["warn", { code: 120, ignoreComments: true }],
      "no-return-await": "warn",
      "no-unneeded-ternary": "warn",
      "no-useless-computed-key": "warn",
      "prefer-destructuring": "warn",
      "padding-line-between-statements": [
        "warn",
        {
          blankLine: "always",
          prev: "*",
          next: ["block", "block-like", "multiline-block-like", "multiline-const", "multiline-expression"],
        },
        {
          blankLine: "always",
          prev: ["block", "block-like", "multiline-block-like", "multiline-const", "multiline-expression"],
          next: "*",
        },
      ],

      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
