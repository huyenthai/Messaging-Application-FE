describe('Login flow', () => {
  it('logs in with valid credentials', () => {
    cy.login('huyen@gmail.com', 'Test123');
    cy.visit('/dashboard');
  });
});
