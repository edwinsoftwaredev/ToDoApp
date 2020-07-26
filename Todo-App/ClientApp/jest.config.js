// at the moment for running tests use the command: npx jest
// we need angular-builder/jest to use: ng test
module.exports = {
  preset: 'ts-jest',
  // testEnvironment: 'jsdom',
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup'],
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsConfig: './tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer'
      ], //this option might change with puppeteer
    }
  },
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest',
    "^.+\\.js$": "babel-jest"
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'node', 'tsx', 'jsx'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^environments/(.*)$': '<rootDir>/src/environments/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

/**
 * Much of the configurations here is already in the jest-preset-angular package
 */
