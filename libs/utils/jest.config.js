"use strict";
exports.__esModule = true;
/* eslint-disable */
exports["default"] = {
    displayName: 'utils',
    preset: '../../jest.preset.js',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json'
        }
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/libs/utils'
};
