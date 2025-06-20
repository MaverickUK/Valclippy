# ValClippy Chat

A conversational interface built with Next.js and OpenAI, designed to help users find information about internal projects and people. The app features a chat UI, LLM integration, and a fictional data source for demonstration.

<img src="public/mascot.png" alt="ValClippy Mascot" style="width:20%;">

If this was real it would search real Valtech information repositories (e.g. Confluence, SharePoint, Suite Projects Pro) however for this prototype all the data it uses is held within `/src/app/api/chat/data.json`. This data is then supplied with a prompt held within `/src/app/api/chat/route.ts` which communicates to the LLM how to answer the users questions.

## Features
- Conversational chat interface with chat bubbles
- OpenAI (ChatGPT) integration
- Fictional internal data (people & projects) via JSON
- Modular React components and hooks
- Tailwind CSS styling

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd valclippy-chat
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory with the following:
```env
OPENAI_API_KEY=sk-...your-openai-key...
OPENAI_MODEL=gpt-4o-mini
```
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: (Optional) The OpenAI model to use (default: `gpt-4o-mini`)

### 4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

## Project Structure
- `src/app/page.tsx` — Main chat UI, uses modular components/hooks
- `src/app/api/chat/route.ts` — API route for LLM chat, loads data and calls OpenAI
- `src/app/api/chat/data.json` — Fictional people and projects data
- `src/components/` — UI components (chat input, message bubble, suggestions)
- `src/hooks/` — Custom React hooks (chat state, greeting)
- `src/services/` — API call logic
- `src/utils/` — Message formatting utilities
- `src/constants/` — Greeting messages
- `src/types/` — TypeScript types
- `public/mascot.png` — Mascot image for the assistant

## Customization
- To change the fictional data, edit `src/app/api/chat/data.json`.
- To use a different OpenAI model, set `OPENAI_MODEL` in `.env.local`.

## Notes
- Tailwind CSS is used for styling. If you add new dynamic classes in injected HTML, update the safelist in `src/app/page.tsx`.
- The app is for demonstration and internal hackathon use. Do not expose your OpenAI API key publicly.

## License
MIT (or your chosen license)
