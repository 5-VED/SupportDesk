# 🤖 OrbitDesk AI Integration Plan

## Overview

Transform OrbitDesk from a traditional support platform into an **AI-powered intelligent helpdesk**.
The architecture supports **multi-model AI** (OpenAI, Google Gemini, Anthropic Claude, local LLMs) 
through a provider-agnostic adapter pattern.

---

## 🌟 Recommended AI Features (Ranked by Impact)

### Tier 1 — High Impact, Quick Wins

| # | Feature | Description | Impact |
|---|---------|-------------|--------|
| 1 | **✨ Smart Reply Suggestions** | AI suggests 2-3 contextual replies for agents when viewing a ticket. One-click to insert. | 🔥🔥🔥 |
| 2 | **📝 Ticket Summarization** | One-click "Summarize" button on long ticket threads. Shows a 3-4 line TL;DR. | 🔥🔥🔥 |
| 3 | **🎭 Sentiment Analysis** | Detects customer emotion (😡 Frustrated, 😊 Happy, 😐 Neutral) and displays a badge. Auto-escalates angry customers. | 🔥🔥 |

### Tier 2 — Automation & Intelligence

| # | Feature | Description | Impact |
|---|---------|-------------|--------|
| 4 | **🏷️ Auto-Categorization & Tagging** | On ticket creation, AI suggests tags and category. Auto-routes to the right team. | 🔥🔥 |
| 5 | **⚡ Priority Prediction** | AI analyzes ticket content to predict urgency (Low/Normal/High/Urgent). | 🔥🔥 |
| 6 | **🔍 Similar Ticket Finder** | When viewing a ticket, shows "Related resolved tickets" using semantic search. Agents can reference past solutions. | 🔥🔥 |

### Tier 3 — Knowledge & Self-Service

| # | Feature | Description | Impact |
|---|---------|-------------|--------|
| 7 | **📚 KB Article Generator** | After resolving a ticket, agent clicks "Generate KB Article" to draft a help article from the conversation. | 🔥 |
| 8 | **💬 Customer Chatbot** | AI-powered chatbot that answers common questions from the Knowledge Base before creating a ticket. | 🔥 |
| 9 | **📊 AI Dashboard Insights** | Natural language queries: "Show me tickets with most complaints this week" → generates charts. | 🔥 |

### Tier 4 — Advanced (Future)

| # | Feature | Description | Impact |
|---|---------|-------------|--------|
| 10 | **🗣️ Tone Adjuster** | Agent writes a reply, clicks "Make Formal" / "Make Friendly" / "Simplify" to rephrase. | 🔥 |
| 11 | **🌐 Auto-Translation** | Detect customer language and translate tickets + replies in real-time. | 🔥 |
| 12 | **📈 Churn Predictor** | Analyze sentiment trends per customer to flag at-risk accounts. | 🔥 |

---

## 🏗️ Architecture: Multi-Model AI Support

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ AI Reply │  │Summarize │  │  Sentiment    │  │
│  │  Button  │  │  Button  │  │   Badge       │  │
│  └────┬─────┘  └────┬─────┘  └──────┬────────┘  │
│       └──────────────┼───────────────┘           │
│                      ▼                           │
│            AI Service (Frontend)                 │
│         notification.service.js style            │
└──────────────────────┬───────────────────────────┘
                       │ REST API
                       ▼
┌──────────────────────────────────────────────────┐
│                  Backend                          │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │           AI Controller & Routes            │  │
│  │  POST /ai/generate-reply                    │  │
│  │  POST /ai/summarize                         │  │
│  │  POST /ai/analyze-sentiment                 │  │
│  │  POST /ai/suggest-tags                      │  │
│  │  GET  /ai/config                            │  │
│  │  PUT  /ai/config                            │  │
│  └──────────────────┬──────────────────────────┘  │
│                     ▼                             │
│  ┌─────────────────────────────────────────────┐  │
│  │            AI Service Layer                 │  │
│  │  ┌───────────────────────────────────────┐  │  │
│  │  │        AIProviderFactory              │  │  │
│  │  │  getProvider(config) → AIAdapter      │  │  │
│  │  └───────────────┬───────────────────────┘  │  │
│  │                  │                          │  │
│  │    ┌─────────────┼─────────────┐            │  │
│  │    ▼             ▼             ▼            │  │
│  │ ┌────────┐  ┌─────────┐  ┌──────────┐      │  │
│  │ │ OpenAI │  │ Gemini  │  │ Claude   │      │  │
│  │ │Adapter │  │ Adapter │  │ Adapter  │      │  │
│  │ └────────┘  └─────────┘  └──────────┘      │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

