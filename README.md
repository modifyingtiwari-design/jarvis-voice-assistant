# JARVIS Obsidian / Mark X

A conversation-first JARVIS: work assistant, thinking partner and playful buddy. The current interface focuses on voice, chat, planning, notes and timers. It no longer presents phone or computer control panels.

## Start

Open the HTTPS website, choose Settings and connect your Sarvam subscription key. Tap Start conversation and allow the microphone, or type in the chat box. Speak naturally, pause, hear the reply, then continue. Keep the page visible. Tap Interrupt & talk to interrupt a spoken response. Say “stop listening” to end the session.

AI replies need internet, a valid Sarvam key and API credits. Your key stays in tab memory and is sent only to api.sarvam.ai. It clears when the page is refreshed or left. No key is bundled in this project.

## Conversation styles

- **JARVIS:** capable, friendly and dryly witty.
- **Buddy:** relaxed conversation and useful follow-up questions.
- **Focus:** practical next steps without teasing.
- **Roast me:** light, opt-in teasing about harmless habits. Serious topics are handled respectfully.

Quick starters help plan your day, think through work, chat casually or roast an ambitious to-do list. Settings includes an optional name and today's priorities. Recent completed conversation, the profile and up to 15 recent notes are supplied as context to Sarvam. Context is limited to the current tab; this is not persistent personal memory. Change modes at any time; the change applies to the next generated reply.

## Local commands

- “Set a timer for two minutes.”
- “Note: finish the presentation.”
- “Read my notes.”
- “What time is it?”

These commands run without an AI key. Give one instruction per message. AI requests run in order to keep conversational context coherent, while timers run independently. Timers require this tab to remain open and may be delayed by device sleep or browser throttling.

## Voice and visuals

Streaming text and Sarvam speech are enabled by default when a key is connected. Voice settings use Bulbul v4 Flash and include multiple Hindi, Hinglish and Indian English personas. Choose **Natural Hinglish**, **Clear Hindi**, **Indian English**, or automatic language matching, then use **Preview selected voice** before starting a conversation. Hinglish replies use Devanagari for Hindi words and Latin script for English words to improve code-mixed pronunciation. An optional device-voice switch offers lower latency with less consistent quality, and the device voice remains the fallback if Sarvam speech fails.

Obsidian uses graphite, warm ivory and restrained oxblood accents. The animated core uses a shaded metal sphere, engraved orbital rings and a small ember center; its motion changes with listening/thinking/speaking states. Chat sits in a contrasting ivory panel. Decorative wave rhythms are visual state indicators, not measured brain or task frequencies. Reduced-motion preferences are respected.

Browser speech may send audio to the browser vendor; Sarvam input sends recordings to Sarvam. Voice is turn-taking, not simultaneous listening and speaking. Leaving or hiding the page stops listening. This is not a background wake-word assistant. Microphone and sound permissions depend on the browser and device.

## Scope

JARVIS helps write, reason, brainstorm and suggest plans. It does not send emails, place calls, operate other apps, browse live information, schedule calendar events or act after the page closes. Suggestions are not executed tasks. The Sarvam model is unchanged; this release improves prompts, conversational context and presentation, not the model's underlying intelligence.

## Data

Conversation, notes, profile and key remain in memory and clear on refresh. Export the session to keep conversation and notes. Completed conversation and local utility results may appear in later AI context. No conversation is stored by this static site; the selected API/speech providers process the data sent to them under their own policies.

## Build

The workspace builder is `work/build-mark10.cjs`. It builds the established conversation engine, including Bulbul v4 voice personas and language-aware response prompting, then applies `mark10.css`, `mark10-reactor.js` and the Obsidian layout. It emits a standalone `index.html`. Deploy that HTML with the manifest and icons to HTTPS static hosting.

Syntax checks passed. Real Sarvam responses, microphone operation and physical-device behavior were not tested for this release.
