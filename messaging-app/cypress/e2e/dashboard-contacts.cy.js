describe('Dashboard - Contact List', () => {
  beforeEach(() => {
    cy.login('huyen@gmail.com', 'Test123');
    cy.location('pathname').should('eq', '/dashboard');
  });

  it('shows at least one contact', () => {
    cy.get('.contact-btn').should('have.length.at.least', 1);
  });

  it('navigates to a chat when contact is clicked', () => {
    cy.get('.contact-btn').first().click();
    cy.location('pathname').should('include', '/chat/');
  });
});
