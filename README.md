# Second Brain Live

**Think freely. We'll remember everything.**

Real-time cognitive copilot powered by Google Gemini | [Live Demo](https://second-brain-live.vercel.app) | [Video Demo](https://youtu.be/dVuUa5xMFp4)

---

## The Problem

Every day, valuable insights are lost in meetings, calls, and brainstorms. Important decisions get buried in conversation flow. Action items remain untracked. Open questions are forgotten.

**Second Brain Live** solves this by capturing and structuring your thoughts in real-time.

---

## Solution

A cognitive copilot that thinks alongside you, automatically extracting:

| Dimension | What it captures |
|-----------|------------------|
| **Summary** | Evolving overview of your session |
| **Key Ideas** | Important concepts and themes |
| **Decisions** | Explicit and implicit choices made |
| **Actions** | Tasks with owners and deadlines |
| **Questions** | Unresolved issues to address |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SECOND BRAIN LIVE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────────────────────┐   │
│   │   USER      │     │  FRONTEND   │     │         BACKEND             │   │
│   │             │     │  (Next.js)  │     │       (API Routes)          │   │
│   │  ┌───────┐  │     │             │     │                             │   │
│   │  │ Text  │──┼────▶│ InputPanel  │     │  ┌─────────────────────┐    │   │
│   │  └───────┘  │     │     │       │     │  │   /api/update       │    │   │
│   │             │     │     ▼       │     │  │                     │    │   │
│   │  ┌───────┐  │     │ SessionCtx  │────▶│  │  ┌───────────────┐  │    │   │
│   │  │ Voice │──┼────▶│     │       │     │  │  │ State Manager │  │    │   │
│   │  └───────┘  │     │     ▼       │     │  │  └───────┬───────┘  │    │   │
│   │   Gemini    │     │ StateDisplay│◀────│  │          │          │    │   │
│   │    Live     │     │             │     │  │          ▼          │    │   │
│   └─────────────┘     └─────────────┘     │  │  ┌───────────────┐  │    │   │
│                                           │  │  │   GEMINI 3    │  │    │   │
│                                           │  │  │    FLASH      │  │    │   │
│                                           │  │  │               │  │    │   │
│                                           │  │  │ System Prompt │  │    │   │
│                                           │  │  │ + State JSON  │  │    │   │
│                                           │  │  │ + New Segment │  │    │   │
│                                           │  │  │       │       │  │    │   │
│                                           │  │  │       ▼       │  │    │   │
│                                           │  │  │ Updated State │  │    │   │
│                                           │  │  └───────────────┘  │    │   │
│                                           │  └─────────────────────┘    │   │
│                                           │                             │   │
│   ┌─────────────────────────────────────────────────────────────────┐   │   │
│   │                        LOCAL STORAGE                            │   │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │   │
│   │  │  Sessions   │  │  Language   │  │   Voice Transcriptions  │  │   │   │
│   │  │  History    │  │  Preference │  │        History          │  │   │   │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │   │
│   └─────────────────────────────────────────────────────────────────┘   │   │
│                                                                         │   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input ──▶ Frontend ──▶ /api/update ──▶ Gemini 3 Flash ──▶ Updated State ──▶ UI
    │                                              │
    │                                              ▼
    │                                     ┌─────────────────┐
    │                                     │  System Prompt  │
    │                                     │  (EN/FR)        │
    │                                     │       +         │
    │                                     │  Current State  │
    │                                     │       +         │
    │                                     │  New Segment    │
    │                                     └────────┬────────┘
    │                                              │
    │                                              ▼
    │                                     ┌─────────────────┐
    │                                     │  JSON Response  │
    │                                     │  {              │
    └─────────────────────────────────────│   résumé,       │
                                          │   idées_clés,   │
                                          │   décisions,    │
                                          │   actions,      │
                                          │   questions     │
                                          │  }              │
                                          └─────────────────┘
```

---

## How We Use Gemini

### Gemini 3 Flash - Cognitive Processing

We use **Gemini 3 Flash** (`gemini-2.0-flash`) for real-time cognitive state updates:

```typescript
// lib/gemini.ts
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT  // EN or FR based on user preference
});

