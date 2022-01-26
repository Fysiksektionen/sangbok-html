module.exports = {
  preset: 'ts-jest',
  globals: {},
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    // Force-compile vue3-touch-events before running tests
    'node_modules/(?!vue3-touch-events)'
  ],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/utils/dummy.ts',
    '\\.(css|less)$': '<rootDir>/src/utils/dummy.ts',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node']
}
