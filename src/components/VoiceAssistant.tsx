
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, AlertCircle, Fuel } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VoiceAssistantProps {
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
  onPanelChange: (panel: string) => void;
}

// Enhanced intent patterns for flexible voice recognition
const INTENT_PATTERNS = {
  'loads': [
    'show loads', 'available loads', 'find loads', 'book loads', 'load options',
    'any loads', 'loads near', 'haul', 'freight', 'cargo', 'shipment',
    'what loads', 'see loads', 'load board', 'loads available', 'got loads',
    'show me loads', 'find me loads', 'available freight', 'any freight'
  ],
  'navigation': [
    'navigation', 'navigate', 'directions', 'route', 'where to go',
    'GPS', 'map', 'drive to', 'how to get', 'directions to'
  ],
  'documents': [
    'document', 'scan', 'upload', 'picture', 'photo', 'bill of lading',
    'receipt', 'paperwork', 'BOL', 'delivery receipt', 'proof of delivery'
  ],
  'fuel-weather': [
    'fuel', 'gas', 'weather', 'rain', 'snow', 'temperature',
    'fuel stop', 'gas station', 'weather update', 'forecast'
  ],
  'emergency': [
    'emergency', 'help', 'SOS', 'urgent', 'trouble', 'breakdown',
    'accident', 'medical', 'police', 'fire', 'ambulance'
  ],
  'dashboard': [
    'home', 'dashboard', 'main menu', 'back', 'main screen', 'overview'
  ],
  'fuel_check': [
    'fuel level', 'how much fuel', 'fuel status', 'gas level', 'fuel remaining'
  ],
  'weather_check': [
    'weather conditions', 'current weather', 'weather report', 'temperature'
  ]
};

// Simulate driver data
const DRIVER_STATUS = {
  fuelLevel: 25, // percentage
  currentLocation: 'Dallas, TX',
  hoursRemaining: 8.5,
  nextStop: 'Houston, TX',
  weatherAlert: 'Heavy rain expected in 2 hours'
};

// Calculate similarity score between two strings
const calculateSimilarity = (str1: string, str2: string): number => {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  let matches = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1.includes(word2) || word2.includes(word1)) {
        matches++;
      }
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
};

