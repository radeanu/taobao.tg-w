/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-recommended',
        'plugin:vue/vue3-strongly-recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier/skip-formatting',
        'prettier'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        'no-debugger': 'off',
        'no-console':
            process.env.NODE_ENV !== 'development'
                ? ['warn', { allow: ['error'] }]
                : 'off',
        'vue/max-attributes-per-line': [
            'warn',
            {
                singleline: 20,
                multiline: 1
            }
        ],
        'vue/camelcase': [
            'error',
            {
                ignoreDestructuring: true,
                properties: 'never'
            }
        ],
        camelcase: [
            'error',
            {
                ignoreDestructuring: true,
                properties: 'never'
            }
        ]
    }
};