### Provider Adapter Interface

Each AI provider adapter implements:
- `generateText(prompt, options)` → string
- `analyzeSentiment(text)` → { label, score, emoji }
- `generateEmbedding(text)` → number[] (for semantic search)

### Configuration (Admin Panel / .env)

```env
AI_PROVIDER=openai          # openai | gemini | anthropic
AI_MODEL=gpt-4o-mini        # model name
AI_API_KEY=sk-...           # API key
AI_TEMPERATURE=0.7          # creativity level
AI_MAX_TOKENS=1024          # response length limit
```

---

## 📅 Implementation Phases

### Phase 1: Foundation + Smart Replies (Week 1-2)
**Goal**: Get AI working end-to-end with one feature.

| Step | Task | Files |
|------|------|-------|
| 1.1 | Install AI SDK (`openai` or `@google/generative-ai`) | `Backend/package.json` |
| 1.2 | Create `AIProviderFactory` + `OpenAIAdapter` | `Backend/src/AI/` |
| 1.3 | Create AI routes, controller, service | `Backend/src/Router/AI.routes.js` |
| 1.4 | Add env config for AI | `.env` |
| 1.5 | Create `ai.service.js` (Frontend) | `FrontEnd/src/services/ai.service.js` |
| 1.6 | Add "✨ Generate Reply" button in `TicketDetail.jsx` | `FrontEnd/src/pages/TicketDetail.jsx` |
| 1.7 | Build `SmartReplyModal` component | `FrontEnd/src/components/ai/SmartReplyModal.jsx` |

### Phase 2: Summarization + Sentiment (Week 3)
**Goal**: Add intelligence to ticket viewing.

| Step | Task | Files |
|------|------|-------|
| 2.1 | Add `/ai/summarize` endpoint | `AI.controller.js` |
| 2.2 | Add "Summarize" button in ticket header | `TicketDetail.jsx` |
| 2.3 | Add `/ai/analyze-sentiment` endpoint | `AI.controller.js` |
| 2.4 | Display sentiment badge on ticket list + detail | `TicketsList.jsx`, `TicketDetail.jsx` |

### Phase 3: Auto-Tagging + Similar Tickets (Week 4)
**Goal**: Automate ticket triage.

| Step | Task | Files |
|------|------|-------|
| 3.1 | Add `/ai/suggest-tags` endpoint | `AI.controller.js` |
| 3.2 | Auto-suggest tags on ticket creation | `TicketDetail.jsx` |
| 3.3 | Implement vector embeddings for tickets | `AI/EmbeddingService.js` |
| 3.4 | Add "Similar Tickets" sidebar widget | `SimilarTickets.jsx` |

### Phase 4: KB Generation + Chatbot (Week 5-6)
**Goal**: Self-service and knowledge management.

| Step | Task | Files |
|------|------|-------|
| 4.1 | "Generate Article" action on resolved tickets | `TicketDetail.jsx` |
| 4.2 | AI Chatbot widget for customers | `ChatbotWidget.jsx` |

---

## 🎯 Quick Start Recommendation

**Start with Phase 1 (Smart Replies)**:
- Immediate, visible value for agents.
- Validates the entire AI pipeline end-to-end.
- Once this works, adding Summarization/Sentiment is incremental.

**Recommended First Provider**: **Google Gemini** (generous free tier) or **OpenAI GPT-4o-mini** (cheap, fast, good quality).

---

## ⚙️ Automation Scope

Automation is where OrbitDesk can **massively reduce manual work**. Below are the automation categories, each with concrete features.

### 1. 🔄 Workflow Automation (Rule Engine)

A configurable **"If This Then That"** rule engine that admins set up from the UI.

