import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginImport from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import security from "eslint-plugin-security";
import noSecrets from "eslint-plugin-no-secrets";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["vite.config.ts", "dist/", "node_modules/"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.app.json", // ✅ tsconfig.app.json 사용
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      import: pluginImport,
      security,
      noSecrets,
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          // 소스 코드가 `@types/unist`와 같이 포함되어 있지 않더라도 항상 `<root>@types` 디렉토리 아래의 유형을 확인하려고 시도합니다.
          alwaysTryTypes: true,
          // <root>/path/to/folder/tsconfig.json을 사용합니다.
          project: "./tsconfig.app.json",
        }),
      ],
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.app.json", // ✅ TypeScript 경로 명확히 설정
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          moduleDirectory: ["node_modules", "src/"],
        },
      },
    },
    rules: {
      ...security.configs.recommended.rules,
      ...prettierConfig.rules, // ✅ Prettier 설정 적용
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        { ts: "never", tsx: "never" },
      ],
      "import/no-unresolved": "error",
      "import/no-default-export": "off",
      "arrow-body-style": ["error", "as-needed"],
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": "error",
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "all",
          caughtErrors: "all",
          argsIgnorePattern: "^_",
        },
      ],
      "security/detect-object-injection": "warn", // 객체 프로퍼티 인젝션 감지
      "security/detect-unsafe-regex": "warn", // 위험한 정규식 감지
      "security/detect-eval-with-expression": "warn", // eval() 내부 표현식 감지
      "security/detect-child-process": "warn", // child_process 모듈 감지
      "security/detect-non-literal-fs-filename": "warn", // 파일 시스템 접근 감지
      "noSecrets/no-secrets": [
        "error",
        {
          additionalRegexes: {
            "Basic Auth": "Authorization: Basic [A-Za-z0-9+/=]*",
          },
        },
      ],
    },
  },
];
