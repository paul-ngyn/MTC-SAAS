// Global ambient types for Jest custom matchers (e.g. toBeInTheDocument).
// jest.setup.js imports "@testing-library/jest-dom" for the runtime matchers,
// but that's a .js file the TS program doesn't include — this .d.ts is what
// makes `tsc --noEmit` aware of the matcher types across all test files.
/// <reference types="@testing-library/jest-dom" />
