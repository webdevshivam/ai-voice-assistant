# Hindi AI Voice Assistant

## Overview

A real-time Hindi AI Voice Assistant built with a full-stack TypeScript architecture. Users can speak in Hindi, the app converts speech to text, sends it to an AI backend for processing, and speaks the response back in Hindi. The system supports customizable AI behavior through system prompts and stores conversation history in PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with Vite for fast development and HMR
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration supporting dark mode
- **Animations**: Framer Motion for voice activity visualization
- **Speech APIs**: Native Web Speech API for both speech-to-text (hi-IN) and text-to-speech

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Real-time Communication**: Socket.IO for bidirectional messaging between client and server
- **API Pattern**: REST endpoints for CRUD operations, WebSockets for real-time voice interactions
- **AI Integration**: OpenAI-compatible API through Replit AI Integrations for chat completions

### Data Flow
1. User clicks microphone → Web Speech API captures Hindi speech
2. Speech converted to text → Sent via Socket.IO to backend
3. Backend receives text + system prompt → Calls OpenAI API
4. AI response received → Saved to database → Emitted back to client
5. Client receives response → Web Speech API speaks it in Hindi

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` defines conversation storage
- **Migrations**: Drizzle Kit for schema management (`db:push` command)

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (Shadcn + custom)
    hooks/        # Custom hooks (speech, toast, conversations)
    pages/        # Route components
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API routes and Socket.IO handlers
  storage.ts      # Database abstraction layer
  db.ts           # Drizzle database connection
  replit_integrations/  # AI integration utilities
shared/           # Shared TypeScript types and schemas
  schema.ts       # Drizzle table definitions
  routes.ts       # API route type definitions
```

### Build System
- **Development**: TSX for running TypeScript directly
- **Production Build**: Vite for frontend, esbuild for backend bundling
- **Output**: Combined into `dist/` with server and public assets

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage for Express (if sessions are added)

### AI Services
- **OpenAI API**: Chat completions via Replit AI Integrations
- **Environment Variables**: `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Browser APIs
- **Web Speech API**: `webkitSpeechRecognition` for speech-to-text
- **SpeechSynthesis API**: For text-to-speech output
- **Language**: Hindi India (hi-IN) for both input and output

### Key NPM Packages
- `socket.io` / `socket.io-client`: Real-time bidirectional communication
- `drizzle-orm` / `drizzle-kit`: Type-safe database ORM and migrations
- `openai`: OpenAI API client
- `framer-motion`: Animation library for voice visualizations
- `@tanstack/react-query`: Server state management