// Advanced intent matching function
const matchIntent = (transcript: string): { intent: string; confidence: number } => {
  let bestMatch = '';
  let bestScore = 0;
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      const score = calculateSimilarity(transcript, pattern);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = intent;
      }
    }
  }
  
  // Also check for direct word matches in transcript
  const lowerTranscript = transcript.toLowerCase();
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerTranscript.includes(pattern.toLowerCase())) {
        if (0.8 > bestScore) {
          bestScore = 0.8;
          bestMatch = intent;
        }
      }
    }
  }
  
  return { intent: bestMatch, confidence: bestScore };
};

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isListening,
  onListeningChange,
  onPanelChange,
}) => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastIntent, setLastIntent] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
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
          setTimeout(() => {
            recognitionRef.current?.start();
          }, 100);
        }
      };
    } else {
      setIsSupported(false);
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Set up periodic alerts
    const alertInterval = setInterval(() => {
      if (alertsEnabled) {
        checkAndAnnounceAlerts();
      }
    }, 60000); // Check every minute

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      clearInterval(alertInterval);
    };
  }, [alertsEnabled]);

  useEffect(() => {
    if (isListening && recognitionRef.current && isSupported) {
      setIsProcessing(true);
      recognitionRef.current.start();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsProcessing(false);
    }
  }, [isListening, isSupported]);

  const checkAndAnnounceAlerts = () => {
    const alerts = [];
    
    // Fuel alerts
    if (DRIVER_STATUS.fuelLevel <= 25) {
      alerts.push(`Fuel alert: You have ${DRIVER_STATUS.fuelLevel}% fuel remaining. Consider refueling soon.`);
    }
    
    // Hours of service alerts
    if (DRIVER_STATUS.hoursRemaining <= 2) {
      alerts.push(`Hours of service alert: You have ${DRIVER_STATUS.hoursRemaining} hours remaining. Plan your rest break.`);
    }
    
    // Weather alerts
    if (DRIVER_STATUS.weatherAlert) {
      alerts.push(`Weather alert: ${DRIVER_STATUS.weatherAlert}`);
    }
    
    // Announce random alert (simulate real-time alerts)
    if (alerts.length > 0 && Math.random() < 0.3) {
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      speak(randomAlert);
      setResponse(randomAlert);
    }
  };

  const processVoiceCommand = async (command: string) => {
    console.log('Processing voice command:', command);
    
    // Use advanced intent matching
    const { intent, confidence } = matchIntent(command);
    console.log('Matched intent:', intent, 'confidence:', confidence);
    
    setLastIntent(intent);
    let botResponse = '';
    let targetPanel = '';

    // Handle intents with confidence threshold
    if (confidence > 0.3) {
      switch (intent) {
        case 'loads':
          botResponse = `Opening load booking panel. I found 8 available loads in your area. The highest paying load is from Dallas to Houston at $1,250.`;
          targetPanel = 'loads';
          break;
        case 'navigation':
          botResponse = 'Opening navigation panel. Where would you like to go?';
          targetPanel = 'navigation';
          break;
        case 'documents':
          botResponse = 'Opening document scanner. You can upload bills of lading and receipts here.';
          targetPanel = 'documents';
          break;
        case 'fuel-weather':
          botResponse = `Opening fuel and weather panel. Current fuel level is ${DRIVER_STATUS.fuelLevel}%. Weather conditions: ${DRIVER_STATUS.weatherAlert}`;
          targetPanel = 'fuel-weather';
          break;
        case 'fuel_check':
          botResponse = `Your current fuel level is ${DRIVER_STATUS.fuelLevel}%. ${DRIVER_STATUS.fuelLevel <= 25 ? 'You should refuel soon. The nearest truck stop is 15 miles ahead.' : 'Fuel level is good for your next destination.'}`;
          break;
        case 'weather_check':
          botResponse = `Current weather conditions: ${DRIVER_STATUS.weatherAlert}. Drive safely and adjust your speed accordingly.`;
          break;
        case 'emergency':
          botResponse = 'Opening emergency panel. Stay calm, help is available. I can connect you to roadside assistance or emergency services.';
          targetPanel = 'emergency';
          break;
        case 'dashboard':
          botResponse = 'Going back to the main dashboard.';
          targetPanel = 'dashboard';
          break;
        default:
          botResponse = 'I\'m ready to help you drive safely! Try saying "show loads", "check fuel level", "weather update", or "emergency help".';
      }
    } else {
      // Fallback for low confidence or greetings
      const lowerCommand = command.toLowerCase();
      if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('hey')) {
        botResponse = `Hello! I'm FreightBot, your voice assistant. Currently you're in ${DRIVER_STATUS.currentLocation} with ${DRIVER_STATUS.fuelLevel}% fuel. I can help you with loads, navigation, fuel status, weather alerts, and emergency assistance. What do you need?`;
      } else {
        botResponse = 'I didn\'t quite understand that. Try saying "show loads", "check fuel level", "weather update", or "emergency help".';
      }
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
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
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
    speak(`FreightBot voice assistant is working perfectly. You currently have ${DRIVER_STATUS.fuelLevel}% fuel remaining. I'm ready to help you with your trucking needs.`);
  };

  const announceFuelStatus = () => {
    const fuelMessage = `Current fuel level is ${DRIVER_STATUS.fuelLevel}%. ${DRIVER_STATUS.fuelLevel <= 25 ? 'Fuel is running low. I recommend refueling at the next truck stop.' : 'Fuel level is adequate for your journey.'}`;
    speak(fuelMessage);
    setResponse(fuelMessage);
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
            <div className="flex space-x-1">
              <Button size="sm" variant="outline" onClick={announceFuelStatus}>
                <Fuel className="w-4 h-4 mr-1" />
                Fuel
              </Button>
              <Button size="sm" variant="outline" onClick={testSpeak}>
                <Volume2 className="w-4 h-4 mr-1" />
                Test
              </Button>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-50 p-2 rounded text-xs">
            <div className="flex justify-between">
              <span>Fuel: {DRIVER_STATUS.fuelLevel}%</span>
              <span className={DRIVER_STATUS.fuelLevel <= 25 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                {DRIVER_STATUS.fuelLevel <= 25 ? 'LOW' : 'OK'}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Hours: {DRIVER_STATUS.hoursRemaining}h</span>
              <span>Location: {DRIVER_STATUS.currentLocation}</span>
            </div>
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
              {lastIntent && (
                <p className="text-xs text-blue-600 mt-1">
                  <strong>Detected:</strong> {lastIntent}
                </p>
              )}
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

          <div className="text-xs text-gray-500 mt-2">
            <p><strong>Try saying:</strong></p>
            <p>"Show available loads"</p>
            <p>"Check my fuel level"</p>
            <p>"Weather conditions"</p>
            <p>"Emergency help"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;
