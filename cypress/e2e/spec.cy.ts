import type { RegisterUserCommand } from '@/application/usecases/register-user.usecase'

const alice: RegisterUserCommand = {
  email: 'alice@martin.com',
  firstName: 'Alice',
  lastName: 'Martin',
  password: 'm0tDep@sse'
}

describe('Feature: Register user', () => {
  beforeEach(async () => {
    cy.visit('http://localhost:8000/')
  })

  it('Alice can successfully register as a user', () => {
    cy.get('.react-app-login-form-registration-button').click()
    cy.url().should('equal', 'http://localhost:8000/registration')

    cy.get('.react-app-registration-page-form')
      .children('input')
      .each<HTMLInputElement>(input => {
        cy.wrap(input)
          .invoke('attr', 'id')
          .then(id => {
            switch (id) {
              case 'email':
                cy.wrap(input).type(alice.email)
                break
              case 'firstName':
                cy.wrap(input).type(alice.firstName)
                break
              case 'lastName':
                cy.wrap(input).type(alice.lastName)
                break
              case 'password':
                cy.wrap(input).type(alice.password)
                break
              default:
            }
          })
      })

    cy.get('.react-app-registration-page-form-submit-button').click()
    cy.get('.react-app-registration-page-form-status').should('have.text', 'User registered')
  })
})

describe('Feature: Login user', () => {
  beforeEach(async () => {
    cy.visit('http://localhost:8000/')
  })

  it('Alice can successfully login', () => {
    cy.get('.react-app-login-page-form')
      .children('input')
      .each<HTMLInputElement>(input => {
        cy.wrap(input)
          .invoke('attr', 'id')
          .then(id => {
            switch (id) {
              case 'email':
                cy.wrap(input).type(alice.email)
                break
              case 'password':
                cy.wrap(input).type(alice.password)
                break
              default:
            }
          })
      })

    cy.get('.react-app-login-page-form').children('button[type="submit"]').click()

    cy.get('.react-app-home-page-logout-welcome')
      .children('p')
      .first()
      .should('have.text', `Welcome ${alice.firstName}, ${alice.lastName}`)
  })
})
