# JARVIS Command Center · Mark IV

A buildless, single-file personal assistant with a holographic dashboard and your own Sarvam API key.

## Start

Open the published HTTPS site in Chrome or Edge. Go to **Settings**, connect your Sarvam subscription key, choose your spoken language, then select **Enable voice mode** and allow the microphone.

Voice mode automatically takes turns: listen, send your instruction, speak the response, then listen again. Say **stop listening** or press the voice-mode button to stop. During a reply, use **Interrupt & talk**. Keep this page visible; switching away stops voice mode and releases the microphone. It is not full-duplex audio or a background wake-word service. Network and speech-provider latency still apply.

## Tasks

- Up to three AI requests run concurrently. Further requests queue, with individual cancel/retry controls. Send another command while earlier ones run.
- Separate independent commands with a semicolon or “and also” (maximum six per submission, fifteen active tasks total).
- Spoken replies play one at a time. Read any previous response aloud from its conversation entry.
- Local commands: “Set a timer for 5 minutes”, “Note: call Alex”, “Read my notes”, “What time is it?”. These commands use English phrases; AI chat supports other languages.
- Timers and notes work without an API key. Device speech is used for local replies without a key. Timers require this tab to remain open; suspended devices or throttled tabs can delay alerts.
- Voice, cognition, creative and utility channels use distinct activity waveforms. These are visual task signatures, not measured sound frequencies. The central audio meter uses available microphone/playback levels.
- Select JARVIS dry wit or focused personality in Settings.

## Privacy and limits

The API key is stored only in tab memory and sent only to api.sarvam.ai. It is never included in this repository. Refreshing removes the key, conversation, notes and timers; export the session to keep text.

Browser speech may send audio to the browser vendor. Sarvam speech sends the recording to Sarvam. AI requests include recent completed conversation. Each simultaneous AI task uses a snapshot of conversation at submission, so it does not see the unfinished output of another task. Local utility commands are handled in this tab. Their completed replies can become conversation context in later AI requests.

This app answers, drafts, plans and runs its built-in timer/note utilities. It does not access other apps, send messages, control your device or browse live websites.

AI replies and Sarvam voices require internet, a valid Sarvam API subscription key and available credits. Automatic speech recognition depends on browser support and permissions. If browser speech fails, choose Sarvam input; if Sarvam speech output fails, the optional device-voice fallback is used. If autoplay is blocked, use **Play / resume reply**.

## Hosting

Upload index.html to the root of a static site. No backend, packages or build step are required. GitHub Pages: deploy main / root. Vercel: import the GitHub repository as a static site with no build command. Keep .nojekyll for GitHub Pages. Do not upload credentials or private workspace files.
