import { fileURLToPath } from "node:url";
import globals from "globals";
import eslintJs from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

const formatRules = {
  "line-comment-position": ["error", { position: "above" }]
};

const problemRules = {
  "array-callback-return": [
    "error",
    {
      allowImplicit: true,
      checkForEach: true
    }
  ],
  "constructor-super": ["error"],
  "for-direction": ["error"],
  "getter-return": ["error"],
  "no-async-promise-executor": ["error"],
  "no-class-assign": ["error"],
  "no-compare-neg-zero": ["error"],
  "no-cond-assign": ["error"],
  "no-const-assign": ["error"],
  "no-constant-binary-expression": ["error"],
  "no-constant-condition": ["error"],
  "no-constructor-return": ["error"],
  "no-control-regex": ["error"],
  "no-debugger": ["error"],
  "no-dupe-args": ["error"],
  "no-dupe-class-members": ["error"],
  "no-dupe-else-if": ["error"],
  "no-dupe-keys": ["error"],
  "no-duplicate-case": ["error"],
  "no-duplicate-imports": ["error"],
  "no-empty-character-class": ["error"],
  "no-empty-pattern": ["error"],
  "no-ex-assign": ["error"],
  "no-fallthrough": ["error"],
  "no-func-assign": ["error"],
  "no-import-assign": ["error"],
  "no-inner-declarations": ["error"],
  "no-invalid-regexp": ["error"],
  "no-irregular-whitespace": ["error"],
  "no-loss-of-precision": ["error"],
  "no-misleading-character-class": ["error"],
  "no-new-native-nonconstructor": ["error"],
  "no-obj-calls": ["error"],
  "no-promise-executor-return": ["error"],
  "no-prototype-builtins": ["error"],
  "no-self-assign": ["error"],
  "no-self-compare": ["error"],
  "no-setter-return": ["error"],
  "no-sparse-arrays": ["error"],
  "no-template-curly-in-string": ["error"],
  "no-this-before-super": ["error"],
  "no-undef": ["error"],
  "no-unexpected-multiline": ["error"],
  "no-unmodified-loop-condition": ["error"],
  "no-unreachable": ["error"],
  "no-unreachable-loop": ["error"],
  "no-unsafe-finally": ["error"],
  "no-unsafe-negation": ["error"],
  "no-unsafe-optional-chaining": ["error"],
  "no-unused-private-class-members": ["error"],
  "no-unused-vars": ["error"],
  "no-use-before-define": ["error"],
  "no-useless-backreference": ["error"],
  // "require-atomic-updates": ["error"],
  "use-isnan": ["error"],
  "valid-typeof": ["error"]
};

