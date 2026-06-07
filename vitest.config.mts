import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*.{js,ts}'],
      thresholds: {
        100: true,
      },
    },
    globals: true,
  },
});