// Each update sends:
// 1. Current cognitive state (JSON)
// 2. New input segment (text)
// Returns: Updated cognitive state (JSON)
```

**Why Gemini 3 Flash?**
- **Low latency** (<2s response) - essential for real-time feel
- **Structured output** - reliable JSON formatting
- **Contextual reasoning** - maintains coherence across updates
- **Instruction following** - strict adherence to cognitive schema

### Gemini 2.5 Live - Voice Input

We use **Gemini Live API** (`gemini-2.5-flash-native-audio-preview`) for real-time voice:

```typescript
// components/VoiceInput.tsx
const client = genAI.liveConnect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: "Transcribe and respond naturally"
    }
});

// Bi-directional audio streaming
// - User speaks → Real-time transcription
// - AI responds with synthesized voice
```

**Why Gemini Live?**
- **Native audio processing** - no external STT needed
- **Bi-directional streaming** - true conversation flow
- **Low latency** - real-time interaction

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **AI - Text** | Gemini 3 Flash |
| **AI - Voice** | Gemini 2.5 Live |
| **State** | React Context + localStorage |
| **Icons** | Lucide React |

---

## Features

- **Real-time processing** - Updates in <2 seconds
- **Text & Voice input** - Type or speak naturally
- **Bilingual** - Full EN/FR support (UI + AI responses)
- **Session persistence** - Auto-save to localStorage
- **Dashboard** - View all sessions with global stats
- **Export** - Download session as JSON

---

## Quick Start

### Prerequisites
- Node.js 20.9+
- Gemini API key ([Get free key](https://ai.google.dev/))

### Installation

```bash
# Clone
git clone https://github.com/sverano/second-brain-live.git
cd second-brain-live

# Install
npm install

# Configure
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
secondbrainlive/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── session/page.tsx         # Main app workspace
│   ├── dashboard/page.tsx       # Session history
│   └── api/
│       ├── update/route.ts      # Cognitive state update
│       └── reset/route.ts       # New session
├── components/
│   ├── InputPanel.tsx           # Text/Voice input
│   ├── VoiceInput.tsx           # Gemini Live integration
│   ├── StateDisplay.tsx         # Cognitive state UI
│   ├── AppHeader.tsx            # Navigation + history
│   └── Hero.tsx                 # Landing hero
├── contexts/
│   ├── SessionContext.tsx       # Session state management
│   └── LanguageContext.tsx      # i18n (EN/FR)
├── lib/
│   ├── gemini.ts                # Gemini API client
│   ├── state.ts                 # Backend state (Map)
│   ├── sessionStorage.ts        # localStorage utilities
│   ├── types.ts                 # TypeScript types
│   └── i18n.ts                  # Translations
└── utils/
    └── audioUtils.ts            # Audio encoding/decoding
```

---

## Cognitive State Schema

```json
{
  "résumé": "Concise evolving overview of the session",
  "idées_clés": ["Key concept 1", "Key concept 2"],
  "décisions": ["Decision made 1", "Decision made 2"],
  "actions_à_faire": ["Task with owner and deadline"],
  "questions_ouvertes": ["Unresolved question"]
}
```

---

## Demo Scenario

Try these segments to see the cognitive state evolve:

1. "Meeting to discuss our fitness app launch"
2. "Sarah suggests targeting beginners rather than athletes"
3. "Marc proposes integrating an AI coach. Everyone agrees"
4. "We're hesitating between monthly subscription or one-time payment"
5. "Sarah will create mockups by Friday"

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

---

## License

MIT - Built for the Gemini 3 Global Hackathon

---

**Think freely. We'll remember everything.**
