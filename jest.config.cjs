module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Only match files with `.test.` in the filename to avoid picking up Playwright `.spec.` files
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.cjs' }]
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/tests/e2e/',
    '/tests/playwright/',
    '/playwright/',
    '/playwright-report/',
    '/playwright-results/',
    '/e2e/',
    '/playwright.config.ts'
  ],
  moduleFileExtensions: ['ts','tsx','js','jsx','json','node']
}
