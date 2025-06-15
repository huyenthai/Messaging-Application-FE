describe('Profile Page - Logout Flow', () => {
beforeEach(() => {
  cy.login('huyen@gmail.com', 'Test123');

  cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');

  cy.get('.profile-btn').should('be.visible').click();
  cy.location('pathname').should('eq', '/profile');
});


  it('logs out and redirects to login page', () => {
    cy.get('.logout-btn').click();

    // Assert redirection to login
    cy.location('pathname').should('eq', '/');

    // Optional: assert login form is visible
    cy.get('input[placeholder="Email"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
  });
});
