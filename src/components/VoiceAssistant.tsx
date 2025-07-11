
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VoiceAssistantProps {
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
  onPanelChange: (panel: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isListening,
  onListeningChange,
  onPanelChange,
}) => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsProcessing(false);
        onListeningChange(false);
      };

      recognitionRef.current.onend = () => {
        setIsProcessing(false);
        if (isListening) {
          // Restart recognition if it should still be listening
          setTimeout(() => {
            recognitionRef.current?.start();
          }, 100);
        }
      };
    } else {
      setIsSupported(false);
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isListening && recognitionRef.current && isSupported) {
      setIsProcessing(true);
      recognitionRef.current.start();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsProcessing(false);
    }
  }, [isListening, isSupported]);

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    let botResponse = '';
    let targetPanel = '';

    // Intent matching logic
    if (lowerCommand.includes('load') && (lowerCommand.includes('show') || lowerCommand.includes('find') || lowerCommand.includes('book'))) {
      botResponse = 'Opening load booking panel. I can help you find and book loads.';
      targetPanel = 'loads';
    } else if (lowerCommand.includes('navigation') || lowerCommand.includes('route') || lowerCommand.includes('direction')) {
      botResponse = 'Opening navigation panel. Where would you like to go?';
      targetPanel = 'navigation';
    } else if (lowerCommand.includes('document') || lowerCommand.includes('scan') || lowerCommand.includes('upload')) {
      botResponse = 'Opening document scanner. You can upload bills of lading and receipts.';
      targetPanel = 'documents';
    } else if (lowerCommand.includes('fuel') || lowerCommand.includes('weather') || lowerCommand.includes('gas')) {
      botResponse = 'Opening fuel and weather panel. Checking current conditions.';
      targetPanel = 'fuel-weather';
    } else if (lowerCommand.includes('emergency') || lowerCommand.includes('help') || lowerCommand.includes('sos')) {
      botResponse = 'Opening emergency panel. Stay calm, help is available.';
      targetPanel = 'emergency';
    } else if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('hey')) {
      botResponse = 'Hello! I\'m FreightBot, your voice assistant. I can help you with loads, navigation, documents, fuel, weather, and emergency assistance. What do you need?';
    } else if (lowerCommand.includes('dashboard') || lowerCommand.includes('home') || lowerCommand.includes('main')) {
      botResponse = 'Going back to the main dashboard.';
      targetPanel = 'dashboard';
    } else {
      botResponse = 'I didn\'t quite understand that. Try saying "show loads", "check weather", "scan document", or "emergency help".';
    }

    setResponse(botResponse);
    speak(botResponse);

    if (targetPanel) {
      setTimeout(() => {
        onPanelChange(targetPanel);
      }, 1000);
    }

    // Stop listening after processing command
    setTimeout(() => {
      onListeningChange(false);
    }, 2000);
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a more natural voice
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.includes('en-US')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      synthRef.current.speak(utterance);
    }
  };

  const testSpeak = () => {
    speak('FreightBot voice assistant is working perfectly. I\'m ready to help you with your trucking needs.');
  };

  if (!isSupported) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Voice not supported</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Please use Chrome or Safari for voice features
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-white shadow-lg border-2">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Mic className="w-4 h-4 mr-2" />
              FreightBot
            </h3>
            <Button size="sm" variant="outline" onClick={testSpeak}>
              <Volume2 className="w-4 h-4 mr-1" />
              Test Voice
            </Button>
          </div>

          {isListening && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Listening...</span>
            </div>
          )}

          {transcript && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>You said:</strong> "{transcript}"
              </p>
            </div>
          )}

          {response && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>FreightBot:</strong> {response}
              </p>
            </div>
          )}

          {isProcessing && (
            <div className="text-center">
              <div className="inline-flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;