const suggestionRules = {
  "accessor-pairs": ["error"],
  "arrow-body-style": [
    "error",
    "as-needed",
    { requireReturnForObjectLiteral: true }
  ],
  camelcase: ["error"],
  complexity: ["error"],
  "consistent-return": ["error"],
  curly: ["error", "all"],
  "default-case-last": ["error"],
  "default-param-last": ["error"],
  "dot-notation": ["error"],
  eqeqeq: ["error", "always"],
  "grouped-accessor-pairs": ["error"],
  // "guard-for-in": ["error"],
  "logical-assignment-operators": ["error", "always"],
  "max-depth": ["error"],
  // "multiline-comment-style": ["error", "starred-block"],
  "no-array-constructor": ["error"],
  "no-bitwise": ["error"],
  "no-caller": ["error"],
  "no-case-declarations": ["error"],
  "no-delete-var": ["error"],
  "no-div-regex": ["error"],
  "no-else-return": ["error"],
  "no-eq-null": ["error"],
  "no-eval": ["error"],
  "no-extend-native": ["error"],
  "no-extra-bind": ["error"],
  "no-extra-boolean-cast": ["error"],
  "no-extra-label": ["error"],
  "no-global-assign": ["error"],
  "no-implicit-globals": ["error"],
  "no-implied-eval": ["error"],
  "no-inline-comments": ["error"],
  "no-invalid-this": ["error"],
  "no-iterator": ["error"],
  "no-label-var": ["error"],
  "no-labels": ["error"],
  "no-lone-blocks": ["error"],
  "no-lonely-if": ["error"],
  "no-loop-func": ["error"],
  // "no-mixed-operators": ["error"],
  "no-multi-assign": ["error"],
  "no-multi-str": ["error"],
  "no-new": ["error"],
  "no-new-func": ["error"],
  "no-new-object": ["error"],
  "no-new-wrappers": ["error"],
  "no-nonoctal-decimal-escape": ["error"],
  "no-octal": ["error"],
  "no-octal-escape": ["error"],
  "no-param-reassign": ["error"],
  "no-proto": ["error"],
  "no-redeclare": ["error"],
  "no-regex-spaces": ["error"],
  "no-return-assign": ["error"],
  "no-return-await": ["error"],
  "no-script-url": ["error"],
  "no-sequences": ["error"],
  "no-shadow-restricted-names": ["error"],
  "no-throw-literal": ["error"],
  "no-underscore-dangle": ["error"],
  "no-unneeded-ternary": ["error"],
  "no-unused-expressions": ["error"],
  "no-unused-labels": ["error"],
  "no-useless-call": ["error"],
  "no-useless-catch": ["error"],
  "no-useless-computed-key": ["error"],
  "no-useless-concat": ["error"],
  "no-useless-constructor": ["error"],
  "no-useless-escape": ["error"],
  "no-useless-rename": ["error"],
  "no-useless-return": ["error"],
  "no-var": ["error"],
  "no-void": ["error"],
  "no-with": ["error"],
  "object-shorthand": ["error", "always"],
  "one-var": ["error", "never"],
  "operator-assignment": ["error", "always"],
  "prefer-const": ["error"],
  "prefer-exponentiation-operator": ["error"],
  "prefer-named-capture-group": ["error"],
  "prefer-numeric-literals": ["error"],
  "prefer-object-has-own": ["error"],
  "prefer-object-spread": ["error"],
  "prefer-promise-reject-errors": ["error"],
  "prefer-regex-literals": ["error"],
  "prefer-rest-params": ["error"],
  "prefer-spread": ["error"],
  "prefer-template": ["error"],
  "require-await": ["error"],
  "require-unicode-regexp": ["error"],
  "require-yield": ["error"],
  "sort-imports": ["error", { ignoreDeclarationSort: true }],
  "sort-vars": ["error"],
  "spaced-comment": ["error", "always"],
  "vars-on-top": ["error"],
  yoda: ["error"]
};

const jsRules = {
  ...prettierConfig.rules,
  ...formatRules,
  ...problemRules,
  ...suggestionRules,
  "prettier/prettier": [
    "error",
    {
      arrowParens: "avoid",
      trailingComma: "none"
    }
  ]
};

const extensionRules = {
  "default-param-last": "off",
  "@typescript-eslint/default-param-last": "error",
  "dot-notation": "off",
  "@typescript-eslint/dot-notation": "error",
  "no-array-constructor": "off",
  "@typescript-eslint/no-array-constructor": "error",
  "no-dupe-class-members": "off",
  "@typescript-eslint/no-dupe-class-members": "error",
  "no-implied-eval": "off",
  "@typescript-eslint/no-implied-eval": "error",
  "no-invalid-this": "off",
  "@typescript-eslint/no-invalid-this": "error",
  "no-loop-func": "off",
  "@typescript-eslint/no-loop-func": "error",
  "no-loss-of-precision": "off",
  "@typescript-eslint/no-loss-of-precision": "error",
  "no-redeclare": "off",
  "@typescript-eslint/no-redeclare": "error",
  "no-throw-literal": "off",
  "@typescript-eslint/no-throw-literal": "off",
  "no-unused-expressions": "off",
  "@typescript-eslint/no-unused-expressions": "error",
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  "no-use-before-define": "off",
  "@typescript-eslint/no-use-before-define": "error",
  "no-useless-constructor": "off",
  "@typescript-eslint/no-useless-constructor": "error",
  "require-await": "off",
  // "@typescript-eslint/require-await": "error",
  "no-return-await": "off",
  "@typescript-eslint/return-await": "error"
};

