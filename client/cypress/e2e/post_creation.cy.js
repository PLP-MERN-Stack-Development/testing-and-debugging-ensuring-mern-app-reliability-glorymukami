describe('Post Creation Flow', () => {
  beforeEach(() => {
    // Login first
    cy.visit('/login')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.contains('Login').click()
  })

  it('should allow authenticated user to create a post', () => {
    cy.contains('Create Post').click()
    cy.url().should('include', '/create-post')
    
    cy.get('input[name="title"]').type('Test Post Title')
    cy.get('textarea[name="content"]').type('This is a test post content for E2E testing.')
    cy.get('input[name="tags"]').type('testing, e2e, cypress')
    
    cy.contains('Create Post').click()
    
    // Should redirect to posts page
    cy.url().should('include', '/posts')
    cy.contains('Test Post Title').should('be.visible')
  })

  it('should require authentication to create post', () => {
    // Logout first
    cy.contains('Logout').click()
    
    cy.visit('/create-post')
    
    // Should show authentication required message
    cy.contains('Authentication Required').should('be.visible')
    cy.contains('Please log in to create a post').should('be.visible')
  })
})
