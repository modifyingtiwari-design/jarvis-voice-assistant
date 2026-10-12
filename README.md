# JARVIS Voice Assistant

A futuristic browser assistant with text chat, microphone input, and spoken replies powered by your own Sarvam API key.

## Use

1. Open `index.html` in Chrome or Edge, or visit the GitHub Pages website when enabled.
2. Enter your Sarvam API subscription key and select **Use key**.
3. Select **Talk to JARVIS**, allow microphone access, speak, and select **Finish & send**.
4. Keep **Speak replies** enabled. If autoplay is blocked, select **Play audio**.

You can also type messages. No local backend or package installation is required. Internet access and Sarvam API credits are required. An Indus account alone is not an API subscription key.

Get your key at https://dashboard.sarvam.ai/key-management.

## Privacy and limitations

- No API key is included in this repository. Your key stays in the open tab's memory and is sent only to `api.sarvam.ai`.
- Chat messages and submitted microphone recordings are sent to Sarvam to generate responses. Recordings stop after 25 seconds or when you finish/cancel.
- Refreshing clears your key and conversation. Use **Export text** to save a conversation.
- Microphone access depends on your browser and permissions; use HTTPS hosting for other devices.
- This assistant supports chat and voice. It does not control your computer or browse the live web.

## Host with GitHub Pages

In repository **Settings → Pages**, select **Deploy from a branch**, then **main** and **/ (root)**, and save. GitHub will display the published website address after deployment.

## Development

The interface, styling, and JavaScript are contained in `index.html`. There is no build step.
