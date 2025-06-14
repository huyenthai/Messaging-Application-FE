describe('Chat Page - Access Control', () => {
  const receiverId = '2';

  it('redirects if access is not allowed', () => {
    cy.login('huyen@gmail.com', 'Test123');
    
    cy.intercept('GET', '/api/chat/contacts', {
      statusCode: 200,
      body: [], // user is not in contacts
    });

    cy.visit(`/chat/${receiverId}`);
    cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
  });
});
