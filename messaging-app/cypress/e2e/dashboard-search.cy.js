// describe('Dashboard - User Search', () => {
//   beforeEach(() => {
//     cy.login('chau@gmail.com', 'Test123');
//     cy.location('pathname').should('eq', '/dashboard');
//   });

//   it('searches users and shows results', () => {
//     cy.get('input[placeholder="Enter username"]').type('Mike');
//     cy.contains('Search').click();
//     cy.get('.search-btn').should('have.length.at.least', 1);

//   });

//   it('navigates to chat from search result', () => {
//     cy.get('input[placeholder="Enter username"]').type('Mike');
//     cy.contains('Search').click();
//     cy.get('.search-btn').first().click();
//     cy.location('pathname').should('include', '/chat/');
//   });
// });
