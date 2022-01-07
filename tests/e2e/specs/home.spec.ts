// https://docs.cypress.io/api/introduction/api.html

describe("Home", () => {
  it("Visits the home screen", () => {
    cy.visit("/")
    cy.contains("h3", "Decks:")
    cy.get('button')
      .should('have.length', 2)
      .should('contain', 'Things to do')
      .should('contain', 'Breakfast')
  })
});
