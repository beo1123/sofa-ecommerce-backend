// FILE: .eslintrc.cjs
module.exports = {
    env: {
        node: true,
        es2022: true,
        jest: true
    },
    extends: ['standard', 'prettier'],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-shadow': 'error',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}
