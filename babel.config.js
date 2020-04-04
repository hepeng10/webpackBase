module.exports = (api) => {
    api.cache(true);

    const presets = [
        ['@babel/preset-env', {
            targets: [
                'last 2 version',
                'ie >= 9'
            ],
        }],
        '@babel/preset-react'
    ];

    const plugins = [
        'react-hot-loader/babel',
        // '@babel/plugin-syntax-dynamic-import',
        [  // antd 按需引入
            'import',
            { libraryName: 'antd', 'libraryDirectory': 'es', style: 'css' }
        ],

        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        [
            '@babel/plugin-proposal-decorators',
            {
                // decoratorsBeforeExport: true,
                legacy: true,
            }
        ],
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: true
            }
        ],
    ];

    return {
        presets,
        plugins
    };
};