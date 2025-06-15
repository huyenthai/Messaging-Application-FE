Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');

  cy.get('input[placeholder="Email"]', { timeout: 10000 }).should('be.visible').type(email);
  cy.get('input[placeholder="Password"]').should('be.visible').type(password);
  cy.get('button[type="submit"]').should('not.be.disabled').click();

  cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
});
Cypress.on('uncaught:exception', (err) => {
  console.error('Uncaught exception:', err);
  return false; 
});
