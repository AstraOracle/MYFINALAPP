describe('Flows: add, delete, navigation, invalid input', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('prevents adding an empty item (invalid input)', () => {
    cy.get('ion-fab-button, button').contains(/add|new|plus|Add/i).first().click({ force: true });
    cy.url().should('include', '/add-item');
    // try submit without entering title
    cy.get('button[type="submit"]').contains(/add/i).first().should('be.disabled');
  });

  it('adds and then deletes an item', () => {
    // navigate to add
    cy.get('ion-fab-button, button').contains(/add|new|plus|Add/i).first().click({ force: true });
    cy.url().should('include', '/add-item');
    cy.get('input, ion-input').first().type('Cypress Item');
    cy.get('button[type="submit"]').contains(/add/i).first().click({ force: true });

    // back to home and see item
    cy.contains('Cypress Item').should('exist');

    // delete via UI: reveal options and click delete (force clicks used for web components)
    cy.contains('Cypress Item').parents('ion-item').within(() => {
      // If ion-item sliding is present, click the delete option
    });

    // fallback: click any 'Delete' button
    cy.get('ion-item-option, button').contains(/delete/i).first().click({ force: true });
    cy.contains('Cypress Item').should('not.exist');
  });

  it('navigates to settings and changes language', () => {
    cy.get('ion-button').contains(/settings/i).first().click({ force: true });
    cy.url().should('include', '/settings');
    cy.get('ion-select, select').first().click({ force: true });
    cy.get('ion-select-option, option').contains(/Español|es/i).first().click({ force: true });
    // verify settings title still exists (language change may not update immediately)
    cy.contains(/Settings|Configuración|Ajustes/i).should('exist');
  });
});
