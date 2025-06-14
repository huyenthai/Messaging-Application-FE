describe('Chat Page - Chat History (Real)', () => {
  const receiverId = '6002';

  beforeEach(() => {
    cy.login('huyen@gmail.com', 'Test123');
    cy.visit(`/chat/${receiverId}`, {
      state: { fromSearch: true }
    });
  });

  it('loads and shows history', () => {
    cy.get('#chat-messages').should('exist');
    cy.get('.chat-bubble').should('have.length.at.least', 1);
  });
});