| Rule | Trigger | Action | Example |
|------|---------|--------|---------|
| **Auto-Assign** | Ticket created with tag "Billing" | Assign to "Billing Team" group | Customer submits billing issue → auto-routed |
| **Auto-Priority** | Ticket contains "urgent", "down", "broken" | Set priority to `Urgent` | "Our server is down!" → Priority: 🔴 Urgent |
| **Auto-Reply** | Ticket created (any) | Send acknowledgement email | "We've received your request, ticket #1234" |
| **Auto-Close** | Ticket status = `Solved` for 7 days | Change status to `Closed` | Stale solved tickets auto-close |
| **Escalation** | Ticket unassigned for 30 min | Notify admin via email + in-app | No agent picked up → manager alerted |
| **Re-open** | Customer replies on `Closed` ticket | Change status to `Open` | Customer replies "still broken" → ticket reopens |

**Implementation**: A `Rule` model with `conditions[]` and `actions[]`, evaluated via a `RuleEngine` service on ticket events (create, update, comment).

```
Rule Model:
{
  name: "Auto-assign billing tickets",
  is_active: true,
  trigger: "ticket_created",
  conditions: [
    { field: "tags", operator: "contains", value: "billing" }
  ],
  actions: [
    { type: "assign_group", value: "billing_team_id" },
    { type: "set_priority", value: "high" }
  ]
}
```

### 2. ⏱️ SLA Automation

| Feature | Description |
|---------|-------------|
| **SLA Timer** | Auto-track first response time & resolution time per ticket based on priority |
| **SLA Warning** | Notify agent 15 min before SLA breach |
| **SLA Breach** | Auto-escalate to manager, change priority to Urgent |
| **SLA Dashboard** | Show SLA compliance % on the Dashboard |

**Implementation**: A cron job (`node-cron`) that checks ticket SLA deadlines every minute. Fires Kafka events for `sla-warning` and `sla-breach` (topics already exist in your codebase!).

### 3. 📧 Email Automation

| Feature | Description |
|---------|-------------|
| **Ticket-via-Email** | Customers email `support@company.com` → auto-creates a ticket |
| **Email-to-Comment** | Customer replies to notification email → adds comment to ticket |
| **Auto-Follow-Up** | If ticket is `Pending` for 3 days → send "Any updates?" email to customer |
| **CSAT Survey** | After ticket is closed → send satisfaction survey email |

**Implementation**: IMAP listener service for inbound emails + existing Kafka + Notification Service for outbound.

### 4. 📊 Scheduled Reports & Tasks

| Feature | Description |
|---------|-------------|
| **Daily Digest** | Email agents a summary of their open tickets every morning |
| **Weekly Report** | Email admin: tickets created/resolved, avg response time, SLA compliance |
| **Stale Ticket Cleanup** | Auto-flag tickets with no activity for 14+ days |
| **Data Export** | Schedule automatic CSV/Excel export of ticket data |

**Implementation**: `node-cron` scheduled jobs in the Backend.

### 5. 🤖 AI + Automation Combined (Smart Automation)

This is where AI and Automation merge for maximum value:

| Feature | Description |
|---------|-------------|
| **AI Auto-Triage** | AI categorizes + prioritizes + assigns on ticket creation (zero human intervention) |
| **Smart Auto-Reply** | If AI confidence > 90%, auto-send the AI-generated reply without agent review |
| **Predictive Escalation** | AI detects frustrated sentiment → auto-escalate before customer complains |
| **Auto-KB Suggestion** | When customer creates a ticket, AI checks KB and auto-replies with relevant article link |

### Automation Implementation Priority

```
Priority 1 (Build Now):
  ├── Auto-Assign (rule-based)
  ├── Auto-Reply (acknowledgement)
  ├── Auto-Close stale tickets
  └── SLA Timer + Warning

Priority 2 (Build Next):
  ├── Escalation rules
  ├── Email-to-Ticket
  ├── CSAT Survey
  └── Scheduled Reports

Priority 3 (Build Later):
  ├── Full Rule Engine UI
  ├── AI Auto-Triage
  ├── Smart Auto-Reply
  └── Predictive Escalation
```

---

## ❓ Decision Needed

1. Which AI provider to start with? (OpenAI / Gemini / Claude)
2. Which feature to build first?
3. Should AI config be admin-managed (UI) or `.env` only for now?
