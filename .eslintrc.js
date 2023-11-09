module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:node/recommended-script',
		'prettier',
		'plugin:editorconfig/noconflict',
		'plugin:jsdoc/recommended',
		'plugin:json/recommended',
		'plugin:mocha/recommended',
		'plugin:security/recommended',
		'plugin:unicorn/recommended'
	],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	plugins: ['node', 'prettier', 'editorconfig', 'jsdoc', 'json', 'mocha', 'security', 'unicorn'],
	rules: {
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'node/no-callback-literal': 'error',
		'no-await-in-loop': 'error',
		'node/exports-style': 'error',
		'no-console': 'error',
		'no-var': 'error',
		'func-style': ['error', 'expression'],
		'prettier/prettier': [
			'error',
			{
				semi: true,
				singleQuote: true,
				tabWidth: 4,
				useTabs: true,
				bracketSpacing: false,
				trailingComma: 'none',
				bracketSameLine: true
			}
		],
		'node/no-unpublished-require': 'off',
		'jsdoc/check-param-names': 'warn',
		'jsdoc/check-tag-names': 'off',
		'jsdoc/check-types': 'warn',
		'jsdoc/newline-after-description': 'off',
		'jsdoc/require-description-complete-sentence': 'off',
		'jsdoc/require-example': 'off',
		'jsdoc/require-hyphen-before-param-description': 'warn',
		'jsdoc/require-param': 'warn',
		'jsdoc/require-param-description': 'off',
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-returns-description': 'off',
		'jsdoc/require-returns-type': 'warn',
		'jsdoc/tag-lines': 'off',
		'unicorn/prefer-module': 'off',
		'unicorn/expiring-todo-comments': 'off',
		'unicorn/filename-case': [
			'error',
			{
				cases: {
					camelCase: true,
					pascalCase: true
				}
			}
		],
		'mocha/no-exports': 'off'
	}
};
