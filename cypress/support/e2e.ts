// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Prevent TypeScript errors on custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command types here if needed
    }
  }
}
