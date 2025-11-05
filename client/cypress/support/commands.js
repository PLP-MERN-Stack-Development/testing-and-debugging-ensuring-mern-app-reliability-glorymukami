// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.contains('Login').click()
})

Cypress.Commands.add('register', (userData) => {
  cy.visit('/register')
  cy.get('input[name="username"]').type(userData.username)
  cy.get('input[name="email"]').type(userData.email)
  cy.get('input[name="password"]').type(userData.password)
  cy.get('input[name="confirmPassword"]').type(userData.password)
  cy.contains('Register').click()
})

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