const typescriptRules = {
  "no-undef": "off",
  "@typescript-eslint/adjacent-overload-signatures": "error",
  "@typescript-eslint/array-type": "error",
  "@typescript-eslint/await-thenable": "error",
  "@typescript-eslint/ban-types": "error",
  "@typescript-eslint/consistent-generic-constructors": "error",
  "@typescript-eslint/consistent-type-exports": "error",
  "@typescript-eslint/consistent-type-imports": "error",
  "@typescript-eslint/explicit-function-return-type": [
    "error",
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true
    }
  ],
  "@typescript-eslint/explicit-member-accessibility": "error",
  "@typescript-eslint/explicit-module-boundary-types": "error",
  "@typescript-eslint/naming-convention": [
    "error",
    {
      format: ["camelCase"],
      leadingUnderscore: "allow",
      selector: "default"
    },
    {
      selector: "import",
      format: ["camelCase", "PascalCase"]
    },
    {
      format: ["camelCase", "UPPER_CASE", "PascalCase"],
      leadingUnderscore: "allow",
      selector: "variable"
    },
    {
      format: ["PascalCase"],
      selector: "typeLike"
    },
    {
      format: null,
      modifiers: ["destructured"],
      selector: "variable"
    },
    {
      format: null,
      selector: "objectLiteralProperty"
    }
  ],
  camelcase: "off",
  "@typescript-eslint/no-base-to-string": "error",
  "@typescript-eslint/no-confusing-non-null-assertion": "error",
  "@typescript-eslint/no-confusing-void-expression": "error",
  "@typescript-eslint/no-duplicate-enum-values": "error",
  "@typescript-eslint/no-duplicate-type-constituents": "error",
  "@typescript-eslint/no-dynamic-delete": "error",
  "@typescript-eslint/no-extra-non-null-assertion": "error",
  "@typescript-eslint/no-extraneous-class": "error",
  // "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-for-in-array": "error",
  "@typescript-eslint/no-import-type-side-effects": "error",
  "@typescript-eslint/no-inferrable-types": "error",
  "@typescript-eslint/no-invalid-void-type": "error",
  "@typescript-eslint/no-meaningless-void-operator": "error",
  "@typescript-eslint/no-misused-new": "error",
  "@typescript-eslint/no-misused-promises": "error",
  "@typescript-eslint/no-mixed-enums": "error",
  "@typescript-eslint/no-namespace": "error",
  "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
  "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
  "@typescript-eslint/no-non-null-assertion": "error",
  "@typescript-eslint/no-redundant-type-constituents": "error",
  "@typescript-eslint/no-require-imports": "error",
  "@typescript-eslint/no-this-alias": "error",
  "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
  "@typescript-eslint/no-unnecessary-qualifier": "error",
  "@typescript-eslint/no-unnecessary-type-arguments": "error",
  "@typescript-eslint/no-unnecessary-type-assertion": "error",
  "@typescript-eslint/no-unnecessary-type-constraint": "error",
  // "@typescript-eslint/no-unsafe-argument": "error",
  // "@typescript-eslint/no-unsafe-assignment": "error",
  // "@typescript-eslint/no-unsafe-call": "error",
  // "@typescript-eslint/no-unsafe-declaration-merging": "error",
  // "@typescript-eslint/no-unsafe-enum-comparison": "error",
  // "@typescript-eslint/no-unsafe-member-access": "error",
  // "@typescript-eslint/no-unsafe-return": "error",
  "@typescript-eslint/no-useless-empty-export": "error",
  "@typescript-eslint/no-var-requires": "error",
  "@typescript-eslint/non-nullable-type-assertion-style": "error",
  "@typescript-eslint/parameter-properties": "error",
  "@typescript-eslint/prefer-as-const": "error",
  "@typescript-eslint/prefer-enum-initializers": "error",
  "@typescript-eslint/prefer-for-of": "error",
  "@typescript-eslint/prefer-includes": "error",
  "@typescript-eslint/prefer-literal-enum-member": "error",
  "@typescript-eslint/prefer-namespace-keyword": "error",
  "@typescript-eslint/prefer-nullish-coalescing": "error",
  "@typescript-eslint/prefer-optional-chain": "error",
  "@typescript-eslint/prefer-readonly": "error",
  "@typescript-eslint/prefer-reduce-type-parameter": "error",
  "@typescript-eslint/prefer-regexp-exec": "error",
  "@typescript-eslint/prefer-return-this-type": "error",
  "@typescript-eslint/prefer-string-starts-ends-with": "error",
  // "@typescript-eslint/promise-function-async": "error",
  "@typescript-eslint/restrict-plus-operands": "error",
  "@typescript-eslint/sort-type-constituents": "error",
  "@typescript-eslint/switch-exhaustiveness-check": "error",
  "@typescript-eslint/unbound-method": "error",
  ...extensionRules,
  "no-duplicate-imports": ["off"]
};

export default [
  { ignores: ["dist", "node_modules"] },
  eslintJs.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    plugins: { prettier: prettierPlugin },
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: jsRules
  },
  {
    files: ["**/*.tsx", "**/*.ts"],
    plugins: {
      prettier: prettierPlugin,
      "@typescript-eslint": typescriptPlugin
    },
    settings: { react: { version: "detect" } },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir
      },
      globals: {
        ...globals.node
      }
    },
    rules: {
      ...jsRules,
      ...typescriptRules
    }
  }
];
