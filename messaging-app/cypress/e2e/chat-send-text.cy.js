describe('Chat Page - Send Text Message', () => {
  const receiverId = '6002'; 

  beforeEach(() => {
    cy.login('huyen@gmail.com', 'Test123');
    cy.visit(`/chat/${receiverId}`, {
      state: { fromSearch: true }
    });
    cy.contains(`Chat with`).should('exist');
  });

  it('sends a text message', () => {
    const message = 'Real message from Cypress';

    cy.get('textarea[placeholder="Type a message"]').type(message);
    cy.get('button.send-btn').click();

    cy.contains(message).should('exist'); 
  });
});
