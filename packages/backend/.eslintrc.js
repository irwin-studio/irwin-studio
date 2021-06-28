module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    extends: ['plugin:prettier/recommended'],
    rules: {
        'react/prop-types': 0,
        '@typescript-eslint/no-unused-vars': [
            'error',
            {vars: 'all', args: 'after-used', ignoreRestSiblings: false},
        ],
        'no-unused-vars': 'off',
    },
    overrides: [
        {
            files: ['bin/*.js', 'lib/*.js'],
            extends: [
                'plugin:@typescript-eslint/recommended',
                'prettier/@typescript-eslint',
                'plugin:prettier/recommended',
            ],
        },
    ],
};
