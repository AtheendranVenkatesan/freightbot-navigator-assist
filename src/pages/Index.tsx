import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Truck, MapPin, FileText, Fuel, AlertTriangle, Phone, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import VoiceAssistant from '@/components/VoiceAssistant';
import LoadBooking from '@/components/LoadBooking';
import NavigationPanel from '@/components/NavigationPanel';
import DocumentScanner from '@/components/DocumentScanner';
import FuelWeatherPanel from '@/components/FuelWeatherPanel';
import EmergencyPanel from '@/components/EmergencyPanel';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [activePanel, setActivePanel] = useState('dashboard');
  const [greeting, setGreeting] = useState('');
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Stay safe on the road!",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Truck },
    { id: 'loads', label: 'Load Booking', icon: MapPin },
    { id: 'navigation', label: 'Navigation', icon: MapPin },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'fuel-weather', label: 'Fuel & Weather', icon: Fuel },
    { id: 'emergency', label: 'Emergency', icon: Phone },
  ];

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'loads':
        return <LoadBooking />;
      case 'navigation':
        return <NavigationPanel />;
      case 'documents':
        return <DocumentScanner />;
      case 'fuel-weather':
        return <FuelWeatherPanel />;
      case 'emergency':
        return <EmergencyPanel />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
                <Truck className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {greeting}, {user?.email?.split('@')[0] || 'Driver'}!
              </h2>
              <p className="text-lg text-gray-600">
                FreightBot is ready to assist you. Try saying "Show me loads" or "Check fuel status"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {navigationItems.slice(1).map((item) => {
                const IconComponent = item.icon;
                return (
                  <Card 
                    key={item.id} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => setActivePanel(item.id)}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{item.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-center">
                      <p className="text-sm text-gray-600">
                        Voice enabled - just speak your command
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">System Status: Online</h3>
                    <p className="text-sm text-gray-600">
                      Voice assistant active • Weather monitoring • Route optimization enabled
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FreightPower</h1>
                <p className="text-sm text-gray-600">Voice Assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              
              <Button
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="flex items-center space-x-2"
                onClick={() => setIsListening(!isListening)}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Stop Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Start Voice</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activePanel === item.id ? "default" : "ghost"}
                    className="w-full justify-start text-left h-12"
                    onClick={() => setActivePanel(item.id)}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* Quick Emergency Button */}
            <Card className="mt-6 bg-red-50 border-red-200">
              <CardContent className="p-4">
                <Button 
                  variant="destructive" 
                  className="w-full h-12 text-lg font-semibold"
                  onClick={() => setActivePanel('emergency')}
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  SOS Emergency
                </Button>
                <p className="text-xs text-red-600 mt-2 text-center">
                  Say "Emergency" for instant help
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderActivePanel()}
          </div>
        </div>
      </div>

      {/* Voice Assistant Component */}
      <VoiceAssistant 
        isListening={isListening}
        onListeningChange={setIsListening}
        onPanelChange={setActivePanel}
      />
    </div>
  );
};

export default Index;
