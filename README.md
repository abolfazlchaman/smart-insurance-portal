# Smart Insurance Portal

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://insurance-devotel.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/abolfazlchaman/smart-insurance-portal)

> [Live Demo](https://insurance-devotel.vercel.app/)

> [Github](https://github.com/abolfazlchaman/smart-insurance-portal)

A modern insurance portal built with Next.js 15, React 19, and TypeScript, featuring internationalization support and a clean, accessible UI.

## Features

- 🌐 Internationalization support (en, fr, de, fa, tr)
- 🎨 Modern UI with Tailwind CSS and daisyUI
- 🔒 Type-safe development with TypeScript
- 📱 Responsive design
- 🌙 Dark mode support
- 📝 Form handling with react-hook-form and zod validation

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS + daisyUI
- next-intl for i18n
- react-hook-form + zod for form handling
- Jest for testing

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/abolfazlchaman/smart-insurance-portal.git
cd smart-insurance-portal
```

2. Install dependencies using pnpm:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

5. Start production server:

```bash
pnpm start
```

## API Integration

The application integrates with the following API endpoints:

Base URL: `https://assignment.devotel.io`

### Available Endpoints

- `GET /api/insurance/forms` - Fetch available insurance forms
- `POST /api/insurance/forms/submit` - Submit insurance form data
- `GET /api/insurance/forms/submissions` - Fetch form submissions with pagination and filtering
- `GET /api/getStates` - Fetch states for a given country

### API Usage Example

```typescript
// Fetch insurance forms
const forms = await fetchInsuranceForms();

// Submit a form
const submission = await submitInsuranceForm({
  id: 'form_123',
  'Insurance Type': 'Health',
  // ... other form data
});

// Fetch submissions with pagination
const submissions = await fetchSubmissions({
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc',
});
```

## Internationalization

The application supports multiple languages:

- English (en)
- French (fr)
- German (de)
- Persian (fa)
- Turkish (tr)

Language files are located in the `messages` directory.

## Project Structure

```
├── app/
│   ├── [locale]/         # Localized routes
│   ├── components/       # Shared components
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript types
├── i18n/                # Internationalization config
├── messages/            # Translation files
└── public/             # Static assets
```

## Assumptions

1. The API base URL is fixed to `https://assignment.devotel.io`
2. All form submissions are initially marked as 'pending'
3. The application uses server-side rendering for better SEO and performance
4. Form data is validated using Zod schemas before submission
5. The application follows a mobile-first responsive design approach

## Development Guidelines

- Use React Server Components (RSC) where possible
- Minimize 'use client' directives
- Follow TypeScript best practices
- Implement proper error handling
- Write tests for critical functionality
- Use proper semantic HTML for accessibility

## Testing

Run tests using:

```bash
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

## License

MIT License
