const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      JWT_SECRET: 'test-secret-not-real',
    },
    include: ['backend/src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['backend/src/**/*.js'],
      exclude: [
        'backend/src/**/*.test.js',
        'backend/src/server.js',
        'backend/src/app.js',
        'backend/src/routes/**',
      ],
      // Arranque real ~38-40% (controllers/routes de baja prioridad todavia
      // sin tests). Umbral bajo a proposito para no bloquear el primer PR,
      // segun el propio runbook. Subir de a poco en PRs siguientes.
      thresholds: {
        lines: 30,
        functions: 30,
        branches: 30,
        statements: 30,
      },
    },
  },
});
