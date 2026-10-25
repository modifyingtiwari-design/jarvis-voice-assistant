# AI Suzie / Mark XIII

Open https://jarvis-voice-assistant-bay.vercel.app/?v=ai-suzie and sign in. Your account uses the server-side Sarvam key. An optional personal key can be entered in Settings and stays in this tab.

## Natural conversation

Choose **Start conversation**, allow the microphone and keep the tab visible. Natural conversation is on by default. It maintains one microphone session, detects speech locally, transcribes each turn with Sarvam, streams the reply and speaks it in chunks. Speaking over a reply cancels its generation, current audio and queued speech. The page creates no beep and does not repeatedly start browser recognition in this mode. OS permission sounds remain outside its control.

Settings lets you choose a 0.6, 0.8 or 1.2 second pause and interruption sensitivity. Headphones work best; choose Headphones sensitivity only when wearing them. Automatic speaker interruption needs browser echo cancellation. Background noise and device audio processing affect recognition. This is not background listening or a wake-word service. Hiding the page or stopping conversation releases the microphone. Internet/provider latency still applies.

## Private assistant library

- Workspaces organize conversations and saved tasks.
- Memory supports save/edit/forget/restore. Forgotten entries are excluded from new AI requests, but old messages containing the information remain in history. The eight most recently updated active memories are currently included in model context.
- History supports title search, continuing a conversation, renaming and moving it. Older messages load in pages; model context uses the most recent 20 cloud messages.
- Daily briefing uses your saved tasks, dates and priorities. It does not read an external calendar or send background reminders.
- PDF/text/image chat extracts text on this device. Review and attach it before sending. Only attached text is sent for AI reasoning and stored in signed-in chat history. Limits: 10 MB input, first 20 PDF pages, 10,000 text characters. Scanned PDFs require screenshots or pasted text. Hindi/English screenshot OCR downloads Tesseract core/language files from jsDelivr.
- Personality, reply length, humour, language and voices can be selected in Settings.
- Gmail and Calendar prepare reviewed drafts. Google OAuth is not configured: no inbox/calendar reading, automatic sending or event creation. Gmail opens a compose draft; calendar offers a prefilled review page or .ics download.

## Hosting and data

Deploy index.html, assets/, api/, vercel.json, the manifest and icons together. Natural conversation and PDF/OCR need the asset files; a standalone HTML copy does not include these modules. HTTPS is required for microphone access. GitHub Pages uses the Vercel API origin for cloud features.

Supabase tables use authenticated-user ownership policies. Server environment configuration remains required for Supabase and Sarvam. Do not put server secrets in the frontend. Private memory and plans require an account; file extraction and draft preparation can run locally without signing in.

## Source and checks

The workspace build entry is work/build-ai-suzie.cjs. Database additions are documented in schema-mark12.sql. JavaScript syntax checks passed. Physical microphone interruption, speaker echo cancellation and mobile audio behavior need device validation; no claim of zero latency or universal browser compatibility is made.

PDF.js and Tesseract licenses are included in assets/. PDF.js is pinned to 5.4.149, Tesseract.js to 6.0.1, and its WASM core to 6.0.0.
## Streaming voice update

Sarvam audio now streams through an authenticated server endpoint and plays incrementally through Web Audio. Replies no longer need the whole speech file before playback. Later sentences can enter the speech queue while text is still arriving. The previous complete-file speech path remains as a compatibility fallback. The same selected Sarvam voice and pace are preserved.

The voice panel shows time from submitting a task to its first scheduled audio. This includes AI generation and network time; it is not a guarantee of instant replies. Interruption stops both the network stream and scheduled audio. Offline checks cover split WAV headers/frames, unknown-length WAV data, malformed/truncated audio, and cancellation of buffered playback.