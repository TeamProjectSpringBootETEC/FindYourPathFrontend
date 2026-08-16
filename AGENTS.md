# AGENTS.md

## Project
Beginner React app. Vite + JavaScript + react-router-dom. No TypeScript.

## Structure
src/
  assets/       images, icons
  components/   reusable UI used by 2+ pages
  pages/        one file per route
  App.jsx       routes
  main.jsx      entry point

## Rules for AI agents

### Do
- Functional components with hooks only
- One component per file, default export
- PascalCase files for components: Navbar.jsx
- camelCase for functions and variables
- Import with the @ alias: import Navbar from '@/components/Navbar'
- Keep files under 150 lines; split when bigger
- Tailwind CSS utility classes via className; keep index.css to just the `@import 'tailwindcss';` line
- Explain new concepts in simple English after writing code

### Don't
- No TypeScript, no class components
- No new npm packages without asking first
- No Redux, Zustand, or Context until the app actually needs it
- No empty "just in case" folders
- Don't refactor files I didn't ask about
- Don't delete my comments

### When adding a feature
1. Ask which folder it belongs in if unclear
2. Show the file tree change before writing code
3. Write the code
4. Explain what changed in 2-3 sentences

## Commands
npm run dev      start dev server
npm run build    build for production
