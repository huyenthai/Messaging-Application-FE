describe('Chat Page - Send Image (Real)', () => {
  const receiverId = '6002';

  beforeEach(() => {
    cy.login('mike@gmail.com', 'Test123');
    cy.visit(`/chat/${receiverId}`, {
      state: { fromSearch: true }
    });
  });

    it('uploads and sends an image', () => {
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.jpg', { force: true });
    cy.get('button.send-btn').click();

    cy.get('img.chat-img', { timeout: 10000 }).should('be.visible');
    });

});
