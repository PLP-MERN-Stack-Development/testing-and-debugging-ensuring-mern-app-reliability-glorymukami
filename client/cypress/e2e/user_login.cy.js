describe('User Login Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should allow user to login', () => {
    cy.contains('Login').click()
    cy.url().should('include', '/login')
    
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    
    cy.contains('Login').click()
    
    // Should show authenticated state
    cy.contains('Hello,').should('be.visible')
    cy.contains('Create Post').should('be.visible')
  })

  it('should show error for invalid credentials', () => {
    cy.contains('Login').click()
    
    cy.get('input[name="email"]').type('wrong@example.com')
    cy.get('input[name="password"]').type('wrongpassword')
    
    cy.contains('Login').click()
    
    cy.contains('Login failed').should('be.visible')
  })

  it('should login using custom command', () => {
    cy.login('test@example.com', 'password123')
    
    cy.contains('Hello,').should('be.visible')
    cy.contains('Create Post').should('be.visible')
  })
})
