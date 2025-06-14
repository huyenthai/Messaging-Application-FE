describe('Chat Page - Blocked When User Is Deleted (Real)', () => {
  beforeEach(() => {
    cy.login('huyen@gmail.com', 'Test123');
    cy.visit('/chat/3', { state: { fromSearch: true } });
  });

  it('disables chat input for deleted user', () => {
    cy.get('textarea[placeholder="Type a message"]').should('be.disabled');
    cy.contains('deleted their account').should('exist');
  });
});
