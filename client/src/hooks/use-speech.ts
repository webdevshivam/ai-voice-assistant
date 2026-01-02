import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

export function useSpeech(language: string = "hi-IN") {
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    isSpeaking: false,
    transcript: "",
    interimTranscript: "",
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore - webkitSpeechRecognition is standard in Chrome/Safari
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after one sentence for a chat interaction
        recognition.interimResults = true;
        recognition.lang = language;
        
        recognition.onstart = () => {
          setState(prev => ({ ...prev, isListening: true, error: null }));
        };

        recognition.onresult = (event: any) => {
          let interim = "";
          let final = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          setState(prev => ({
            ...prev,
            transcript: final, // We will consume this
            interimTranscript: interim
          }));
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setState(prev => ({ ...prev, isListening: false, error: event.error }));
        };

        recognition.onend = () => {
          setState(prev => ({ ...prev, isListening: false }));
        };

        recognitionRef.current = recognition;
      }

      synthRef.current = window.speechSynthesis;
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      try {
        setState(prev => ({ ...prev, transcript: "", interimTranscript: "" }));
        recognitionRef.current.start();
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const speak = useCallback((text: string) => {
    if (synthRef.current) {
      // Cancel any current speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setState(prev => ({ ...prev, isSpeaking: true }));
      utterance.onend = () => setState(prev => ({ ...prev, isSpeaking: false }));
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setState(prev => ({ ...prev, isSpeaking: false }));
      };

      synthRef.current.speak(utterance);
    }
  }, [language]);

  const cancelSpeech = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: "", interimTranscript: "" }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    resetTranscript
  };
}
