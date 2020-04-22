describe('integration', () => {
  it('check for loading root component', () => {
    cy.visit('/')
    cy.get('.meta-tarantool-app')
  })
})
