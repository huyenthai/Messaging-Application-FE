describe('Dashboard - Profile Navigation', () => {
  beforeEach(() => {
    cy.login('huyen@gmail.com', 'Test123');
    cy.location('pathname').should('eq', '/dashboard');
  });

  it('navigates to profile page', () => {
    cy.get('.profile-btn').click();
    cy.location('pathname').should('eq', '/profile');
  });
});
