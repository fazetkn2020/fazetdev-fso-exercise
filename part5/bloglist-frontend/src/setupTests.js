import '@testing-library/jest-dom'

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to debug
  // log: console.log,
  // warn: console.warn,
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}
