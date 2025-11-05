describe('User Registration Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should allow user to register and navigate to home', () => {
    cy.contains('Register').click()
    cy.url().should('include', '/register')
    
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('password123')
    
    cy.contains('Register').click()
    
    // Should redirect to home page and show welcome message
    cy.url().should('eq', 'http://localhost:3000/')
    cy.contains('Welcome back, testuser!').should('be.visible')
  })

  it('should show error for password mismatch', () => {
    cy.contains('Register').click()
    
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('differentpassword')
    
    cy.contains('Register').click()
    
    cy.contains('Passwords do not match').should('be.visible')
  })

  it('should register using custom command', () => {
    cy.register({
      username: 'cypressuser',
      email: 'cypress@example.com',
      password: 'password123'
    })
    
    cy.url().should('eq', 'http://localhost:3000/')
    cy.contains('Welcome back, cypressuser!').should('be.visible')
  })
})
