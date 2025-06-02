# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ValClippy Chat is a Next.js 15 application that serves as a chat interface for an internal assistant called "ValClippy". The app helps users find information about internal projects and people using fictional data.

## Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: TailwindCSS with PostCSS
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **API**: Custom API route at `/api/chat` that integrates with OpenAI's GPT-3.5-turbo

### Key Components

- `src/app/api/chat/route.ts`: Main API endpoint that loads fictional data from `data.json` and sends requests to OpenAI API
- `src/app/page.tsx`: Default Next.js landing page (not yet customized for ValClippy)
- `src/app/layout.tsx`: Root layout with font configuration
- `src/app/api/chat/data.json`: Contains fictional internal data used by ValClippy

## Development Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Important Notes

- The OpenAI API key is currently hardcoded in `src/app/api/chat/route.ts:20` and should be moved to environment variables
- The chat API loads fictional data from a local JSON file to provide context to the AI assistant
- Uses TypeScript path mapping with `@/*` pointing to `./src/*`