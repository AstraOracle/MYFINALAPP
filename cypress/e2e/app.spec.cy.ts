describe('MyFinalApp basic flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows home and can navigate to add-item and back', () => {
    cy.contains('MyFinalApp').should('exist');
    // assuming a FAB or button opens add-item - adapt selector if different
    cy.get('ion-fab-button, button').contains(/add|new|plus|Add/i).first().click({ force: true });
    cy.url().should('include', '/add-item');
    cy.get('input, ion-input').first().type('E2E item');
    cy.get('button').contains(/submit|add|save/i).first().click({ force: true });
    cy.url().should('match', /\/home|\//);
    cy.contains('E2E item').should('exist');
  });

  it('can navigate to settings and change language', () => {
    cy.get('a, button').contains(/settings|Settings/i).first().click({ force: true });
    cy.url().should('include', '/settings');
    cy.get('ion-select, select').first().click({ force: true });
    cy.get('ion-select-option, option').contains(/Español|es/i).first().click({ force: true });
    // verify selection visually or by presence of a known translated string
    cy.contains(/Settings|Configuración|Ajustes/i).should('exist');
  });
});
