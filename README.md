# MyFinalApp - Todo List Application

A todo list app built with Ionic 8 and Angular 20. Features multi-language support, testing, and a clean mobile UI.

## 📝 Code Documentation

**All code includes detailed comments explaining how rubric requirements are met:**
- Modern JavaScript features (arrow functions, spread, destructuring, async/await, template literals)
- Array methods (map, filter, reduce, some) with explanations
- TypeScript features (interfaces, enums, generics with constraints)
- Mobile UI elements (FAB, toasts, gestures, forms, navigation)
- Internationalization architecture (4 languages)
- Testing strategies (Jest unit tests, Cypress E2E)

Check the service and component files for inline documentation.

## Features

- Create, complete, and delete tasks
- Multi-language support (English, Spanish, French, German)
- Gradient design with dark mode
- Mobile responsive
- Real-time updates with RxJS
- Language preference saved in localStorage
- Unit tests and E2E tests
- Accessible with ARIA labels

## Tech Stack

- Angular 20 (Standalone Components)
- Ionic 8
- TypeScript 5.9
- SCSS
- RxJS for state management
- Reactive Forms
- Jest for testing
- Cypress for E2E
- Custom i18n service

## Installation

```bash
git clone https://github.com/AstraOracle/MYFINALAPP.git
cd MyFinalApp
npm install
```

## Running the App

```bash
npm start
```
Go to http://localhost:4200

## Build

```bash
npm run build
```

## Testing

### Unit Tests
```bash
npm test
```

- ItemService - 5 tests
- HomeComponent - 6 tests
- AddItemComponent - 4 tests
- SettingsComponent - 4 tests
- AppComponent - 1 test

### E2E Tests
```bash
npm run e2e
```

Tests navigation, adding/deleting items, language switching, and form validation.

## Project Structure

```
src/app/
├── home/           # Home page
├── add-item/       # Add item form
├── settings/       # Settings page
└── services/       # Services (items, i18n)
```

## Services

### ItemService
Manages tasks:
- getItems()
- addItem(item)
- toggleItem(id)
- deleteItem(id)
- getCompletedCount()

Uses RxJS BehaviorSubject for reactive updates.

### LanguageService
Handles translations:
- setLanguage(lang)
- getCurrentLanguage()
- translate(key)

Supports: English, Spanish, French, German
Stores preference in localStorage

## Languages

Translation files in `src/assets/i18n/`:
- en.json
- es.json
- fr.json
- de.json

Usage: `{{ translate('key.name') }}`

## Styling

- Primary gradient: #667eea → #764ba2
- Success: #28a745
- Danger: #dc3545
- Dark mode via CSS variables
- Mobile-first responsive design

## Features Used

- Arrow functions
- Destructuring
- Spread operator
- Template literals
- Async/await
- Interfaces & Enums
- Generics
- Array methods (map, filter, reduce, some)

## CI/CD

GitHub Actions workflow in `.github/workflows/ci.yml`:
- Builds on every push
- Runs tests

## Troubleshooting

Port already in use:
```bash
pkill -f node
```

Clear cache:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Author

GitHub: [@AstraOracle](https://github.com/AstraOracle)

---

Built with Ionic & Angular
