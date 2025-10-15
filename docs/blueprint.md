# **App Name**: ThriveWell

## Core Features:

- User Profile Creation: Securely store user's personal data (name, DOB, email, password) in Supabase database.
- Data input: Users input gratitude lists, dream diaries, daily records, feelings of upset, regulation methods to be stored as diary entries
- Psychological Assessment: Collect trauma information, attachment style, behavioral patterns, anxiety levels, OCD/ADHD tendencies to assist personalized analysis.
- AI Agent Interaction: AI agents (nutritionist, psychologist, therapist, fitness instructor, personal life manager) to interact with the client. Data and conversations from AI agents should persist to the database.
- AI Mental Health Analysis: Use the Deepseek API as a tool to analyze user inputs, including diary entries and assessment results. Categorize these insights into 'profiles' and 'notes' for the AI agents to ingest and utilize, updating notes after each conversation.
- Rate Limiter: Implement API call gates to prevent Deepseek API over-calling. If call limits are reached then display informative text for the user with ways to resolve
- Subscription Payments: Enable tiered subscription plans through Stripe to enable advanced features or expanded use.

## Style Guidelines:

- Primary color: Softened forest green (#8FBC8F) for a grounding and natural feel.
- Background color: Light beige (#F5F5DC) to mimic natural paper and create a soft, calming backdrop.
- Accent color: Muted brown (#BDB76B) for interactive elements and highlights, evoking a sense of stability.
- Body font: 'Lato' for a clean and readable experience.
- Headline font: 'Montserrat' for a professional and modern feel.
- Use nature-inspired icons with a minimalist design to represent different aspects of wellness.
- Incorporate subtle, organic animations, like gentle fades or smooth transitions, to create a calming user experience.