describe('Signup and Delete Account Flow', () => {
  const randomId = Math.floor(Math.random() * 100000);
  const email = `testuser${randomId}@e2e.com`;
  const username = `e2euser${randomId}`;
  const password = 'Test123';

  it('creates and deletes an account', () => {
    // Visit signup page
    cy.visit('/signup');

    // 2. Fill out and submit form
    cy.get('input[placeholder="Username"]').type(username);
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Confirm redirected to login
    cy.location('pathname').should('eq', '/');
    cy.contains('Login');

    // Log in with new credentials
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Arrive at dashboard
    cy.location('pathname').should('eq', '/dashboard');
    cy.contains('Your Contacts');

    // Navigate to profile
    cy.get('.profile-btn').click();
    cy.location('pathname').should('eq', '/profile');
    cy.contains('Your Profile');

    //Delete account (bypass confirm dialog)
    cy.window().then(win => {
      cy.stub(win, 'confirm').returns(true);
    });
    cy.get('.delete-btn').click();

    //Confirm redirected to login
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    cy.contains('Login');
  });
});
