// cypress/support/commands.js

Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', 'http://localhost:5000/api/auth/login', {
    email,
    password,
  }).then((res) => {
    const token = res.body.token;
    window.sessionStorage.setItem('token', token);
  });
});
