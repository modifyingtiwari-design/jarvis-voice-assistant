# JARVIS Radium Command Center · Mark V

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

This app answers, drafts, plans and runs its built-in timer/note utilities. Device tools add explicit selected-file access and optional approved desktop launches. It cannot control arbitrary apps, send messages, type into other programs, delete files, run shell commands or read live website contents.

## Device tools

Open **Device tools** under the reactor. Voice mode stops while you use device tools.

- **Phones and computers:** choose a UTF-8 text, Markdown, CSV or JSON file up to 1 MB, edit locally, save a copy, copy text or use the device share sheet when supported. You can also start a new note or copy the latest reply into the editor. PDF/Word editing is not included. A save picker may let you choose a destination, while other browsers use downloads; the source is never overwritten automatically.
- **Optional AI summary:** tick the consent checkbox and select **Summarize with JARVIS**. Only then is the editor's text sent to Sarvam (up to 50,000 characters). Editing the text resets consent. The resulting summary may be included in later conversation context. Closing/reloading the page discards unsaved edits.
- **Optional desktop companion:** download `JARVIS-Desktop-Companion.zip` from Device tools, extract it, install Node.js 22+ if needed, and run `START-WINDOWS.cmd` on Windows or `node companion.cjs` on macOS/Linux. Keep its terminal open. Paste its pairing code into Device tools, choose apps and/or folders permission, and type **yes** in the companion terminal. Each action also needs terminal approval. Do not paste the code into chat.
- Supported companion actions: Calculator, text editor, Home, Documents and Downloads. Windows/macOS use their standard launchers; Linux requires gnome-calculator, gedit and xdg-open at the documented locations. Redirected/custom folders are not supported.
- Commands: **Open calculator**, **Open notepad**, **Open documents**, **Open downloads**, **Open home folder**, **Choose a file**, **Save this file**, **Share this file**, **Open google**, **Open youtube**. File pickers and action confirmations need a tap, even for voice commands. Website commands request a new tab; they do not inspect the website.
- The companion only accepts the two published JARVIS site origins, binds to `127.0.0.1:4317`, and requires a random pairing code plus an origin-bound 30-minute token. Credentials remain in memory. It provides no arbitrary-command or filesystem API. Close its terminal to revoke access. Browser local-network permission may be required; do not disable browser security. The companion is for the same computer, not remote phone control.

The UI uses crisp text with radium green, electric cyan and violet accents. Activity animation reflects the assistant state; it does not imply device access before permission.

AI replies and Sarvam voices require internet, a valid Sarvam API subscription key and available credits. Automatic speech recognition depends on browser support and permissions. If browser speech fails, choose Sarvam input; if Sarvam speech output fails, the optional device-voice fallback is used. If autoplay is blocked, use **Play / resume reply**.

## Hosting

Upload index.html and JARVIS-Desktop-Companion.zip to the root of a static site. The browser assistant requires no backend, packages or build step. Only optional desktop launches require the local companion. GitHub Pages: deploy main / root. Vercel: import the GitHub repository as a static site with no build command. Keep .nojekyll for GitHub Pages. Do not upload credentials or private workspace files. If you change the published domain, review and update the exact allowed origins in the companion source.
