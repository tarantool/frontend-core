describe('integration', () => {
  it('check for loading root component', () => {
    cy.visit('/')
    cy.get('.meta-tarantool-app')
  })

  it('check global window properties', () => {
    cy.visit('/')
    cy.window().then((win) => {
      expect(win.__tarantool_admin_prefix).to.equal('/tarantool')

      expect(win.__tarantool_variables.var1).to.equal('value1')
      expect(win.__tarantool_variables.var2).to.equal(42)
      expect(win.__tarantool_variables.var3).to.deep.equal([1, 2, 3, 'a', 'b', 'c'])
      expect(win.__tarantool_variables.var4).to.deep.equal({'a': 'a', 'b': 'b', 'c': 'c'})
      expect(win.__tarantool_variables.var5).to.equal(' !@#$%^&*(\\\/)"\'.,><? ')
    })
  })
})
