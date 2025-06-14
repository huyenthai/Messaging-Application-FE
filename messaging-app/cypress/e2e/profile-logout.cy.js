describe('Profile Page - Logout Flow', () => {
  beforeEach(() => {
    // Log in before each test
    cy.login('huyen@gmail.com', 'Test123');
    cy.location('pathname').should('eq', '/dashboard');

    // Navigate to Profile page
    cy.get('.profile-btn').click();
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
