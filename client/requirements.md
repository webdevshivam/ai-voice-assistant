## Packages
socket.io-client | Real-time bidirectional communication
framer-motion | Beautiful animations for voice activity and UI transitions
lucide-react | Icons for the interface (already in base, but ensuring it's noted)

## Notes
- Using native `window.webkitSpeechRecognition` for speech-to-text (STT)
- Using native `window.speechSynthesis` for text-to-speech (TTS)
- Language set to 'hi-IN' (Hindi India) for both STT and TTS
- Socket events: emit 'message', listen for 'response'
- Backend is expected to handle the OpenAI/LLM processing and emit back
