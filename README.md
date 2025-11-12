# Estonian Salary Calculator

A simple salary calculator for Estonia. It calculates **net salary**, **gross salary**, **employer cost**, and generates a **salary summary** using OpenAI. Supports multiple languages (English, Russian, Estonian).

---

## Features

- Calculate salary from net, gross, or employer cost.
- Breakdown of taxes and contributions:
  - Income tax
  - Social tax
  - Pension contributions
  - Unemployment insurance
- Generate a short AI-powered summary of the salary:
  - Explains lifestyle for the salary
  - Shows salary growth trend
  - Suggests realistic skills or industries to increase income
- Multi-language support with translations
- Responsive UI with TailwindCSS and Radix components

---

## Tech Stack

- **Next.js 13** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Radix UI**
- **OpenAI API** (GPT-4o-mini by default)
- **next-intl** for i18n

---

## Getting Started

Getting Started
1. Clone the repository

```bash
git clone https://github.com/carvz0r/aripaev-2.git

cd estonian-salary-calculator
```

2. Install dependencies

```bash
npm install

or

yarn install
```

3. Environment Variables

Create a .env file in the root of the project:

```env

#OpenAI API key (required)

OPENAI_API_KEY=your_openai_api_key_here

#Optional: specify which model to use

OPEN_API_MODEL="gpt-4o-mini"

#Disable Next.js telemetry

NEXT_TELEMETRY_DISABLED=1
```

⚠️ Make sure to replace `your_openai_api_key_here` with your actual OpenAI API key.

4. Run the development server

```bash
npm run dev
```
or
```bash
yarn dev
```

Open http://localhost:3000
 with your browser to see the app.

License

MIT © alex carv