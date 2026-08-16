# React Structure Folder

A beginner-friendly React starter built with Vite, JavaScript, `react-router-dom`, and Tailwind CSS.

## Getting started

Clone the repository and move into the project folder:

```bash
git clone <repository-url>
cd react_structure_folder
```

If you're using this as a template for a new project, drop the cloned git history and start your own:

```bash
rm -rf .git
git init
```

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Then open the URL Vite prints in the terminal (usually `http://localhost:5173`).

## Project structure

```
src/
  assets/       images, icons
  components/   reusable UI used by 2+ pages (Navbar, Button, Card)
  pages/        one file per route (Home, About, Contact, NotFound)
  App.jsx       route definitions
  main.jsx      entry point
```

See [AGENTS.md](AGENTS.md) for the coding rules this project follows.

## Commands

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`      | Start the dev server     |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview the production build |
| `npm run lint`     | Run ESLint               |
