it('Successfully loads the home page', () => {
  cy.visit('http://localhost:8080')
  cy.get('img').should('have.attr', 'src', '/assets/Game/eda-quest-logo.png')

  cy.get('#phaser')
    .find('canvas')
})

it('Size of canvas', () => {
  cy.get('#phaser')
    .find('canvas')
    .should('have.attr', 'height', '800')
})

it('Loads game on click of canvas', () => {
  cy.get('#phaser')
    .find('canvas')
    .click()
})