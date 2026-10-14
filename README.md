# JARVIS Radium Command Center · Mark VI

[Open JARVIS](https://modifyingtiwari-design.github.io/jarvis-voice-assistant/) · [Vercel version](https://jarvis-voice-assistant-bay.vercel.app/)

A personal voice/text assistant using your own Sarvam API key, with radium green, cyan and violet activity channels.

## New in Mark VI

- **Trusted sessions:** opt in at pairing to run supported app/folder launches without repeated prompts for 30 minutes.
- **Windows App agent:** choose an open app and give a task. JARVIS reads accessible controls, plans one step with Sarvam, operates a control, then reads the result.
- **Visible progress and Stop:** one selected app, up to 12 actions and five minutes per run.
- **Text and voice:** use the App agent task box, or select an app and grant task permission there before saying/typing "Agent: [your task]" in the main box.

## Start

Open the HTTPS site in Chrome or Edge. Connect your Sarvam subscription key in Settings. Type a message, or enable voice mode and allow your microphone.

Voice mode listens, transcribes, replies aloud, then listens again. It is not full-duplex audio or a background wake-word service. Network/provider latency applies. Switching away stops voice mode; an explicitly started app task can continue while the tab stays open.

If browser speech fails, choose Sarvam input. Device-voice fallback is available when Sarvam speech fails. Tap Play / resume reply if autoplay is blocked. AI and Sarvam speech need internet, API access and credits. Keys stay in tab memory and are sent only to api.sarvam.ai, never stored in this repository.

## Desktop setup

Download [companion 6.0](JARVIS-Desktop-Companion-6.0.zip), close the old companion, extract the ZIP and run **START-WINDOWS.cmd**. Node.js 22+ is required; do not run as administrator. Read the included README.

In **Device tools**, paste its pairing code, select permissions, optionally enable **Windows app access** and **Trusted session**, and approve once in the companion terminal. Windows app access compiles the included fixed C# helper using the Windows .NET Framework compiler. No npm packages are needed. Allow normal browser local-network permission if prompted.

Routine commands: Open google chrome, Open calculator, Open notepad, Open home folder, Open documents, Open downloads. No AI key is needed for those launches. Standard launcher paths are required; missing/custom installations are reported. Open gmail.com or Open google requests a browser tab without the companion.

For a task inside an app, open the app, choose **App agent > Refresh open apps**, choose its window, enter a task, check permission to share the selected app's text with Sarvam, and start. Example: "Enter 125 multiplied by 8 in Calculator and tell me the result." Other controls and sensitive steps may still require terminal approval in trusted mode.

## Scope and privacy

The Windows agent uses Microsoft UI Automation: readable accessible text, writable fields, buttons, lists, toggles and scrolling. There is no arbitrary shell, code execution or filesystem endpoint. Terminals, several system/security programs, password fields and elevated/UAC windows are unsupported. Custom/canvas interfaces may not expose controls. It cannot operate every app or control phone apps. macOS/Linux retain fixed launchers only.

The AI can make mistakes. Supervise tasks and review edits. Approval rules are conservative but labels cannot identify every sensitive operation. Stop prevents further steps and cannot undo an action already completed. Refresh the app list before each new task. Observations are bounded and may be incomplete. No background screen recording is included.

The companion listens only on 127.0.0.1:4317 for the two exact published JARVIS origins. Pairing codes expire after ten minutes, sessions after thirty minutes. Disconnect or close the companion to revoke access. Credentials stay in memory. The companion makes no outbound requests; the website sends selected-app text to Sarvam for the task you start with permission checked. Summaries may enter later chat context. Avoid selecting windows containing secrets or unrelated private information.

## Other tools

- Up to three ordinary AI requests run concurrently; spoken replies queue. Separate independent commands with semicolons or "and also" (six per submission, fifteen active tasks total).
- Local timers, notes and clock: "Set a timer for 5 minutes", "Note: call Alex", "Read my notes", "What time is it?". Keep the tab open; device sleep and browser throttling can delay timers.
- Selected UTF-8 text-file editing up to 1 MB, save a copy, clipboard and native sharing when supported. AI summaries have a separate checkbox and 50,000-character limit. PDF/Word parsing is not included.
- Separate voice, cognition, creative and utility waveforms are visual activity signatures, not measured task frequencies.
- Dry wit or focused personality. AI receives recent completed conversation; simultaneous tasks do not see unfinished outputs from other tasks.

Reloading clears keys, conversation, notes, timers and unsaved edits. Export what you want to keep. Ordinary chat answers cannot directly execute desktop actions.

## Hosting and release status

Static site: deploy index.html, companion ZIPs and .nojekyll at the root. No website backend/build step is needed. GitHub Pages uses main/root; Vercel imports this repository. New domains require review of the companion origin allowlist. Never upload keys, pairing tokens or private workspace files.

Mark VI JavaScript syntax checks passed and the Windows helper compiled. Native app operations were not exercised in this release session; compatibility and AI task completion are not guaranteed.
