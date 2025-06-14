Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.get('input[placeholder="Email"]').type(email);
  cy.get('input[placeholder="Password"]').type(password);
  cy.get('button[type="submit"]').click();

  // Wait until we reach the dashboard page
  cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
});
