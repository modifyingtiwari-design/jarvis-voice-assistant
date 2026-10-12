# JARVIS Voice Assistant · Mark III

A futuristic browser assistant with text chat, microphone input, and spoken replies powered by your own Sarvam API key.

## Use

1. Open `index.html` in Chrome or Edge, or visit the GitHub Pages website when enabled.
2. Enter your Sarvam API subscription key and select **Use key**.
3. Select **Talk to JARVIS**, allow microphone access, and speak. Automatic mode uses browser speech where available and sends when recognition ends. In Sarvam mode, pause after your instruction or select **Finish & send**.
4. Keep **Speak replies** enabled. If autoplay is blocked, select **Play audio**.

You can also type messages. No local backend or package installation is required. Internet access and Sarvam API credits are required. An Indus account alone is not an API subscription key.

Get your key at https://dashboard.sarvam.ai/key-management.

## Privacy and limitations

- No API key is included in this repository. Your key stays in the open tab's memory and is sent only to `api.sarvam.ai`.
- Browser speech may use the browser vendor's speech service and shows a live transcript. Set the Language control to your spoken language; Auto uses English (India) for browser recognition.
- In Sarvam mode, microphone recordings are sent to Sarvam for transcription. Compatible recordings are converted to mono 16 kHz WAV. Recording stops on a pause after speech, after 25 seconds, or when you finish/cancel.
- Chat messages are sent to Sarvam for AI replies and spoken audio. Browser dictation works before adding a key, but AI replies require a Sarvam key.
- Refreshing clears your key and conversation. Use **Export text** to save a conversation.
- Microphone access depends on your browser and permissions; use HTTPS hosting for other devices.
- This assistant supports chat and voice. It does not control your computer or browse the live web.

## Host with GitHub Pages

In repository **Settings → Pages**, select **Deploy from a branch**, then **main** and **/ (root)**, and save. GitHub will display the published website address after deployment.

## Development

The interface, styling, and JavaScript are contained in `index.html`. There is no build step.

The wireframe reactor indicates permission requests, listening, transcription, AI processing, speech generation and actual audio playback. Audio meters use microphone/playback levels where available; browser recognition uses an activity animation without claiming to measure audio levels. Reduced-motion preferences are respected.

## Voice troubleshooting

- Permission blocked: allow Microphone in the site's browser settings and reopen the HTTPS website directly in Chrome or Edge.
- Browser speech service error: select **Sarvam speech** and try again.
- Sarvam transcription error: select **Browser speech** where supported. The interface displays the failed stage, HTTP status and provider's error message instead of suggesting an unrelated voice change.
- Silent input: check your device's microphone selection and input volume.
- Audio ready but silent: click **Play audio** and check device volume.
